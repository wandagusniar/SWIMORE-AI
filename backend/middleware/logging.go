package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// MetadataAuditLogger logs telemetry metadata strictly without persisting conversation bodies
func MetadataAuditLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		reqID := uuid.New().String()

		c.Set("request_id", reqID)
		c.Writer.Header().Set("X-Swimore-Request-ID", reqID)

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()
		modelID := c.GetString("model_id")
		tokens := c.GetInt("token_count")

		// Strictly metadata-only audit logging: zero prompt or response text recorded
		log.Printf(
			"[AUDIT] id=%s method=%s path=%s status=%d latency=%v model=%s tokens=%d ip=%s",
			reqID,
			c.Request.Method,
			c.Request.URL.Path,
			status,
			latency,
			modelID,
			tokens,
			c.ClientIP(),
		)
	}
}
