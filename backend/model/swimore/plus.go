package swimore

// UserEntitlement represents user plan details and capacity limits
type UserEntitlement struct {
	PlanName      string `json:"plan_name"`      // Free, Swimore Plus, VIP, VIP+
	BasicPoolCap  int    `json:"basic_pool_cap"`  // Universal baseline requests/day
	ProPoolCap    int    `json:"pro_pool_cap"`    // Model-group requests/day
	MaxPoolCap    int    `json:"max_pool_cap"`    // Exclusive partner requests/day
	TotalDailyCap int    `json:"total_daily_cap"`
	ResetsAt      string `json:"resets_at"`       // "00:00 WIB"
}

// SCUCapacityMetrics represents Swimore Capacity Units tracking
type SCUCapacityMetrics struct {
	SCUUnitValue          int     `json:"scu_unit_value"`          // 1 SCU = 1,000 reference requests/day
	PartnerCommittedReqs  int     `json:"partner_committed_reqs"`
	AvailabilityFactor    float64 `json:"availability_factor"`    // e.g. 0.98
	EffectiveCapacityReqs int     `json:"effective_capacity_reqs"`
	SCUContribution       float64 `json:"scu_contribution"`
}

