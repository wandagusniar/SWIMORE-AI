package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RequestIDMiddleware injects or propagates unique request UUID
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		reqID := c.GetHeader("X-Swimore-Request-ID")
		if reqID == "" {
			reqID = uuid.New().String()
		}
		c.Set("request_id", reqID)
		c.Writer.Header().Set("X-Swimore-Request-ID", reqID)
		c.Next()
	}
}

