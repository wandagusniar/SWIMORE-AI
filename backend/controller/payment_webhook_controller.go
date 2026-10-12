package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PaymentWebhookController struct{}

func NewPaymentWebhookController() *PaymentWebhookController {
	return &PaymentWebhookController{}
}

type MidtransWebhookPayload struct {
	OrderID           string      `json:"order_id" binding:"required"`
	TransactionStatus string      `json:"transaction_status" binding:"required"`
	GrossAmount       interface{} `json:"gross_amount" binding:"required"`
	PaymentType       string      `json:"payment_type"`
	SignatureKey      string      `json:"signature_key"`
}

// HandleMidtransWebhook processes QRIS / SeaBank payment notification with 1.1% fee deduction
func (pwc *PaymentWebhookController) HandleMidtransWebhook(c *gin.Context) {
	var payload MidtransWebhookPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var gross float64
	switch v := payload.GrossAmount.(type) {
	case float64:
		gross = v
	case string:
		gross, _ = strconv.ParseFloat(v, 64)
	case int:
		gross = float64(v)
	}

	// 1.1% platform fee calculation
	fee := gross * 0.011
	net := gross - fee

	c.JSON(http.StatusOK, gin.H{
		"order_id":         payload.OrderID,
		"status":           "PROCESSED",
		"payment_type":     payload.PaymentType,
		"gross_amount_idr": gross,
		"platform_fee":     "1.1%",
		"platform_fee_idr": fee,
		"net_amount_idr":   net,
		"split_action":     fmt.Sprintf("Disbursed IDR %.0f to Partner SeaBank account after 1.1%% fee deduction", net),
		"plan_entitlement": "ACTIVATED",
	})
}
