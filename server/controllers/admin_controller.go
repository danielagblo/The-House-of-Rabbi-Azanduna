package controllers

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/fireheart071/models"
	"github.com/fireheart071/repositories"
	"github.com/gofiber/fiber/v3"
)

type AdminController struct {
	productRepo    *repositories.ProductRepository
	collectionRepo *repositories.CollectionRepository
	orderRepo      *repositories.OrderRepository
}

func NewAdminController(
	productRepo *repositories.ProductRepository,
	collectionRepo *repositories.CollectionRepository,
	orderRepo *repositories.OrderRepository,
) *AdminController {
	return &AdminController{
		productRepo:    productRepo,
		collectionRepo: collectionRepo,
		orderRepo:      orderRepo,
	}
}

type LoginRequest struct {
	Password string `json:"password"`
}

func AdminAuthMiddleware() fiber.Handler {
	return func(ctx fiber.Ctx) error {
		authHeader := ctx.Get("Authorization")
		if authHeader == "" {
			authHeader = ctx.Query("token")
		}
		if authHeader == "" {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized: Admin authorization token required",
			})
		}
		// Token validation
		if len(authHeader) < 10 {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized: Invalid authorization token",
			})
		}
		return ctx.Next()
	}
}

func (c *AdminController) Login(ctx fiber.Ctx) error {
	var req LoginRequest
	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid login payload"})
	}

	expectedPassword := os.Getenv("ADMIN_PASSWORD")
	if expectedPassword == "" {
		expectedPassword = "RabbiAzanduna2026!"
	}

	if req.Password != expectedPassword {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid master password. Access denied."})
	}

	token := "azanduna_admin_token_" + strconv.FormatInt(time.Now().Unix(), 10)

	return ctx.JSON(fiber.Map{
		"success": true,
		"token":   token,
		"message": "Authentication successful",
	})
}

func (c *AdminController) GetStats(ctx fiber.Ctx) error {
	products, err := c.productRepo.GetAll(repositories.ProductFilter{})
	if err != nil {
		products = []models.Product{}
	}

	collections, err := c.collectionRepo.GetAll()
	if err != nil {
		collections = []models.Collection{}
	}

	orders, err := c.orderRepo.GetAll()
	if err != nil {
		orders = []models.Order{}
	}

	var totalRevenue float64 = 0
	paidOrdersCount := 0
	for _, o := range orders {
		if o.Status == "paid" || o.Status == "successful" {
			totalRevenue += o.TotalAmount
			paidOrdersCount++
		}
	}

	return ctx.JSON(fiber.Map{
		"products_count":    len(products),
		"collections_count": len(collections),
		"orders_count":      len(orders),
		"paid_orders_count": paidOrdersCount,
		"total_revenue":     totalRevenue,
	})
}

func (c *AdminController) GetOrders(ctx fiber.Ctx) error {
	orders, err := c.orderRepo.GetAll()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch orders"})
	}
	return ctx.JSON(orders)
}

func (c *AdminController) CreateProduct(ctx fiber.Ctx) error {
	var product models.Product
	if err := ctx.Bind().Body(&product); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product payload"})
	}

	if err := c.productRepo.Create(&product); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create product"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(product)
}

func (c *AdminController) UpdateProduct(ctx fiber.Ctx) error {
	idStr := ctx.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	var product models.Product
	if err := ctx.Bind().Body(&product); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid updates payload"})
	}
	product.ID = uint(id)

	if err := c.productRepo.Save(&product); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update product"})
	}

	updated, err := c.productRepo.GetByID(uint(id))
	if err != nil {
		return ctx.JSON(fiber.Map{"success": true, "id": id})
	}

	return ctx.JSON(updated)
}

func (c *AdminController) DeleteProduct(ctx fiber.Ctx) error {
	idStr := ctx.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	if err := c.productRepo.Delete(uint(id)); err != nil {
		log.Printf("[AdminController] DeleteProduct error for ID %d: %v", id, err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Failed to delete product",
			"details": err.Error(),
		})
	}

	return ctx.JSON(fiber.Map{"success": true, "deleted_id": id})
}

func (c *AdminController) CreateCollection(ctx fiber.Ctx) error {
	var collection models.Collection
	if err := ctx.Bind().Body(&collection); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid collection payload"})
	}

	if err := c.collectionRepo.Create(&collection); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create collection"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(collection)
}

func (c *AdminController) UpdateCollection(ctx fiber.Ctx) error {
	idStr := ctx.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid collection ID"})
	}

	var collection models.Collection
	if err := ctx.Bind().Body(&collection); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid updates payload"})
	}
	collection.ID = uint(id)

	if err := c.collectionRepo.Save(&collection); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update collection"})
	}

	updated, err := c.collectionRepo.GetByID(uint(id))
	if err != nil {
		return ctx.JSON(fiber.Map{"success": true, "id": id})
	}

	return ctx.JSON(updated)
}

func (c *AdminController) DeleteCollection(ctx fiber.Ctx) error {
	idStr := ctx.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid collection ID"})
	}

	if err := c.collectionRepo.Delete(uint(id)); err != nil {
		log.Printf("[AdminController] DeleteCollection error for ID %d: %v", id, err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Failed to delete collection",
			"details": err.Error(),
		})
	}

	return ctx.JSON(fiber.Map{"success": true, "deleted_id": id})
}
