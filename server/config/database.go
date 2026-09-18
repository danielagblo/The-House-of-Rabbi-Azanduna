package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/fireheart071/models"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// ensureMySQLDatabase tries to create the database on the MySQL instance if it doesn't already exist.
func ensureMySQLDatabase(user, pass, host, port, dbName string) error {
	rootDSN := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local",
		user, pass, host, port)
	sqlDB, err := sql.Open("mysql", rootDSN)
	if err != nil {
		return err
	}
	defer sqlDB.Close()

	if err := sqlDB.Ping(); err != nil {
		return err
	}

	query := fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", dbName)
	_, err = sqlDB.Exec(query)
	return err
}

func InitDB() *gorm.DB {
	_ = godotenv.Load()

	dbType := os.Getenv("DB_TYPE")
	if dbType == "" {
		dbType = "mysql"
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "root"
	}
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "127.0.0.1"
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "3306"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "rabbi_azanduna_db"
	}

	dsn := os.Getenv("MYSQL_DSN")
	if dsn == "" {
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			dbUser, dbPass, dbHost, dbPort, dbName)
	}

	var db *gorm.DB
	var err error

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	if dbType == "mysql" {
		log.Printf("[DB] Connecting to MySQL database '%s' on %s:%s (User: %s)...", dbName, dbHost, dbPort, dbUser)

		// Ensure the database exists on the MySQL instance
		if createErr := ensureMySQLDatabase(dbUser, dbPass, dbHost, dbPort, dbName); createErr != nil {
			log.Printf("[DB Notice] Automated database creation check: %v", createErr)
		}

		db, err = gorm.Open(mysql.Open(dsn), gormConfig)
		if err != nil {
			log.Printf("[DB Warning] Failed to connect to MySQL database: %v", err)
			log.Printf("[DB Notice] Falling back to local SQLite database ('oud_attar.db') so the application remains operable.")
			db, err = gorm.Open(sqlite.Open("oud_attar.db"), gormConfig)
		} else {
			log.Printf("[DB] Successfully connected to MySQL database: %s", dbName)
		}
	} else {
		log.Printf("[DB] DB_TYPE is set to sqlite. Using SQLite database ('oud_attar.db').")
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
		&models.FAQ{},
	)
	if err != nil {
		log.Fatalf("[DB] AutoMigration failed: %v", err)
	}

	DB = db
	return db
}
