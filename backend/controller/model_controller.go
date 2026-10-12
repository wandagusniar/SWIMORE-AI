package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"swimore.ai/backend/model/swimore"
)

type ModelController struct {
	catalog []swimore.ModelCard
}

func NewModelController() *ModelController {
	return &ModelController{
		catalog: []swimore.ModelCard{
			{
				ID:            "claude-3.5-sonnet",
				Name:          "claude-3.5-sonnet",
				Provider:      "Anthropic",
				TierBadge:     "SWIMORE PLUS+",
				PartnerBadge:  "PARTNER · NOVA COMPUTE",
				PriceInput:    3.00,
				PriceOutput:   15.00,
				LatencyMs:     410,
				ThroughputTPS: 112.0,
				UptimePercent: 98.4,
				ContextWindow: 200000,
				Status:        "Ready",
			},
			{
				ID:            "deepseek-r1",
				Name:          "deepseek-r1",
				Provider:      "DeepSeek",
				TierBadge:     "DEFAULT · FREE TIER",
				PriceInput:    0.52,
				PriceOutput:   2.05,
				LatencyMs:     314,
				ThroughputTPS: 78.0,
				UptimePercent: 99.8,
				ContextWindow: 128000,
				Status:        "Ready",
			},
			{
				ID:            "llama-3.3-70b",
				Name:          "llama-3.3-70b",
				Provider:      "Ollama",
				TierBadge:     "DEFAULT · FREE TIER",
				PriceInput:    0.38,
				PriceOutput:   0.38,
				LatencyMs:     190,
				ThroughputTPS: 95.0,
				UptimePercent: 99.9,
				ContextWindow: 128000,
				Status:        "Ready",
			},
			{
				ID:            "gpt-4o",
				Name:          "gpt-4o",
				Provider:      "OpenAI",
				TierBadge:     "SWIMORE PLUS+",
				PriceInput:    2.50,
				PriceOutput:   10.00,
				LatencyMs:     380,
				ThroughputTPS: 89.0,
				UptimePercent: 96.8,
				ContextWindow: 128000,
				Status:        "Degraded",
			},
			{
				ID:            "gemini-1.5-pro",
				Name:          "gemini-1.5-pro",
				Provider:      "Google",
				TierBadge:     "SWIMORE PLUS+",
				PartnerBadge:  "PARTNER · NOVA COMPUTE",
				PriceInput:    1.25,
				PriceOutput:   5.00,
				LatencyMs:     560,
				ThroughputTPS: 102.0,
				UptimePercent: 97.4,
				ContextWindow: 1000000,
				Status:        "Ready",
			},
			{
				ID:            "qwen-2.5-72b",
				Name:          "qwen-2.5-72b",
				Provider:      "Alibaba",
				TierBadge:     "DEFAULT · FREE TIER",
				PriceInput:    0.30,
				PriceOutput:   0.36,
				LatencyMs:     220,
				ThroughputTPS: 92.0,
				UptimePercent: 98.1,
				ContextWindow: 128000,
				Status:        "Ready",
			},
		},
	}
}

// ListModels returns full directory of available models
func (mc *ModelController) ListModels(c *gin.Context) {
	c.JSON(http.StatusOK, swimore.ModelListResponse{
		Object: "list",
		Data:   mc.catalog,
	})
}

// GetModel retrieves single model specifications
func (mc *ModelController) GetModel(c *gin.Context) {
	id := c.Param("id")
	for _, m := range mc.catalog {
		if m.ID == id {
			c.JSON(http.StatusOK, m)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{
		"error": gin.H{
			"message": "Model not found",
			"type":    "invalid_request_error",
			"code":    "model_not_found",
		},
	})
}

