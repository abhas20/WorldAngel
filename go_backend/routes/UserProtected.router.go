package routes

import (
	"go_backend/controllers"
	"go_backend/middleware"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func UserProtectedRoute(router *gin.Engine, userCollection *mongo.Collection) {
	router.Use(middleware.AuthMiddleware())
	userRoutes := router.Group("/users")
	{
		userRoutes.GET("/getProfile", controllers.GetUserByIDorUsername(userCollection))
		userRoutes.POST("/logout", controllers.UserLogout(userCollection))
		userRoutes.PUT("/change-password", controllers.ChangePassword(userCollection))
		userRoutes.POST("/update-avatar", controllers.UpdateUserAvatar(userCollection))
	}
}
