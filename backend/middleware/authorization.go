package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// AdminOnly requires authenticated user to possess administrator privileges
func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role := c.GetString("user_role")
		if role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": gin.H{
					"message": "Admin privileges required for this action",
					"type":    "permission_denied",
					"code":    "forbidden",
				},
			})
			return
		}
		c.Next()
	}
}
