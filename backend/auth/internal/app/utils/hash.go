package utils

import (
	"crypto/sha256"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func Hash(data string) string {
	hasher := sha256.New()
	hasher.Write([]byte(data))

	return fmt.Sprintf("%x", hasher.Sum(nil))
}

func HashPassword(data string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(data), 12)
	if err != nil {
		return "", err
	}

	return string(hashed), nil
}
