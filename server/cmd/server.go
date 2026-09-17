package main

import (
	"log"
	"os"

	"github.com/fireheart071/config"
	"github.com/fireheart071/routes"
	"github.com/fireheart071/seeds"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

func main() {
	// Initialize Database (MySQL with SQLite fallback)
	db := config.InitDB()

	// Seed catalog if empty
	seeds.SeedDatabase(db)

	// Initialize Fiber App
	app := fiber.New(fiber.Config{
		AppName: "Rabbi Azanduna / Oud Attar Luxury API",
	})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	}))

	// Register Routes
	routes.SetupRoutes(app, db)

	// Port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("[Server] Starting Oud Attar Luxury Fragrance API on port :%s ...", port)
	log.Fatal(app.Listen(":" + port))
}
