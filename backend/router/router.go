package router

import (
	"github.com/gin-gonic/gin"
	"swimore.ai/backend/middleware"
)

// SetupRouter initializes Gin engine with middlewares and registered endpoints
func SetupRouter() *gin.Engine {
	// Set Gin mode
	gin.SetMode(gin.ReleaseMode)

	r := gin.New()

	// Global Middlewares
	r.Use(middleware.RecoveryMiddleware())
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.MaxRequestSize(10 << 20)) // 10MB payload cap
	r.Use(middleware.MetadataAuditLogger())

	rootGroup := r.Group("")

	// Register route groups
	RegisterPublicRoutes(rootGroup)
	RegisterUserRoutes(rootGroup)
	RegisterPartnerRoutes(rootGroup)
	RegisterAdminRoutes(rootGroup)

	return r
}
