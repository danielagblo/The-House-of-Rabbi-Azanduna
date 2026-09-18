package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/fireheart071/config"
	"github.com/fireheart071/routes"
	"github.com/fireheart071/seeds"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	_ = godotenv.Load("../../.env")

	db := config.InitDB()
	seeds.SeedDatabase(db)

	app := fiber.New(fiber.Config{
		AppName: "Rabbi Azanduna Ltd Luxury API",
	})

	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	}))

	routes.SetupRoutes(app, db)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}
	port = strings.TrimSpace(port)

	listenAddr := fmt.Sprintf("0.0.0.0:%s", port)
	log.Printf("[Server] Starting Rabbi Azanduna Ltd Luxury API on %s ...", listenAddr)
	log.Fatal(app.Listen(listenAddr))
}
