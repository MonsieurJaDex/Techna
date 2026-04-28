package utils

import (
	"Techna/internal/app/config"
	"fmt"
)

func ExtractDSN(config *config.Config) string {
	return fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%d sslmode=disable TimeZone=Europe/Moscow",
		config.DbUser,
		config.DbPassword,
		config.DbName,
		config.DbHost,
		config.DbPort,
	)
}
