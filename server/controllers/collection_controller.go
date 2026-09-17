package controllers

import (
	"github.com/fireheart071/repositories"
	"github.com/gofiber/fiber/v3"
)

type CollectionController struct {
	repo *repositories.CollectionRepository
}

func NewCollectionController(repo *repositories.CollectionRepository) *CollectionController {
	return &CollectionController{repo: repo}
}

func (c *CollectionController) GetAll(ctx fiber.Ctx) error {
	collections, err := c.repo.GetAll()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch collections",
		})
	}
	return ctx.JSON(collections)
}

func (c *CollectionController) GetBySlug(ctx fiber.Ctx) error {
	slug := ctx.Params("slug")
	collection, err := c.repo.GetBySlug(slug)
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Collection not found",
		})
	}
	return ctx.JSON(collection)
}
