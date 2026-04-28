package service

import (
	"Techna/internal/app/config"
	"Techna/internal/app/database/models"
	"context"

	"gorm.io/gorm"
)

type EmployeeSvc struct {
	DB     *gorm.DB
	Config *config.Config
}

func (svc *EmployeeSvc) FindByEmail(email string) (*models.Employee, error) {
	employee, err := gorm.G[models.Employee](svc.DB).Where("email = ?", email).First(context.Background())
	if err != nil {
		return nil, err
	}

	return &employee, nil
}
