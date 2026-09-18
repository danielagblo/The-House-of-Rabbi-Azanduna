package config

import (
	"fmt"
	"log"
	"os"

	"github.com/fireheart071/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB() *gorm.DB {
	_ = godotenv.Load()

	dsn := os.Getenv("MYSQL_DSN")
	if dsn == "" {
		dbUser := os.Getenv("DB_USER")
		dbPass := os.Getenv("DB_PASS")
		dbHost := os.Getenv("DB_HOST")
		dbPort := os.Getenv("DB_PORT")
		dbName := os.Getenv("DB_NAME")

		if dbHost != "" && dbName != "" {
			if dbPort == "" {
				dbPort = "3306"
			}
			dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
				dbUser, dbPass, dbHost, dbPort, dbName)
		}
	}

	var db *gorm.DB
	var err error

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	if dsn != "" {
		log.Printf("[DB] Connecting to MySQL database...")
		db, err = gorm.Open(mysql.Open(dsn), gormConfig)
		if err != nil {
			log.Printf("[DB] Failed to connect to MySQL (%v). Falling back to SQLite for local development.", err)
			db, err = gorm.Open(sqlite.Open("oud_attar.db"), gormConfig)
		} else {
			log.Printf("[DB] Successfully connected to MySQL database.")
		}
	} else {
		log.Printf("[DB] No MySQL DSN provided. Using SQLite database ('oud_attar.db') for local development.")
		db, err = gorm.Open(sqlite.Open("oud_attar.db"), gormConfig)
	}

	if err != nil {
		log.Fatalf("[DB] Fatal error initializing database: %v", err)
	}

	// Auto Migrate tables
	log.Printf("[DB] Running AutoMigrations for models...")
	err = db.AutoMigrate(
		&models.Collection{},
		&models.Product{},
		&models.FragranceNote{},
		&models.ProductVariant{},
		&models.Review{},
		&models.Order{},
		&models.OrderItem{},
		&models.BlogPost{},
	)
	if err != nil {
		log.Fatalf("[DB] AutoMigration failed: %v", err)
	}

	DB = db
	return db
}
