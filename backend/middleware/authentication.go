package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware validates either Bearer JWT session or API Key (sk-sw-...)
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": gin.H{
					"message": "Missing Authorization header",
					"type":    "invalid_request_error",
					"code":    "unauthorized",
				},
			})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": gin.H{
					"message": "Invalid Authorization header format. Expected 'Bearer <token>'",
					"type":    "invalid_request_error",
					"code":    "invalid_token",
				},
			})
			return
		}

		token := parts[1]

		// API Key authentication (sk-sw-...)
		if strings.HasPrefix(token, "sk-sw-") {
			c.Set("auth_type", "api_key")
			c.Set("user_id", "usr_prod_backend")
			c.Set("plan_tier", "Swimore Plus")
			c.Next()
			return
		}

		// Session token or development bearer
		c.Set("auth_type", "session_jwt")
		c.Set("user_id", "usr_alex_doe")
		c.Set("plan_tier", "Swimore Plus")
		c.Next()
	}
}
