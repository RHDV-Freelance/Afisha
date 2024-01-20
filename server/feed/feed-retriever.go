package feed

import (
	"encoding/json"
	"github.com/beevik/etree"
	"github.com/go-redis/redis"
	"gitlab.com/afisha2/go-feed/server/utils"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

type Event struct {
	Creation struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Image       string `json:"image"`
		URL         string `json:"url"`
	} `json:"creation"`
	Place    string     `json:"place"`
	City     string     `json:"city"`
	Coords   [2]float32 `json:"coords"`
	Dates    []string   `json:"dates"`
	Tags     []string   `json:"tags"`
	MinPrice string     `json:"minPrice"`
}

type Filter struct {
	Tags       []string
	OnlyActive bool
}

func GetFeed(city string, client *redis.Client) ([]Event, error) {
	result, err := client.Get(getFeedRedisKey(city)).Result()

	if err == nil {
		var retrievedEvents []Event
		if json.Unmarshal([]byte(result), &retrievedEvents) == nil {
			return retrievedEvents, nil
		}
	}

	feedFromFile, cities := getFeedFromFile(city)
	saveFeedRedisToCache(client, city, feedFromFile)
	saveCitiesToCache(client, cities)

	return feedFromFile, nil
}

func GetTags(events *[]Event) []string {
	uniqueMap := make(map[string]bool)
	var uniqueTags []string

	for _, event := range *events {
		for _, tag := range event.Tags {
			if _, ok := uniqueMap[tag]; !ok {
				uniqueMap[tag] = true
				uniqueTags = append(uniqueTags, tag)
			}
		}
	}

	return uniqueTags
}

// GetCities переписать с использованием норм бд, а пока имеем только редис
func GetCities(client *redis.Client) []string {
	var cities []string

	result, err := client.Get("cities").Result()

	if err != nil {
		log.Println(err)

		return cities
	}

	json.Unmarshal([]byte(result), &cities)

	return cities
}

func BuildFilter(r *http.Request) (*Filter, bool) {
	var filter = &Filter{}
	var hasFilters = false

	tags := r.URL.Query()["tag[]"]
	if len(tags) > 0 {
		filter.Tags = tags
		hasFilters = true
	}

	if r.URL.Query().Get("all") != "yes" {
		filter.OnlyActive = true
		hasFilters = true
	} else {
		filter.OnlyActive = false
	}

	return filter, hasFilters
}

// FilterFeed переместить ивенты в бд
func FilterFeed(feed []Event, filter *Filter) []Event {
	feed = filterByTags(feed, filter)
	feed = filterByDate(feed, filter)

	return feed
}

func filterByTags(feed []Event, filter *Filter) []Event {
	if len(filter.Tags) == 0 {
		return feed
	}

	var tagsMap = make(map[string]bool)
	for _, tag := range filter.Tags {
		if tag != "" {
			tagsMap[tag] = true
		}
	}

	if len(tagsMap) == 0 {
		return feed
	}

	var filteredFeed []Event

OUTER:
	for _, event := range feed {
		for _, eventTag := range event.Tags {
			if tagsMap[eventTag] == true {
				filteredFeed = append(filteredFeed, event)
				continue OUTER
			}
		}
	}

	return filteredFeed
}

func filterByDate(feed []Event, filter *Filter) []Event {
	if filter.OnlyActive == false {
		return feed
	}

	currentTime := time.Now()
	var filteredFeed []Event

OUTER:
	for _, event := range feed {
		for _, eventDate := range event.Dates {
			date, _ := time.Parse("2006-01-02", eventDate)
			if !date.Before(currentTime) {
				filteredFeed = append(filteredFeed, event)
				continue OUTER
			}
		}
	}

	return filteredFeed
}

func saveCitiesToCache(client *redis.Client, cities []string) {
	jsonCities, err := json.Marshal(cities)

	if err == nil {
		err = client.Set("cities", jsonCities, 0).Err()
	}

	if err != nil {
		log.Println("Ошибка при сохранении городов в Redis:", err)
	}
}

func saveFeedRedisToCache(client *redis.Client, city string, feed interface{}) {
	ttl, _ := strconv.ParseInt(os.Getenv("CACHE_TTL"), 10, 64)
	duration := time.Duration(ttl)
	jsonFeed, err := json.Marshal(feed)

	if err == nil {
		err = client.Set(getFeedRedisKey(city), jsonFeed, duration*time.Second).Err()
	}

	if err != nil {
		log.Println("Ошибка при сохранении фида в Redis:", err)
	}
}

func getFeedRedisKey(city string) string {
	return "events:" + utils.GetMD5Hash(city)
}

func getFeedFromFile(city string) ([]Event, []string) {
	var filteredEvents []Event
	var cities []string
	var uniqueCitiesMap = make(map[string]bool)

	doc := etree.NewDocument()
	if err := doc.ReadFromFile(os.Getenv("FEED_FILE_PATH")); err != nil {
		log.Fatal(err)
	}

	root := doc.SelectElement("festivals")
	events := root.SelectElement("events")

	for _, event := range events.SelectElements("event") {

		eventCity := event.SelectElement("city").SelectElement("name").Text()
		uniqueCitiesMap[eventCity] = true

		if eventCity == city {
			var e Event

			creation := event.SelectElement("creation")
			e.Creation.Name = creation.SelectElement("name").Text()
			e.Creation.Description = strings.TrimSpace(creation.SelectElement("description").Text())
			e.Creation.URL = creation.SelectElement("url").Text()
			e.Creation.Image = strings.TrimSpace(creation.SelectElement("image").Text())

			e.Place = event.SelectElement("place").SelectElement("name").Text()
			e.City = event.SelectElement("city").SelectElement("name").Text()
			e.Coords = utils.GetCoordsByCity(e.City)
			e.MinPrice = event.SelectElement("minPrice").Text()

			dates := event.SelectElement("dates")
			for _, date := range dates.SelectElements("date") {
				e.Dates = append(e.Dates, date.Text())
			}

			tags := event.SelectElement("tags")
			for _, tag := range tags.SelectElements("tag") {
				e.Tags = append(e.Tags, tag.Text())
			}

			filteredEvents = append(filteredEvents, e)
		}
	}

	for c, _ := range uniqueCitiesMap {
		cities = append(cities, c)
	}

	return filteredEvents, cities
}
