package swimore

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatCompletionRequest struct {
	Model       string        `json:"model" binding:"required"`
	Messages    []ChatMessage `json:"messages" binding:"required"`
	Stream      bool          `json:"stream"`
	Temperature float64       `json:"temperature"`
	MaxTokens   int           `json:"max_tokens"`
}

type ChatChoice struct {
	Index        int         `json:"index"`
	Message      ChatMessage `json:"message"`
	FinishReason string      `json:"finish_reason"`
}

type UsageStats struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

type RoutingTrace struct {
	Path        string `json:"path"`        // Path A or Path B
	Model       string `json:"model"`       // Target resolved model
	Provider    string `json:"provider"`    // Direct Provider or Partner Handle
	LatencyMs   int64  `json:"latency_ms"`  // Measured response latency
	SCUConsumed int    `json:"scu_consumed"`// SCU capacity units
}

type ChatCompletionResponse struct {
	ID      string        `json:"id"`
	Object  string        `json:"object"`
	Created int64         `json:"created"`
	Model   string        `json:"model"`
	Choices []ChatChoice  `json:"choices"`
	Usage        UsageStats    `json:"usage"`
	Trace        *RoutingTrace `json:"trace,omitempty"`
	RoutingTrace *RoutingTrace `json:"routing_trace,omitempty"`
}

type StreamDelta struct {
	Role    string `json:"role,omitempty"`
	Content string `json:"content,omitempty"`
}

type StreamChoice struct {
	Index        int         `json:"index"`
	Delta        StreamDelta `json:"delta"`
	FinishReason *string     `json:"finish_reason"`
}

type ChatCompletionStreamChunk struct {
	ID      string         `json:"id"`
	Object  string         `json:"object"`
	Created int64          `json:"created"`
	Model   string         `json:"model"`
	Choices []StreamChoice `json:"choices"`
}

