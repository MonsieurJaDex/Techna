package config

import (
	"errors"
	"os"
	"reflect"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

// Config model definition
type Config struct {
	Debug      bool
	DbName     string
	DbUser     string
	DbPassword string
	DbHost     string
	DbPort     uint16
	HostPort   uint16
	HostAddr   string
	Secret     string
}

// LoadConfig - config loading method
func LoadConfig(envPath string) (*Config, error) {
	// try load variables from .env to PATH
	err := godotenv.Load(envPath)

	if err != nil {
		return nil, errors.New(envPath + " was not found")
	}

	// parse and validate fields

	dbPort, err := strconv.ParseUint(os.Getenv("DB_PORT"), 10, 16)
	if err != nil {
		return nil, err
	}

	hostPort, err := strconv.ParseUint(os.Getenv("HOST_PORT"), 10, 16)
	if err != nil {
		return nil, err
	}

	debug, err := strconv.ParseBool(strings.ToLower(os.Getenv("DEBUG")))
	if err != nil {
		return nil, err
	}

	appConfig := Config{
		Debug:      debug,
		DbName:     os.Getenv("DB_NAME"),
		DbUser:     os.Getenv("DB_USER"),
		DbPassword: os.Getenv("DB_PASSWORD"),
		DbHost:     os.Getenv("DB_HOST"),
		DbPort:     uint16(dbPort),
		HostPort:   uint16(hostPort),
		HostAddr:   os.Getenv("HOST_ADDR"),
		Secret:     os.Getenv("SECRET"),
	}

	// check for empty data

	appConfigTypeReflection := reflect.TypeFor[Config]()
	appConfigValueReflection := reflect.ValueOf(appConfig)

	for i := 0; i < appConfigTypeReflection.NumField(); i++ {
		if appConfigValueReflection.Field(i).Interface() == "" {
			return nil, errors.New(appConfigTypeReflection.Field(i).Name + " missing or empty")
		}
	}

	return &appConfig, nil
}
