package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// QuotaEnforcement verifies specific pool quota eligibility before proxying
func QuotaEnforcement(requiredPool string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Pool checking logic
		plan := c.GetString("plan_tier")
		if requiredPool == "MAX_POOL" && plan == "Free" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": gin.H{
					"message": "Max Pool access requires Swimore Plus, VIP, or VIP+",
					"type":    "pool_access_restricted",
					"code":    "upgrade_required",
				},
			})
			return
		}
		c.Next()
	}
}
