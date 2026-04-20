package middleware

import (
	"errors"
	"go_backend/utils"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

var ACCESS_TOKEN_SECRET = os.Getenv("ACCESS_TOKEN_SECRET")
var REFRESH_TOKEN_SECRET = os.Getenv("REFRESH_TOKEN_SECRET")

func GetAccessTokenFromHeader(ctx *gin.Context) (string, error) {
	token := ctx.GetHeader("Authorization")
	if token == "" {
		return "", errors.New("No token provided")
	}

	if !strings.HasPrefix(token, "Bearer ") {
		return "", errors.New("Invalid token format")
	}
	tokenString := token[len("Bearer "):]
	if tokenString == "" {
		return "", errors.New("Invalid token format")
	}
	return tokenString, nil
}

func GetAccessTokenFromCookie(ctx *gin.Context) (string, error) {
	token, err := ctx.Cookie("access_token")
	if err != nil {
		return "", errors.New("No token provided")
	}
	if token == "" {
		return "", errors.New("Invalid token format")
	}

	return token, nil
}

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString, err := GetAccessTokenFromHeader(ctx)
		if err != nil {
			tokenString, err = GetAccessTokenFromCookie(ctx)
		}

		if tokenString == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization token not provided",
			})
			ctx.Abort()
			return
		}

		claims, msg := utils.ValidateToken(tokenString, ACCESS_TOKEN_SECRET)

		if msg != "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": msg,
			})
			ctx.Abort()
			return
		}

		ctx.Set("userId", claims.UserID)
		ctx.Set("role", claims.Role)
		ctx.Set("username", claims.Username)
		ctx.Set("email", claims.Email)

		ctx.Next()
	}
}
