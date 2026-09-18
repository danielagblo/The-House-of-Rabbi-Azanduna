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
	blogRepo := repositories.NewBlogRepository(db)
	faqRepo := repositories.NewFAQRepository(db)

	// Services
	paystackService := services.NewPaystackService()

	// Controllers
	collectionCtrl := controllers.NewCollectionController(collectionRepo)
	productCtrl := controllers.NewProductController(productRepo)
	paymentCtrl := controllers.NewPaymentController(paystackService, orderRepo)
	adminCtrl := controllers.NewAdminController(productRepo, collectionRepo, orderRepo)
	blogCtrl := controllers.NewBlogController(blogRepo)
	faqCtrl := controllers.NewFAQController(faqRepo)

	// API Group
	api := app.Group("/api")

	// Health Check
	api.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"service": "Rabbi Azanduna Ltd API",
			"version": "1.0.0",
		})
	})

	// Collections (Public)
	api.Get("/collections", collectionCtrl.GetAll)
	api.Get("/collections/:slug", collectionCtrl.GetBySlug)

	// Products (Public)
	api.Get("/products", productCtrl.GetAll)
	api.Get("/products/:slug", productCtrl.GetBySlug)

	// Blogs (Public)
	api.Get("/blogs", blogCtrl.GetAll)
	api.Get("/blogs/:slug", blogCtrl.GetBySlug)

	// FAQs (Public)
	api.Get("/faqs", faqCtrl.GetAll)

	// Payments & Checkout (Paystack)
	api.Post("/payments/initialize", paymentCtrl.InitializeCheckout)
	api.Get("/payments/verify/:reference", paymentCtrl.VerifyPayment)
	api.Post("/payments/webhook", paymentCtrl.Webhook)

	// Admin Portal Endpoints (/api/admin)
	admin := api.Group("/admin")
	admin.Post("/login", adminCtrl.Login)
	admin.Get("/stats", adminCtrl.GetStats)
	admin.Get("/orders", adminCtrl.GetOrders)

	// Admin Product Management
	admin.Post("/products", adminCtrl.CreateProduct)
	admin.Put("/products/:id", adminCtrl.UpdateProduct)
	admin.Delete("/products/:id", adminCtrl.DeleteProduct)

	// Admin Collection Management
	admin.Post("/collections", adminCtrl.CreateCollection)
	admin.Put("/collections/:id", adminCtrl.UpdateCollection)
	admin.Delete("/collections/:id", adminCtrl.DeleteCollection)

	// Admin Blog Management
	admin.Post("/blogs", blogCtrl.Create)
	admin.Put("/blogs/:id", blogCtrl.Update)
	admin.Delete("/blogs/:id", blogCtrl.Delete)

	// Admin FAQ Management
	admin.Post("/faqs", faqCtrl.Create)
	admin.Put("/faqs/:id", faqCtrl.Update)
	admin.Delete("/faqs/:id", faqCtrl.Delete)
}
