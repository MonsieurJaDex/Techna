package dto

import "time"

type RefreshTokenDto struct {
	TokenHash string    `gorm:"unique" json:"token"`
	UserID    uint      `json:"user_id"`
	ExpiresAt time.Time `json:"expires_at"`
	Revoked   bool      `gorm:"default:false"`
}
