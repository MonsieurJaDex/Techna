package service

import (
	"Techna/internal/app/config"
	"Techna/internal/app/database/models"
	"Techna/internal/app/jwt"
	"Techna/internal/app/types"
	"Techna/internal/app/utils"
	"Techna/internal/dto"
	"context"
	"errors"
	"fmt"
	"math/rand/v2"
	"time"

	"gorm.io/gorm"
)

type TokenSvc struct {
	DB     *gorm.DB
	Config *config.Config
}

func (svc *TokenSvc) RenewAccessToken(refreshToken string) (string, string, error) {
	token, err := gorm.G[models.RefreshToken](svc.DB).Where("token_hash = ?", utils.Hash(refreshToken)).Last(context.Background())
	if err != nil {
		return "", "", err
	}

	if token.ExpiresAt.Unix() < time.Now().Unix() {
		gorm.G[models.RefreshToken](svc.DB).Where("id = ?", token.ID).Delete(context.Background())
		return "", "", errors.New("refresh token expired")
	}

	employee, err := gorm.G[models.Employee](svc.DB).Where("id = ?", token.EmployeeID).First(context.Background())
	if err != nil {
		return "", "", err
	}

	payload := types.PayloadDto{
		Email: employee.Email,
		Seed:  fmt.Sprint(rand.Int()),
	}

	new_token, err := jwt.GenerateAccessToken(&payload, svc.Config.Secret)
	if err != nil {
		return "", "", err
	}

	new_refresh := jwt.GenerateRefreshToken(&payload, svc.Config.Secret)

	new_refresh_token := models.RefreshToken{
		TokenHash:  utils.Hash(new_refresh),
		EmployeeID: employee.ID,
		ExpiresAt:  time.Now().Add(time.Hour * 24 * 30),
		Revoked:    false,
	}

	gorm.G[models.RefreshToken](svc.DB).Where("token_hash = ?", utils.Hash(refreshToken)).Delete(context.Background())

	err = gorm.G[models.RefreshToken](svc.DB).Create(context.Background(), &new_refresh_token)
	if err != nil {
		return "", "", err
	}
	return new_token, new_refresh, nil
}

func (svc *TokenSvc) Create(payload *types.PayloadDto, authData *dto.AuthDTO) (*types.TokensDto, error) {
	employee, err := gorm.G[models.Employee](svc.DB).Where("email = ? AND password = ?", authData.Email, authData.Password).Take(context.Background())
	if err != nil {
		return nil, errors.New("employee email or password is incorrect")
	}

	access, err := jwt.GenerateAccessToken(payload, svc.Config.Secret)
	if err != nil {
		return nil, err
	}

	current_refresh, err := gorm.G[models.RefreshToken](svc.DB).Where("employee_id = ?", employee.ID).Last(context.Background())
	if err == nil {
		if time.Now().Unix() < current_refresh.ExpiresAt.Unix() {
			return &types.TokensDto{
				Access:  access,
				Refresh: current_refresh.TokenHash,
			}, nil
		}
	}

	refresh := jwt.GenerateRefreshToken(payload, svc.Config.Secret)

	token := models.RefreshToken{
		TokenHash:  utils.Hash(refresh),
		EmployeeID: employee.ID,
		ExpiresAt:  time.Now().Add(time.Hour * 24 * 30),
		Revoked:    false,
	}

	err = gorm.G[models.RefreshToken](svc.DB).Create(context.Background(), &token)
	if err != nil {
		return nil, err
	}

	return &types.TokensDto{
		Access:  access,
		Refresh: refresh,
	}, nil
}
