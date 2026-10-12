package router

import (
	"github.com/gin-gonic/gin"
	"swimore.ai/backend/controller"
	"swimore.ai/backend/middleware"
)

// RegisterUserRoutes mounts endpoints that require user or API-key authentication
func RegisterUserRoutes(r *gin.RouterGroup) {
	chatCtrl := controller.NewChatController()
	authCtrl := controller.NewAuthController()
	channelCtrl := controller.NewChannelController()
	apiKeyCtrl := controller.NewApiKeyController()

	userGroup := r.Group("")
	userGroup.Use(middleware.AuthMiddleware())
	userGroup.Use(middleware.TierRateLimiter())
	{
		// OpenAI-compatible Chat Completions
		userGroup.POST("/v1/chat/completions", chatCtrl.HandleChatCompletions)

		// User profile & plan context
		userGroup.GET("/api/v1/auth/me", authCtrl.GetCurrentUser)

		// Quotas and pool limits (resets 00:00 WIB)
		userGroup.GET("/api/v1/user/quotas", authCtrl.GetUserQuotas)

		// API Keys management
		userGroup.GET("/api/v1/user/keys", apiKeyCtrl.ListKeys)
		userGroup.POST("/api/v1/user/keys", apiKeyCtrl.CreateKey)

		// Dual-trigger incident reporting (UI manual or automated)
		userGroup.POST("/api/v1/incidents/report", channelCtrl.ReportIncident)
	}
}

