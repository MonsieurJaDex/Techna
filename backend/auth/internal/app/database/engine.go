package database

import (
	"Techna/internal/app/config"
	"Techna/internal/app/database/models"
	"Techna/internal/app/utils"

	"github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupDatabase(config *config.Config) (*gorm.DB, error) {
	logrus.Info("database initializing...")

	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  utils.ExtractDSN(config),
		PreferSimpleProtocol: config.Debug,
	}), &gorm.Config{
		TranslateError: true,
	})

	if err != nil {
		return nil, err
	}

	logrus.Info("database initialized successfully")

	// Initializing and migrate models

	logrus.Info("migrating database models...")

	err = db.AutoMigrate(&models.RefreshToken{}, &models.Employee{})
	if err != nil {
		return nil, err
	}

	logrus.Info("migrating database models... done")

	return db, nil
}
