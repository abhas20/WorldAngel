package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Capitalize the struct name to make it exported and accessible from other packages
// Lowercase field names to ensure they are unexported and not accessible from other packages

type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Username     string             `bson:"username" json:"username" validate:"required,min=2"`
	Email        string             `bson:"email" json:"email"`
	Password     string             `bson:"password" json:"password" validate:"required"`
	Role         string             `bson:"role" json:"role" validate:"required,oneof=admin user"`
	Avatar       string             `bson:"avatar" json:"avatar"`
	RefreshToken string             `bson:"refresh_token,omitempty" json:"refresh_token,omitempty"`
	CreatedAt    primitive.DateTime `bson:"created_at,omitempty" json:"created_at,omitempty"`
	UpdatedAt    time.Time          `bson:"updated_at,omitempty" json:"updated_at"`
}

type UserResponse struct {
	ID           primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username     string             `json:"username,omitempty"`
	Email        string             `json:"email,omitempty"`
	Avatar       string             `json:"avatar,omitempty"`
	Role         string             `json:"role,omitempty"`
	Token        string             `json:"token,omitempty"`
	RefreshToken string             `json:"refresh_token,omitempty"`
}

type UserLogin struct {
	Identifier string `json:"identifier,omitempty"`
	Password   string `json:"password,omitempty"`
}
