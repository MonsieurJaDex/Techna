package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type MainRoutes struct {
}

func NewMainRoutes() *MainRoutes {
	return &MainRoutes{}
}

func (r *MainRoutes) Index(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"description": "Auth service",
		"timestamp":   time.Now().UTC().Unix(),
	})
}
