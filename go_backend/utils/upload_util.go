package utils

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadToCloudinary(file interface{}) (string, error) {
	cloudinary_cloud_name := os.Getenv("CLOUDINARY_CLOUD_NAME")
	cloudinary_api_key := os.Getenv("CLOUDINARY_API_KEY")
	cloudinary_api_secret := os.Getenv("CLOUDINARY_API_SECRET")

	if cloudinary_cloud_name == "" || cloudinary_api_key == "" || cloudinary_api_secret == "" {
		return "", fmt.Errorf("Cloudinary credentials are not set in environment variables")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	cld, err := cloudinary.NewFromParams(cloudinary_cloud_name, cloudinary_api_key, cloudinary_api_secret)
	if err != nil {
		return "", err
	}

	resp, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Transformation: "h_500,w_500,c_fill",
	})
	if err != nil {
		return "", err
	}

	fmt.Println(resp)

	return resp.SecureURL, nil

}
