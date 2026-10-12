package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// RecoveryMiddleware gracefully recovers from panics and returns clean JSON error
func RecoveryMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("[PANIC RECOVERED] %v", r)
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"error": gin.H{
						"message": "Internal gateway routing error",
						"type":    "api_error",
						"code":    "internal_server_error",
					},
				})
			}
		}()
		c.Next()
	}
}
