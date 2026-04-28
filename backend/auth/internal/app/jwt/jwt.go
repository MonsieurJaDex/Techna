package jwt

import (
	"Techna/internal/app/types"
	"Techna/internal/app/utils"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateRefreshToken(payload *types.PayloadDto, secret string) string {
	iat := time.Now().Unix()

	token := fmt.Sprintf("%s_%s_%d", payload, secret, iat)

	return utils.Hash(token)
}

func GenerateAccessToken(payload *types.PayloadDto, secret string) (string, error) {
	iat := time.Now()

	claims := types.JwtClaims{
		Payload: payload,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(iat.Add(time.Hour * 1)),
			IssuedAt:  jwt.NewNumericDate(iat),
			Issuer:    "auth",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secret))
}

func ParseToken(tokenString string, secret string) (*types.JwtClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &types.JwtClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*types.JwtClaims); ok {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}
