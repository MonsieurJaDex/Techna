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
	"time"

	"gorm.io/gorm"
)

type TokenSvc struct {
	DB     *gorm.DB
	Config *config.Config
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

	current_refresh, err := gorm.G[models.RefreshToken](svc.DB).First(context.Background())
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
