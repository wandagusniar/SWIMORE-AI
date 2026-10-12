package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthController struct{}

func NewAuthController() *AuthController {
	return &AuthController{}
}

// Login authenticates user and returns mock JWT
func (ac *AuthController) Login(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"token": "swimore-session-jwt-alex-doe",
		"user": gin.H{
			"id":         "usr_882910",
			"name":       "Alex Doe",
			"email":      "alex.doe@example.com",
			"plan":       "Swimore Plus",
			"is_partner": false,
		},
	})
}

// GetCurrentUser returns authenticated user context
func (ac *AuthController) GetCurrentUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"id":         "usr_882910",
		"name":       "Alex Doe",
		"email":      "alex.doe@example.com",
		"plan":       "Swimore Plus",
		"is_partner": false,
	})
}

// GetUserQuotas returns pool capacities and reset countdown
func (ac *AuthController) GetUserQuotas(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"plan": "Swimore Plus",
		"pools": gin.H{
			"basic": gin.H{
				"used":  32,
				"limit": 50,
			},
			"pro": gin.H{
				"used":  0,
				"limit": 0,
			},
			"max": gin.H{
				"used":  14,
				"limit": 50,
			},
		},
		"resets_at": "00:00 WIB",
	})
}

