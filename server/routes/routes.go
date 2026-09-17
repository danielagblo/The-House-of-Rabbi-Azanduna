package routes

import (
	"github.com/fireheart071/controllers"
	"github.com/fireheart071/repositories"
	"github.com/fireheart071/services"
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	// Repositories
	collectionRepo := repositories.NewCollectionRepository(db)
	productRepo := repositories.NewProductRepository(db)
	orderRepo := repositories.NewOrderRepository(db)

	// Services
	paystackService := services.NewPaystackService()

	// Controllers
	collectionCtrl := controllers.NewCollectionController(collectionRepo)
	productCtrl := controllers.NewProductController(productRepo)
	paymentCtrl := controllers.NewPaymentController(paystackService, orderRepo)

	// API Group
	api := app.Group("/api")

	// Health Check
	api.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"service": "Rabbi Azanduna / Oud Attar API",
			"version": "1.0.0",
		})
	})

	// Collections
	api.Get("/collections", collectionCtrl.GetAll)
	api.Get("/collections/:slug", collectionCtrl.GetBySlug)

	// Products
	api.Get("/products", productCtrl.GetAll)
	api.Get("/products/:slug", productCtrl.GetBySlug)

	// Payments & Checkout (Paystack)
	api.Post("/payments/initialize", paymentCtrl.InitializeCheckout)
	api.Get("/payments/verify/:reference", paymentCtrl.VerifyPayment)
	api.Post("/payments/webhook", paymentCtrl.Webhook)
}
