package middleware

import (
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type UserQuotaTracker struct {
	mu           sync.Mutex
	dailyCounts  map[string]int
	lastResetDay int
}

var globalTracker = &UserQuotaTracker{
	dailyCounts:  make(map[string]int),
	lastResetDay: time.Now().Day(),
}

// TierRateLimiter checks daily pool allocations and returns 429 when exhausted
func TierRateLimiter() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetString("user_id")
		if userID == "" {
			userID = c.ClientIP()
		}

		plan := c.GetString("plan_tier")
		if plan == "" {
			plan = "Free"
		}

		// Determine daily request quota per master specifications
		maxDaily := 50
		if plan == "Swimore Plus" {
			maxDaily = 100 // 50 Basic + 50 Max
		} else if plan == "VIP" {
			maxDaily = 150 // 50 Basic + 50 Pro + 50 Max
		} else if plan == "VIP+" {
			maxDaily = 200 // 50 Basic + 100 Pro + 50 Max
		}

		globalTracker.mu.Lock()
		today := time.Now().Day()
		if today != globalTracker.lastResetDay {
			globalTracker.dailyCounts = make(map[string]int)
			globalTracker.lastResetDay = today
		}

		currentUsage := globalTracker.dailyCounts[userID]
		if currentUsage >= maxDaily {
			globalTracker.mu.Unlock()
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": gin.H{
					"message": "Daily capacity quota exceeded. Quota resets at 00:00 WIB.",
					"type":    "insufficient_quota",
					"code":    "rate_limit_exceeded",
					"limit":   maxDaily,
					"usage":   currentUsage,
					"resets":  "00:00 WIB",
				},
			})
			return
		}

		globalTracker.dailyCounts[userID] = currentUsage + 1
		c.Set("daily_usage", currentUsage+1)
		c.Set("daily_limit", maxDaily)
		globalTracker.mu.Unlock()

		c.Header("X-RateLimit-Limit", strconv.Itoa(maxDaily))
		c.Header("X-RateLimit-Remaining", strconv.Itoa(maxDaily-currentUsage-1))

		c.Next()
	}
}
