package controllers

import (
	"fmt"
	"time"

	"github.com/fireheart071/models"
	"github.com/fireheart071/repositories"
	"github.com/fireheart071/services"
	"github.com/gofiber/fiber/v3"
)

type PaymentController struct {
	paystack  *services.PaystackService
	orderRepo *repositories.OrderRepository
}

func NewPaymentController(paystack *services.PaystackService, orderRepo *repositories.OrderRepository) *PaymentController {
	return &PaymentController{
		paystack:  paystack,
		orderRepo: orderRepo,
	}
}

type CheckoutItemPayload struct {
	ProductID   uint    `json:"productId"`
	ProductName string  `json:"productName"`
	VariantSize string  `json:"variantSize"`
	Quantity    int     `json:"quantity"`
	UnitPrice   float64 `json:"unitPrice"`
	ImageUrl    string  `json:"imageUrl"`
}

type CheckoutRequest struct {
	CustomerName   string                `json:"customerName"`
	CustomerEmail  string                `json:"customerEmail"`
	CustomerPhone  string                `json:"customerPhone"`
	ShippingStreet string                `json:"shippingStreet"`
	ShippingCity   string                `json:"shippingCity"`
	ShippingState  string                `json:"shippingState"`
	ShippingZip    string                `json:"shippingZip"`
	ShippingCountry string               `json:"shippingCountry"`
	Currency       string                `json:"currency"`
	CallbackURL    string                `json:"callbackUrl"`
	Items          []CheckoutItemPayload `json:"items"`
}

func (c *PaymentController) InitializeCheckout(ctx fiber.Ctx) error {
	var req CheckoutRequest
	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid checkout payload",
		})
	}

	if req.CustomerEmail == "" || len(req.Items) == 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and at least one item are required",
		})
	}

	if req.Currency == "" {
		req.Currency = "GHS"
	}

	// Calculate total amount
	var total float64
	var orderItems []models.OrderItem
	for _, item := range req.Items {
		lineTotal := item.UnitPrice * float64(item.Quantity)
		total += lineTotal
		orderItems = append(orderItems, models.OrderItem{
			ProductID:   item.ProductID,
			ProductName: item.ProductName,
			VariantSize: item.VariantSize,
			Quantity:    item.Quantity,
			UnitPrice:   item.UnitPrice,
			ImageUrl:    item.ImageUrl,
		})
	}

	// Add delivery fee if under GH₵350
	if total < 350.0 {
		total += 35.0
	}

	reference := fmt.Sprintf("OUD-%d-%d", time.Now().Unix(), time.Now().Nanosecond()%1000)

	// Create order in DB
	order := models.Order{
		Reference:       reference,
		CustomerName:   req.CustomerName,
		CustomerEmail:  req.CustomerEmail,
		CustomerPhone:  req.CustomerPhone,
		ShippingStreet: req.ShippingStreet,
		ShippingCity:   req.ShippingCity,
		ShippingState:  req.ShippingState,
		ShippingZip:    req.ShippingZip,
		ShippingCountry: req.ShippingCountry,
		TotalAmount:    total,
		Currency:       req.Currency,
		Status:         "pending",
		Items:          orderItems,
	}

	if err := c.orderRepo.Create(&order); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create order record",
		})
	}

	// Initialize with Paystack (amount in subunit minor units, e.g. pence)
	amountMinor := int64(total * 100)
	callback := req.CallbackURL
	if callback == "" {
		callback = fmt.Sprintf("/order/confirmation?reference=%s", reference)
	}

	paystackReq := services.InitPaymentRequest{
		Email:       req.CustomerEmail,
		Amount:      amountMinor,
		Reference:   reference,
		Currency:    req.Currency,
		CallbackURL: callback,
	}

	initResp, err := c.paystack.InitializeTransaction(paystackReq)
	if err != nil {
		return ctx.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"error": "Failed to initialize Paystack transaction",
		})
	}

	return ctx.JSON(fiber.Map{
		"status":    "success",
		"reference": reference,
		"total":     total,
		"currency":  req.Currency,
		"paystack":  initResp.Data,
	})
}

func (c *PaymentController) VerifyPayment(ctx fiber.Ctx) error {
	reference := ctx.Params("reference")
	if reference == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Reference is required",
		})
	}

	order, err := c.orderRepo.GetByReference(reference)
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Order not found",
		})
	}

	verifyResp, err := c.paystack.VerifyTransaction(reference)
	if err != nil {
		return ctx.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"error": "Failed to verify transaction with Paystack",
		})
	}

	if verifyResp.Data.Status == "success" {
		_ = c.orderRepo.UpdateStatus(reference, "paid", fmt.Sprintf("%d", verifyResp.Data.ID))
		order.Status = "paid"
	}

	return ctx.JSON(fiber.Map{
		"order":    order,
		"paystack": verifyResp.Data,
	})
}

func (c *PaymentController) Webhook(ctx fiber.Ctx) error {
	// Paystack webhook listener
	var payload map[string]interface{}
	if err := ctx.Bind().Body(&payload); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	event, _ := payload["event"].(string)
	if event == "charge.success" {
		if data, ok := payload["data"].(map[string]interface{}); ok {
			if ref, ok := data["reference"].(string); ok {
				_ = c.orderRepo.UpdateStatus(ref, "paid", fmt.Sprintf("%v", data["id"]))
			}
		}
	}

	return ctx.SendStatus(fiber.StatusOK)
}
