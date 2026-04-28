package dto

import "Techna/internal/app/enum"

type EmployeeDto struct {
	Email     string    `gorm:"unique" validate:"required,email"`
	Phone     string    `validate:"required,e164"`
	FirstName string    `validate:"required"`
	LastName  string    `validate:"required"`
	Age       uint8     `validate:"required,gt=14"`
	Role      enum.Role `validate:"required"`
}
