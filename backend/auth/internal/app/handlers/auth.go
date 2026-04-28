package handlers

import (
	"Techna/internal/app/service"
	"Techna/internal/app/types"
	"Techna/internal/dto"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand/v2"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type AuthRoutes struct {
	Svc *service.TokenSvc
}

func (r *AuthRoutes) GetNewAccessToken(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Reading body error",
		})
		return
	}

	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(c.Request.Body)

	if len(body) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Empty body",
		})
		return
	}

	var object dto.RefreshDto

	err = json.Unmarshal(body, &object)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to unmarshal JSON",
		})
		return
	}

	// validate body
	validate := validator.New(validator.WithRequiredStructEnabled())
	err = validate.Struct(object)

	var errs validator.ValidationErrors
	errors.As(err, &errs)

	errorString := ""

	if len(errs) > 0 {
		for _, err := range errs {
			errorString += fmt.Sprintf("%s: %s\r", err.Field(), err.Error())
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"message": errorString,
		})
		return
	}

	newAccess, newRefresh, err := r.Svc.RenewAccessToken(object.RefreshToken)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, struct {
		AccessToken  string `json:"access_token"`
		RefreshToken string `json:"refresh_token"`
	}{
		AccessToken:  newAccess,
		RefreshToken: newRefresh,
	})
}

func (r *AuthRoutes) SignIn(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Reading body error",
		})
		return
	}

	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(c.Request.Body)

	if len(body) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Empty body",
		})
		return
	}

	var object dto.AuthDTO

	err = json.Unmarshal(body, &object)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to unmarshal JSON",
		})
		return
	}

	// validate body
	validate := validator.New(validator.WithRequiredStructEnabled())
	err = validate.Struct(object)

	var errs validator.ValidationErrors
	errors.As(err, &errs)

	errorString := ""

	if len(errs) > 0 {
		for _, err := range errs {
			errorString += fmt.Sprintf("%s: %s\r", err.Field(), err.Error())
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"message": errorString,
		})
		return
	}

	tokens, err := r.Svc.Create(&types.PayloadDto{
		Email: object.Email,
		Seed:  fmt.Sprint(rand.Int()),
	}, &object)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, tokens)
}
