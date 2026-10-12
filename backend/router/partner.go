package router

import (
	"github.com/gin-gonic/gin"
	"swimore.ai/backend/controller"
)

// RegisterPartnerRoutes mounts endpoints for partner management and synthetic heartbeat probes
func RegisterPartnerRoutes(r *gin.RouterGroup) {
	partnerCtrl := controller.NewPartnerController()

	partnerGroup := r.Group("/api/v1/partner")
	{
		partnerGroup.POST("/register", partnerCtrl.RegisterPartner)
		partnerGroup.GET("/endpoints", partnerCtrl.ListEndpoints)
		partnerGroup.POST("/heartbeat", partnerCtrl.Heartbeat)
	}
}

