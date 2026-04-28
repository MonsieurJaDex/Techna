package models

import (
	"Techna/internal/dto"

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	dto.EmployeeDto
	Password string `validate:"required"`
}
