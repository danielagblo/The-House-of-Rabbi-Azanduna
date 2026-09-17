package controllers

import (
	"strconv"

	"github.com/fireheart071/repositories"
	"github.com/gofiber/fiber/v3"
)

type ProductController struct {
	repo *repositories.ProductRepository
}

func NewProductController(repo *repositories.ProductRepository) *ProductController {
	return &ProductController{repo: repo}
}

func (c *ProductController) GetAll(ctx fiber.Ctx) error {
	minP, _ := strconv.ParseFloat(ctx.Query("minPrice", "0"), 64)
	maxP, _ := strconv.ParseFloat(ctx.Query("maxPrice", "0"), 64)

	filter := repositories.ProductFilter{
		CollectionSlug: ctx.Query("collection", ""),
		ScentFamily:    ctx.Query("family", ""),
		Gender:         ctx.Query("gender", ""),
		Concentration:  ctx.Query("concentration", ""),
		Search:         ctx.Query("search", ""),
		MinPrice:       minP,
		MaxPrice:       maxP,
		Sort:           ctx.Query("sort", "featured"),
	}

	products, err := c.repo.GetAll(filter)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch products",
		})
	}

	return ctx.JSON(products)
}

func (c *ProductController) GetBySlug(ctx fiber.Ctx) error {
	slug := ctx.Params("slug")
	product, err := c.repo.GetBySlug(slug)
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}
	return ctx.JSON(product)
}
