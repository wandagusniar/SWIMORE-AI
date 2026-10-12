package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// MaxRequestSize limits incoming payload size (e.g. 10MB)
func MaxRequestSize(maxBytes int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)
		c.Next()
	}
}

