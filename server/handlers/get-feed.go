package handlers

import (
	"encoding/json"
	"github.com/go-redis/redis"
	"github.com/oschwald/geoip2-golang"
	"gitlab.com/afisha2/go-feed/server/feed"
	"gitlab.com/afisha2/go-feed/server/utils"
	"net/http"
	"time"
)

type FeedResponse struct {
	City         string       `json:"city"`
	Coords       [2]float32   `json:"coords"`
	Cities       []string     `json:"cities"`
	Tags         []string     `json:"tags"`
	Events       []feed.Event `json:"events"`
	GenerateTime float32      `json:"time"`
}

func GetFeed(w http.ResponseWriter, r *http.Request, db *geoip2.Reader, client *redis.Client) {
	startTime := time.Now()

	setDefaultHeaders(w)

	var result []byte
	var err error

	response := FeedResponse{}
	response.City = utils.GetCityFromRequest(r, db)
	response.Coords = utils.GetCoordsByCity(response.City)
	response.Events, err = feed.GetFeed(response.City, client)

	if err != nil {
		result, _ = json.Marshal(response)
		w.Write(result)
		return
	}

	response.Tags = feed.GetTags(&response.Events)
	response.Cities = feed.GetCities(client)

	filters, hasFilter := feed.BuildFilter(r)
	if hasFilter {
		response.Events = feed.FilterFeed(response.Events, filters)
	}

	elapsedTime := time.Since(startTime)
	response.GenerateTime = float32(elapsedTime.Milliseconds()) / 1000

	result, _ = json.Marshal(response)
	w.Write(result)
}
