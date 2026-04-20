package main

import (
	"go_backend/config"
	"go_backend/routes"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	router := gin.Default()

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	var FRONTEND_URL = os.Getenv("FRONTEND_URL")
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", FRONTEND_URL},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	}))
	config.ConnectDatabase()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "running",
			"message": "API is healthy",
		})
	})

	router.MaxMultipartMemory = 10 << 10 // 10MB
	userCollection := config.OpenCollection("users")
	routes.UserRoute(router, userCollection)
	routes.UserProtectedRoute(router, userCollection)

	if err := router.Run(":" + port); err != nil {
		log.Fatal(err)
	}

}
