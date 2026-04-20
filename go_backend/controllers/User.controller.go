package controllers

import (
	"context"
	"go_backend/config"
	"go_backend/models"
	"go_backend/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var vallidator = validator.New()

// CREATE USER CONTROLLER
func CreateUser(userCollection *mongo.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second) // create a context with a timeout of 100 seconds
		defer cancel()                                                               // ensure that the context is canceled when the function returns

		var user models.User

		if err := c.ShouldBindJSON(&user); err != nil { // bind the JSON body of the request to the user struct
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if err := vallidator.Struct(user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		count, err := userCollection.CountDocuments(ctx, bson.M{
			"$or": []bson.M{
				{"email": user.Email},
				{"username": user.Username},
			},
		})

		if err != nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Error occurred while checking for existing user"})
			return
		}
		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email or Username already exists"})
			return
		}

		hashedPassword, err := config.HashPassword(user.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while hashing password"})
			return
		}
		user.Password = hashedPassword

		user.ID = primitive.NewObjectID()
		user.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
		user.UpdatedAt = time.Now()

		result, err := userCollection.InsertOne(ctx, user) // insert the user into the database
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while creating user"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "User created Successfully", "user_id": result.InsertedID})

	}
}

// USER LOGIN CONTROLLER
func UserLogin(userCollection *mongo.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {

		var userLogin models.UserLogin

		if err := c.ShouldBindJSON(&userLogin); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), time.Second*100)
		defer cancel()

		var foundUser models.User

		err := userCollection.FindOne(ctx, bson.M{
			"$or": []bson.M{
				{"username": userLogin.Identifier},
				{"email": userLogin.Identifier},
			},
		}).Decode(&foundUser)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}

		isCorect := config.CheckPassword(foundUser.Password, userLogin.Password)

		if !isCorect {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
			return
		}

		token, refreshtoken, err := utils.GenerateAllTokens(foundUser.Email, foundUser.Username, foundUser.ID.Hex(), foundUser.Role)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while generating tokens"})
			return
		}

		_, err = userCollection.UpdateOne(ctx, bson.M{"_id": foundUser.ID}, bson.M{
			"$set": bson.M{
				"refresh_token": refreshtoken,
				"updated_at":    time.Now(),
			},
		})

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while updating refresh token"})
			return
		}

		c.SetCookie("access_token", token, 900, "/", "localhost", false, true)            // 900 seconds = 15 minutes
		c.SetCookie("refresh_token", refreshtoken, 604800, "/", "localhost", false, true) // 604800 seconds = 7 days

		c.JSON(http.StatusOK, models.UserResponse{
			ID:           foundUser.ID,
			Username:     foundUser.Username,
			Email:        foundUser.Email,
			Role:         foundUser.Role,
			Avatar:       foundUser.Avatar,
			Token:        token,
			RefreshToken: refreshtoken,
		})
	}
}

// USER LOGOUT CONTROLLER
func UserLogout(userCollection *mongo.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.GetString("userId")

		if userId == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), time.Second*100)
		defer cancel()

		updatedData := bson.M{
			"$set": bson.M{
				"refresh_token": "",
				"updated_at":    time.Now(),
			},
		}

		objId, err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		_, err = userCollection.UpdateOne(ctx, bson.M{"_id": objId}, updatedData)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while logging out"})
			return
		}

		c.SetCookie("access_token", "", -1, "/", "localhost", false, true)
		c.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)

		c.JSON(http.StatusOK, gin.H{"message": "User logged out successfully"})
	}
}

// GET USER BY ID OR USERNAME CONTROLLER
func GetUserByIDorUsername(userCollection *mongo.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var IdorUsername struct {
			ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
			Username string             `json:"username,omitempty" bson:"username,omitempty"`
		}

		userId := c.GetString("userId")
		if userId != "" {
			objId, err := primitive.ObjectIDFromHex(userId)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
				return
			}

			IdorUsername.ID = objId
		}

		IdorUsername.Username = c.GetString("username")

		var foundUser models.UserResponse

		err := userCollection.FindOne(ctx, bson.M{
			"$or": []bson.M{
				{"_id": IdorUsername.ID},
				{"username": IdorUsername.Username},
			},
		}).Decode(&foundUser)

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "User Found", "user": foundUser})

	}
}

