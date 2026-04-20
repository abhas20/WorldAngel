package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

func ConnectDatabase() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	url := os.Getenv("MONGO_URL")
	if url == "" {
		log.Fatal("Mongo Url not set")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(url))

	if err != nil {
		log.Fatal(err)
	}

	Client = client
	log.Println("Connected to MongoDB!")
}

func OpenCollection(collectionName string) *mongo.Collection {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	databaseName := os.Getenv("DATABASE_NAME")
	if databaseName == "" {
		log.Fatal("Database Name not set")
	}

	if Client == nil {
		log.Fatal("MongoDB client is not initialized")
	}

	collection := Client.Database(databaseName).Collection(collectionName)

	if collection == nil {
		return nil
	}

	return collection
}
