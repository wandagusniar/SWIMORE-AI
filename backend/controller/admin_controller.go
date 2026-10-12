package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AdminController struct{}

func NewAdminController() *AdminController {
	return &AdminController{}
}

// GetSystemOverview returns platform telemetry and active routing states
func (ac *AdminController) GetSystemOverview(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"system":           "Swimore Core Gateway",
		"active_endpoints": 3,
		"total_scu":        29.3,
		"routing_mode":     "DYNAMIC_LATENCY_AWARE",
		"log_policy":       "METADATA_ONLY_EPHEMERAL",
		"incident_channels": []string{
			"Discord (Ticket Channel)",
			"Telegram (Partner Bot)",
			"n8n (Automated Webhook)",
		},
	})
}

