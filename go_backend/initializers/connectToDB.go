package initializers

import "os"

func connectToDB() {

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

}
