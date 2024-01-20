package utils

import (
	"github.com/oschwald/geoip2-golang"
	"log"
	"net"
	"net/http"
)

func GetIP(r *http.Request) string {
	ip := r.URL.Query().Get("ip")

	if ip == "" {
		ip, _, _ = net.SplitHostPort(readUserIP(r))
	}

	return ip
}

func GetCityByIP(ip string, db *geoip2.Reader) string {
	record, err := db.City(net.ParseIP(ip))

	if err != nil {
		log.Println(err)
		return ""
	}

	if record.Country.Names["ru"] != "Россия" {
		return ""
	}

	return record.City.Names["ru"]
}

func readUserIP(r *http.Request) string {
	address := r.Header.Get("X-Original-Forwarded-For")
	if address == "" {
		address = r.Header.Get("X-Forwarded-For")
	}

	if address == "" {
		address = r.Header.Get("X-Real-Ip")
	}

	if address == "" {
		address = r.RemoteAddr
	}

	return address
}
