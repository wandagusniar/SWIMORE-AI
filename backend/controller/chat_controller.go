package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"swimore.ai/backend/model/swimore"
)

type ChatController struct{}

func NewChatController() *ChatController {
	return &ChatController{}
}

// HandleChatCompletions handles OpenAI-compatible /v1/chat/completions
func (cc *ChatController) HandleChatCompletions(c *gin.Context) {
	var req swimore.ChatCompletionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{
				"message": fmt.Sprintf("Invalid request payload: %v", err),
				"type":    "invalid_request_error",
				"code":    "bad_request",
			},
		})
		return
	}

	c.Set("model_id", req.Model)

	// Simulated router resolution (Path A vs Path B)
	path := "Path A"
	provider := "Direct Provider"
	if strings.Contains(req.Model, "llama") || strings.Contains(req.Model, "qwen") {
		path = "Path B"
		provider = "Partner Endpoint"
	}

	start := time.Now()
	msgID := fmt.Sprintf("chatcmpl-%s", uuid.New().String())

	// If streaming requested, use SSE chunk flusher
	if req.Stream {
		c.Writer.Header().Set("Content-Type", "text/event-stream")
		c.Writer.Header().Set("Cache-Control", "no-cache")
		c.Writer.Header().Set("Connection", "keep-alive")
		c.Writer.Header().Set("Transfer-Encoding", "chunked")
		c.Writer.Header().Set("X-Swimore-Path", path)
		c.Writer.Header().Set("X-Swimore-Model", req.Model)

		// Simulated streaming response tokens
		responseTokens := []string{
			"Swimore", " routed", " your", " request", " seamlessly",
			" through", " " + req.Model, " via", " " + path, " with",
			" sub-second", " failover", " and", " zero-log", " privacy.",
		}

		for i, token := range responseTokens {
			var finishReason *string
			if i == len(responseTokens)-1 {
				fr := "stop"
				finishReason = &fr
			}

			chunk := swimore.ChatCompletionStreamChunk{
				ID:      msgID,
				Object:  "chat.completion.chunk",
				Created: time.Now().Unix(),
				Model:   req.Model,
				Choices: []swimore.StreamChoice{
					{
						Index: 0,
						Delta: swimore.StreamDelta{
							Content: token,
						},
						FinishReason: finishReason,
					},
				},
			}

			data, _ := json.Marshal(chunk)
			fmt.Fprintf(c.Writer, "data: %s\n\n", data)
			c.Writer.Flush()
			time.Sleep(30 * time.Millisecond) // micro-chunk pacing
		}

		// Close with SSE done indicator
		fmt.Fprintf(c.Writer, "data: [DONE]\n\n")
		c.Writer.Flush()

		c.Set("token_count", len(responseTokens)*2+20)
		return
	}

	// Non-streaming JSON response
	latency := time.Since(start).Milliseconds()
	content := fmt.Sprintf("Swimore routed your request seamlessly through %s via %s with sub-second failover and zero-log privacy.", req.Model, path)

	resp := swimore.ChatCompletionResponse{
		ID:      msgID,
		Object:  "chat.completion",
		Created: time.Now().Unix(),
		Model:   req.Model,
		Choices: []swimore.ChatChoice{
			{
				Index: 0,
				Message: swimore.ChatMessage{
					Role:    "assistant",
					Content: content,
				},
				FinishReason: "stop",
			},
		},
		Usage: swimore.UsageStats{
			PromptTokens:     24,
			CompletionTokens: 32,
			TotalTokens:      56,
		},
		Trace: &swimore.RoutingTrace{
			Path:        path,
			Model:       req.Model,
			Provider:    provider,
			LatencyMs:   latency,
			SCUConsumed: 1,
		},
		RoutingTrace: &swimore.RoutingTrace{
			Path:        path,
			Model:       req.Model,
			Provider:    provider,
			LatencyMs:   latency,
			SCUConsumed: 1,
		},
	}

	c.Set("token_count", 56)
	c.JSON(http.StatusOK, resp)
}

