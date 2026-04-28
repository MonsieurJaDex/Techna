package models

import (
	"time"

	"gorm.io/gorm"
)

type RefreshToken struct {
	gorm.Model
	TokenHash  string    `gorm:"unique" json:"token"`
	EmployeeID uint      `json:"user_id"`
	ExpiresAt  time.Time `json:"expires_at"`
	Revoked    bool      `gorm:"default:false"`
}
