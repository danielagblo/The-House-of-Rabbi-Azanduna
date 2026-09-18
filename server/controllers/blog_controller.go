package controllers

import (
	"github.com/fireheart071/repositories"
	"github.com/gofiber/fiber/v3"
)

type BlogController struct {
	repo *repositories.BlogRepository
}

func NewBlogController(repo *repositories.BlogRepository) *BlogController {
	return &BlogController{repo: repo}
}

func (c *BlogController) GetAll(ctx fiber.Ctx) error {
	posts, err := c.repo.GetAll()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch blog posts",
		})
	}
	return ctx.JSON(posts)
}

func (c *BlogController) GetBySlug(ctx fiber.Ctx) error {
	slug := ctx.Params("slug")
	post, err := c.repo.GetBySlug(slug)
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Blog post not found",
		})
	}
	return ctx.JSON(post)
}
