package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

type PaystackService struct {
	SecretKey string
	BaseURL   string
	Client    *http.Client
}

func NewPaystackService() *PaystackService {
	key := os.Getenv("PAYSTACK_SECRET_KEY")
	return &PaystackService{
		SecretKey: key,
		BaseURL:   "https://api.paystack.co",
		Client:    &http.Client{Timeout: 15 * time.Second},
	}
}

type InitPaymentRequest struct {
	Email       string   `json:"email"`
	Amount      int64    `json:"amount"` // in minor units (e.g. 1000 pence = £10.00)
	Reference   string   `json:"reference"`
	Currency    string   `json:"currency,omitempty"`
	CallbackURL string   `json:"callback_url,omitempty"`
	Channels    []string `json:"channels,omitempty"`
	Metadata    string   `json:"metadata,omitempty"`
}

type PaystackInitResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		AuthorizationURL string `json:"authorization_url"`
		AccessCode       string `json:"access_code"`
		Reference        string `json:"reference"`
	} `json:"data"`
}

type PaystackVerifyResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		ID              int64     `json:"id"`
		Status          string    `json:"status"`
		Reference       string    `json:"reference"`
		Amount          int64     `json:"amount"`
		GatewayResponse string    `json:"gateway_response"`
		PaidAt          string    `json:"paid_at"`
		CreatedAt       string    `json:"created_at"`
		Channel         string    `json:"channel"`
		Currency        string    `json:"currency"`
		Customer        struct {
			Email string `json:"email"`
		} `json:"customer"`
	} `json:"data"`
}

func (s *PaystackService) InitializeTransaction(req InitPaymentRequest) (*PaystackInitResponse, error) {
	if s.SecretKey == "" {
		// Mock / Sandbox response for seamless local testing
		log.Printf("[Paystack] No PAYSTACK_SECRET_KEY set. Returning simulated test payment authorization.")
		resp := &PaystackInitResponse{
			Status:  true,
			Message: "Simulated authorization generated (Local Dev)",
		}
		resp.Data.AuthorizationURL = fmt.Sprintf("/order/confirmation?reference=%s&simulated=true", req.Reference)
		resp.Data.AccessCode = "test_code_" + req.Reference
		resp.Data.Reference = req.Reference
		return resp, nil
	}

	payload, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequest("POST", s.BaseURL+"/transaction/initialize", bytes.NewBuffer(payload))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+s.SecretKey)
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := s.Client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("paystack request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var initResp PaystackInitResponse
	if err := json.Unmarshal(body, &initResp); err != nil {
		return nil, fmt.Errorf("failed to parse paystack response: %w", err)
	}

	return &initResp, nil
}

func (s *PaystackService) VerifyTransaction(reference string) (*PaystackVerifyResponse, error) {
	if s.SecretKey == "" {
		// Mock verify for local testing
		log.Printf("[Paystack] Simulating transaction verification for ref: %s", reference)
		resp := &PaystackVerifyResponse{
			Status:  true,
			Message: "Simulated verification successful (Local Dev)",
		}
		resp.Data.Status = "success"
		resp.Data.Reference = reference
		resp.Data.Currency = "GBP"
		resp.Data.Channel = "card"
		return resp, nil
	}

	httpReq, err := http.NewRequest("GET", fmt.Sprintf("%s/transaction/verify/%s", s.BaseURL, reference), nil)
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+s.SecretKey)

	resp, err := s.Client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("paystack verify request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var verifyResp PaystackVerifyResponse
	if err := json.Unmarshal(body, &verifyResp); err != nil {
		return nil, fmt.Errorf("failed to parse verify response: %w", err)
	}

	return &verifyResp, nil
}
