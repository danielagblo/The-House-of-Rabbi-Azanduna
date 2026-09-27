package controllers

import (
	"strconv"

	"github.com/fireheart071/models"
	"github.com/fireheart071/repositories"
	"github.com/gofiber/fiber/v3"
)

type FAQController struct {
	repo *repositories.FAQRepository
}

func NewFAQController(repo *repositories.FAQRepository) *FAQController {
	return &FAQController{repo: repo}
}

func (c *FAQController) GetAll(ctx fiber.Ctx) error {
	faqs, err := c.repo.GetAll()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch FAQs",
		})
	}
	return ctx.JSON(faqs)
}

func (c *FAQController) Create(ctx fiber.Ctx) error {
	var faq models.FAQ
	if err := ctx.Bind().Body(&faq); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid FAQ data"})
	}
	if faq.Question == "" || faq.Answer == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Question and Answer are required"})
	}
	if err := c.repo.Create(&faq); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create FAQ"})
	}
	return ctx.Status(fiber.StatusCreated).JSON(faq)
}

func (c *FAQController) Update(ctx fiber.Ctx) error {
	idParam := ctx.Params("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid FAQ ID"})
	}

	var updates map[string]interface{}
	if err := ctx.Bind().Body(&updates); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid update data"})
	}

	if err := c.repo.Update(uint(id), updates); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update FAQ"})
	}
	return ctx.JSON(fiber.Map{"message": "FAQ updated successfully"})
}

func (c *FAQController) Delete(ctx fiber.Ctx) error {
	idParam := ctx.Params("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid FAQ ID"})
	}

	if err := c.repo.Delete(uint(id)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete FAQ"})
	}
	return ctx.JSON(fiber.Map{"message": "FAQ deleted successfully"})
}
