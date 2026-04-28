package middleware

import (
	"Techna/internal/app/config"
	"Techna/internal/app/jwt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(config *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("Authorization")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Authorization token was not provided in request body",
			})
		}

		claims, err := jwt.ParseToken(token, config.Secret)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": err.Error(),
			})
		}

		if claims == nil {
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		if claims.ExpiresAt.Unix() < time.Now().Unix() {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "access token expired",
			})
		}

		c.Set("claims", claims)
		c.Next()
	}
}
