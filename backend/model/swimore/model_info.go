package swimore

type ModelCard struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	Provider      string  `json:"provider"`
	TierBadge     string  `json:"tier_badge"`
	PartnerBadge  string  `json:"partner_badge,omitempty"`
	PriceInput    float64 `json:"price_input"`
	PriceOutput   float64 `json:"price_output"`
	LatencyMs     int     `json:"latency_ms"`
	ThroughputTPS float64 `json:"throughput_tps"`
	UptimePercent float64 `json:"uptime_percent"`
	ContextWindow int     `json:"context_window"`
	Status        string  `json:"status"` // Ready, Degraded, Down
}

type ModelListResponse struct {
	Object string      `json:"object"`
	Data   []ModelCard `json:"data"`
}

