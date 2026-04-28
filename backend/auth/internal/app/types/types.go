package types

import (
	"Techna/internal/app/utils"

	"github.com/golang-jwt/jwt/v5"
)

type JwtClaims struct {
	Payload *PayloadDto
	jwt.RegisteredClaims
}

type TokensDto struct {
	Access  string
	Refresh string
}

type PayloadDto struct {
	Email string `validator:"email"`
	Seed  string
}

func (p PayloadDto) String() string {
	str, err := utils.PayloadToString(p)
	if err != nil {
		return "PayLoadDTO_default_text"
	}

	return str
}
