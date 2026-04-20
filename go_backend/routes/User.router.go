package routes

import (
	"go_backend/controllers"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func UserRoute(router *gin.Engine, userCollection *mongo.Collection) {
	userRoutes := router.Group("/users-public")
	{
		userRoutes.POST("/register", controllers.CreateUser(userCollection))
		userRoutes.POST("/login", controllers.UserLogin(userCollection))
		userRoutes.POST("/refresh-token", controllers.UpdateAccessToken(userCollection))
	}

}
