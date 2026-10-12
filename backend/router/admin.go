package router

import (
	"github.com/gin-gonic/gin"
	"swimore.ai/backend/controller"
	"swimore.ai/backend/middleware"
)

// RegisterAdminRoutes mounts administrative endpoints
func RegisterAdminRoutes(r *gin.RouterGroup) {
	adminCtrl := controller.NewAdminController()

	adminGroup := r.Group("/api/v1/admin")
	adminGroup.Use(middleware.AuthMiddleware())
	adminGroup.Use(middleware.AdminOnly())
	{
		adminGroup.GET("/overview", adminCtrl.GetSystemOverview)
	}
}

