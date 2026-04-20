package utils

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type SignedDetails struct {
	Email    string
	Username string
	UserID   string
	Role     string
	jwt.RegisteredClaims
}

var ACCESS_TOKEN_SECRET = os.Getenv("ACCESS_TOKEN_SECRET")
var REFRESH_TOKEN_SECRET = os.Getenv("REFRESH_TOKEN_SECRET")

func GenerateAllTokens(email string, username string, id string, role string) (signedToken string, signedRefreshToken string, err error) {
	claims := &SignedDetails{
		Email:    email,
		Username: username,
		UserID:   id,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "Ryalo",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 15)), // 15 minutes
		},
	}

	refreshClaims := &SignedDetails{
		Email:    email,
		Username: username,
		UserID:   id,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "Ryalo",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 168)), // 7days
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(ACCESS_TOKEN_SECRET))
	if err != nil {
		return "", "", err
	}

	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(REFRESH_TOKEN_SECRET))
	if err != nil {
		return "", "", err
	}

	return token, refreshToken, nil
}

// func updateAllTokens(signedToken string, signedRefreshToken string, userId string) (signedToken string, signedRefreshToken string, err error) {

// 	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
// 	defer cancel()

// 	updatedData := bson.M{
// 		"$set": bson.M{
// 			"token": signedToken,
// 			"refresh_token": signedRefreshToken,
// 			"updated_at": time.Now(),
// 		},
// 	}

// }

func ValidateToken(signedToken string, secret string) (claims *SignedDetails, msg string) {

	claims = &SignedDetails{}
	token, err := jwt.ParseWithClaims(signedToken, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil {
		msg = err.Error()
		return nil, msg
	}

	if claims.ExpiresAt.Time.Before(time.Now()) {
		msg = "Token is expired"
		return nil, "Token is expired"
	}

	if !token.Valid {
		msg = "Invalid token"
		return nil, msg
	}

	return claims, ""

}
