package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/fireheart071/models"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func cleanEnv(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	// Strip inline comments if any
	if idx := strings.Index(val, "#"); idx != -1 {
		val = val[:idx]
	}
	val = strings.TrimSpace(val)
	val = strings.Trim(val, `"'`)
	if val == "" {
		return fallback
	}
	return val
}

// ensureMySQLDatabase is only for local MySQL instances to create the DB if missing
func ensureMySQLDatabase(user, pass, host, port, dbName string) error {
	rootDSN := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local&timeout=5s",
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
	_ = godotenv.Load("../.env")

	dbType := cleanEnv("DB_TYPE", "mysql")
	dbUser := cleanEnv("DB_USER", "root")
	dbPass := cleanEnv("DB_PASS", "")
	dbHost := cleanEnv("DB_HOST", "127.0.0.1")
	dbPort := cleanEnv("DB_PORT", "3306")
	dbName := cleanEnv("DB_NAME", "rabbi")

	dsn := cleanEnv("MYSQL_DSN", "")
	if dsn == "" {
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local&timeout=10s",
			dbUser, dbPass, dbHost, dbPort, dbName)
	}

	var db *gorm.DB
	var err error

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn), // LogMode Warn keeps logs fast and clean
	}

	if dbType == "mysql" {
		log.Printf("[DB] Connecting to MySQL database '%s' on %s:%s (User: %s)...", dbName, dbHost, dbPort, dbUser)

		// Only attempt root database creation on local development hosts
		isLocal := dbHost == "127.0.0.1" || dbHost == "localhost" || dbHost == "::1"
		if isLocal {
			_ = ensureMySQLDatabase(dbUser, dbPass, dbHost, dbPort, dbName)
		}

		db, err = gorm.Open(mysql.Open(dsn), gormConfig)
		if err != nil {
			log.Printf("[DB Warning] Failed to connect to MySQL database: %v", err)
			log.Printf("[DB Notice] Falling back to local SQLite database ('oud_attar.db') so the server stays online.")
			db, err = gorm.Open(sqlite.Open("oud_attar.db"), gormConfig)
		} else {
			log.Printf("[DB] Successfully connected to MySQL database '%s'!", dbName)
		}
	} else {
		log.Printf("[DB] DB_TYPE is set to sqlite. Using SQLite database ('oud_attar.db').")
		db, err = gorm.Open(sqlite.Open("oud_attar.db"), gormConfig)
	}

	if err != nil {
		log.Fatalf("[DB] Fatal error initializing database: %v", err)
	}

	sqlDB, err := db.DB()
	if err == nil {
		sqlDB.SetMaxOpenConns(20)
		sqlDB.SetMaxIdleConns(5)
	}

	// Auto Migrate tables in background goroutine so server starts listening instantly (<100ms)
	go func(database *gorm.DB) {
		log.Printf("[DB] Running AutoMigrations for models...")
		mErr := database.AutoMigrate(
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
		if mErr != nil {
			log.Printf("[DB Notice] AutoMigration notice: %v", mErr)
		} else {
			log.Printf("[DB] AutoMigrations completed successfully.")
		}
	}(db)

	DB = db
	return db
}

