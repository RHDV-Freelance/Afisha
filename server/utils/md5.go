package utils

import (
	"crypto/md5"
	"encoding/hex"
)

func GetMD5Hash(str string) string {
	data := []byte(str)
	hash := md5.Sum(data)
	hashStr := hex.EncodeToString(hash[:])

	return hashStr
}
