package dto

type AuthDTO struct {
	Email    string `validate:"required,email"`
	Password string `validate:"required"`
}
