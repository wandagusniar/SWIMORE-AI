package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type PartnerController struct{}

func NewPartnerController() *PartnerController {
	return &PartnerController{}
}

type PartnerRegistrationRequest struct {
	Handle         string `json:"handle" binding:"required"`
	Model          string `json:"model" binding:"required"`
	EndpointType   string `json:"endpoint_type" binding:"required"` // TYPE_A, TYPE_B, TYPE_C
	InputPrice1M   float64 `json:"input_price_1m" binding:"required"`
	OutputPrice1M  float64 `json:"output_price_1m" binding:"required"`
	SeaBankAccount string `json:"seabank_account" binding:"required"`
}

// RegisterPartner registers new partner with SeaBank account
func (pc *PartnerController) RegisterPartner(c *gin.Context) {
	var req PartnerRegistrationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":          "Partner registered successfully. Endpoint status: PENDING_REVIEW",
		"handle":           req.Handle,
		"model":            req.Model,
		"status":           "PENDING_REVIEW",
		"seabank_account":  req.SeaBankAccount,
		"tax_platform_fee": "1.1%",
		"created_at":       time.Now().Format(time.RFC3339),
	})
}

// ListEndpoints returns registered partner endpoints
func (pc *PartnerController) ListEndpoints(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"endpoints": []gin.H{
			{
				"handle":        "@novacompute",
				"model":         "Claude 3.5 Sonnet",
				"type":          "TYPE_B",
				"status":        "ACTIVE",
				"latency_ms":    410,
				"uptime":        "99.9%",
				"scu_allocated": 9.8,
			},
			{
				"handle":        "@gridai",
				"model":         "Claude 3.5 Sonnet",
				"type":          "TYPE_B",
				"status":        "ACTIVE",
				"latency_ms":    380,
				"uptime":        "99.7%",
				"scu_allocated": 7.5,
			},
			{
				"handle":        "@llamaworks",
				"model":         "Llama 3.3 70B",
				"type":          "TYPE_A",
				"status":        "ACTIVE",
				"latency_ms":    190,
				"uptime":        "99.9%",
				"scu_allocated": 12.0,
			},
		},
	})
}

// Heartbeat receives partner synthetic heartbeat probe
func (pc *PartnerController) Heartbeat(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "HEALTHY",
		"timestamp": time.Now().Unix(),
	})
}