// CHANGE PASSWORD CONTROLLER
func ChangePassword(userCollection *mongo.Collection) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		c, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var passwordData struct {
			OldPassword string `json:"old_password" validate:"required"`
			NewPassword string `json:"new_password" validate:"required"`
		}

		userId := ctx.GetString("userId")
		username := ctx.GetString("username")
		// fmt.Println(userId)
		// fmt.Println(username)

		if err := ctx.ShouldBindJSON(&passwordData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := vallidator.Struct(passwordData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		objId, err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		var foundUser models.User

		err = userCollection.FindOne(c, bson.M{
			"$or": []bson.M{
				{"_id": objId},
				{"username": username},
			},
		}).Decode(&foundUser)

		if err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		isCorrect := config.CheckPassword(foundUser.Password, passwordData.OldPassword)
		if !isCorrect {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid old password"})
			return
		}

		hashedPassword, err := config.HashPassword(passwordData.NewPassword)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while hashing new password"})
			return
		}

		_, err = userCollection.UpdateOne(c, bson.M{"_id": foundUser.ID}, bson.M{
			"$set": bson.M{
				"password":   hashedPassword,
				"updated_at": time.Now(),
			},
		})

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while updating password"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
	}
}

// UPDATE USER AVATAR CONTROLLER
func UpdateUserAvatar(userCollection *mongo.Collection) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userId := ctx.GetString("userId")

		if userId == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		file, err := ctx.FormFile("avatar")
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
			return
		}

		var maxFileSize int64 = 10 * 1024 * 1024 // 20MB in bytes
		if file.Size > maxFileSize {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "File is too large. Max size is 10MB",
			})
			return
		}

		src, err := file.Open()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while opening file"})
			return
		}
		defer src.Close()

		avatarUrl, err := utils.UploadToCloudinary(src)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while uploading file"})
			return
		}

		objId, err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		_, err = userCollection.UpdateOne(ctx, bson.M{"_id": objId}, bson.M{
			"$set": bson.M{
				"avatar":     avatarUrl,
				"updated_at": time.Now(),
			},
		})

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while updating avatar"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Avatar updated successfully", "avatar_url": avatarUrl})
	}
}

// UPDATE ACCESS TOKEN CONTROLLER
func UpdateAccessToken(userCollection *mongo.Collection) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var c, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var refreshTokenStruct struct {
			RefreshToken string `json:"refresh_token" validate:"required"`
		}
		refreshToken, err := ctx.Cookie("refresh_token")

		if refreshToken == "" {

			if err := ctx.ShouldBindJSON(&refreshTokenStruct); err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
				return
			}

			if err := vallidator.Struct(refreshTokenStruct); err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		} else {
			refreshTokenStruct.RefreshToken = refreshToken
			if err := vallidator.Struct(refreshTokenStruct); err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		}

		claims, msg := utils.ValidateToken(refreshTokenStruct.RefreshToken, utils.REFRESH_TOKEN_SECRET)
		if msg != "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		objId, err := primitive.ObjectIDFromHex(claims.UserID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID in token"})
			return
		}

		var foundUser models.User

		err = userCollection.FindOne(c, bson.M{"_id": objId}).Decode(&foundUser)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}

		if foundUser.RefreshToken != refreshTokenStruct.RefreshToken {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
			return
		}

		token, refreshtoken, err := utils.GenerateAllTokens(foundUser.Email, foundUser.Username, foundUser.ID.Hex(), foundUser.Role)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while generating tokens"})
			return
		}

		if token == "" || refreshtoken == "" {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while generating tokens"})
			return
		}

		_, err = userCollection.UpdateOne(c, bson.M{"_id": foundUser.ID}, bson.M{
			"$set": bson.M{
				"refresh_token": refreshtoken,
				"updated_at":    time.Now(),
			},
		})

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while updating refresh token"})
			return
		}

		ctx.SetCookie("access_token", token, 900, "/", "localhost", false, true)
		ctx.SetCookie("refresh_token", refreshtoken, 604800, "/", "localhost", false, true)

		ctx.JSON(http.StatusOK, gin.H{"token": token, "refresh_token": refreshtoken})

	}
}
