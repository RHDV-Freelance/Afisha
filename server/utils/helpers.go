package utils

import (
	"github.com/oschwald/geoip2-golang"
	"net/http"
	"os"
)

func GetCityFromRequest(r *http.Request, db *geoip2.Reader) string {
	city := r.URL.Query().Get("city")

	if city == "" {
		city = GetCityByIP(GetIP(r), db)
	}

	if city == "" {
		city = os.Getenv("DEFAULT_CITY")
	}

	return city
}
