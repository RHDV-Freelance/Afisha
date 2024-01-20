package main

import (
	"github.com/go-redis/redis"
	"gitlab.com/afisha2/go-feed/server/handlers"
	"log"
	"net/http"
	"os"

	"github.com/oschwald/geoip2-golang"
)

func main() {

	db, err := geoip2.Open(os.Getenv("MMDB_FILE_PATH"))
	if err != nil {
		log.Fatal(err)
	}

	client := redis.NewClient(&redis.Options{
		Addr: "redis:6379",
	})

	defer db.Close()
	defer client.Close()

	http.HandleFunc("/get-feed", func(w http.ResponseWriter, r *http.Request) {
		handlers.GetFeed(w, r, db, client)
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
