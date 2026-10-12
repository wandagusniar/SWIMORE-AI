package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"swimore.ai/backend/controller"
)

// RegisterPublicRoutes mounts unauthenticated public endpoints
func RegisterPublicRoutes(r *gin.RouterGroup) {
	modelCtrl := controller.NewModelController()
	authCtrl := controller.NewAuthController()
	paymentCtrl := controller.NewPaymentWebhookController()

	// Health probe
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"gateway": "swimore-ingress-v1",
			"uptime":  "99.99%",
		})
	})

	// Public Models Directory
	r.GET("/v1/models", modelCtrl.ListModels)
	r.GET("/v1/models/:id", modelCtrl.GetModel)

	// Auth Login
	r.POST("/api/v1/auth/login", authCtrl.Login)

	// Payment Webhook
	r.POST("/api/v1/billing/webhook", paymentCtrl.HandleMidtransWebhook)
}

