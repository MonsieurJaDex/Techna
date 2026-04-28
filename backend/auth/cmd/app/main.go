package main

import (
	"Techna/internal/app/config"
	"Techna/internal/app/database"
	"Techna/internal/app/handlers"
	"Techna/internal/app/middleware"
	"Techna/internal/app/service"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func main() {
	config, err := config.LoadConfig(".env")
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": err.Error(),
		}).Error("Config initialization failure")

		return
	}

	db, err := database.SetupDatabase(config)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": err.Error(),
		}).Error("Database initialization failure")

		return
	}

	router := gin.Default()
	authRouter := router.Group("/auth")

	securedRouter := router.Group("/secure")
	securedRouter.Use(middleware.AuthMiddleware(config))

	apiRoutes := handlers.NewMainRoutes()
	authRoutes := handlers.AuthRoutes{
		Svc: &service.TokenSvc{DB: db, Config: config},
	}

	// main endpoints handling
	router.GET("/", apiRoutes.Index)

	// auth endpoints handling
	authRouter.GET("/signin", authRoutes.SignIn)

	securedRouter.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Authorized",
		})
	})

	logrus.Info("Starting up server at ", fmt.Sprintf("%s:%d", config.HostAddr, config.HostPort))
	router.Run(fmt.Sprintf("%s:%d", config.HostAddr, config.HostPort))
}
