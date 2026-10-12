package controller

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ApiKeyController struct{}

func NewApiKeyController() *ApiKeyController {
	return &ApiKeyController{}
}

type CreateApiKeyRequest struct {
	Name string `json:"name" binding:"required"`
}

type ApiKeyItem struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	KeyPrefix string `json:"key_prefix"`
	CreatedAt string `json:"created_at"`
	LastUsed  string `json:"last_used"`
}

// ListKeys returns API keys for authenticated user
func (kc *ApiKeyController) ListKeys(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"keys": []ApiKeyItem{
			{
				ID:        "key_991823",
				Name:      "Production Agent Gateway",
				KeyPrefix: "sk-sw-prod-88***",
				CreatedAt: "2026-10-10T12:00:00Z",
				LastUsed:  "Just now",
			},
			{
				ID:        "key_991824",
				Name:      "Cursor IDE Integration",
				KeyPrefix: "sk-sw-dev-44***",
				CreatedAt: "2026-10-11T09:30:00Z",
				LastUsed:  "2 hours ago",
			},
		},
	})
}

// CreateKey generates a new sk-sw-... API key
func (kc *ApiKeyController) CreateKey(c *gin.Context) {
	var req CreateApiKeyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bytes := make([]byte, 16)
	_, _ = rand.Read(bytes)
	rawKey := fmt.Sprintf("sk-sw-%s", hex.EncodeToString(bytes))

	c.JSON(http.StatusCreated, gin.H{
		"id":         fmt.Sprintf("key_%d", time.Now().Unix()),
		"name":       req.Name,
		"secret_key": rawKey,
		"key_prefix": rawKey[:12] + "***",
		"created_at": time.Now().Format(time.RFC3339),
	})
}

