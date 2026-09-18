package controllers

import (
	"fmt"

	"github.com/fireheart071/models"
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

func (c *BlogController) Create(ctx fiber.Ctx) error {
	var post models.BlogPost
	if err := ctx.Bind().Body(&post); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid blog post data"})
	}
	if post.Title == "" || post.Slug == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Title and Slug are required"})
	}
	if err := c.repo.Create(&post); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create blog post"})
	}
	return ctx.Status(fiber.StatusCreated).JSON(post)
}

func (c *BlogController) Update(ctx fiber.Ctx) error {
	idParam := ctx.Params("id")
	var updates map[string]interface{}
	if err := ctx.Bind().Body(&updates); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid update data"})
	}
	var id uint
	if _, err := fmt.Sscanf(idParam, "%d", &id); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	if err := c.repo.Update(id, updates); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update blog post"})
	}
	return ctx.JSON(fiber.Map{"message": "Blog post updated successfully"})
}

func (c *BlogController) Delete(ctx fiber.Ctx) error {
	idParam := ctx.Params("id")
	var id uint
	if _, err := fmt.Sscanf(idParam, "%d", &id); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	if err := c.repo.Delete(id); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete blog post"})
	}
	return ctx.JSON(fiber.Map{"message": "Blog post deleted successfully"})
}
