package swimore

type PlusBenefit struct {
	Feature     string `json:"feature"`
	Description string `json:"description"`
	Included    bool   `json:"included"`
}

type PlanComparison struct {
	TierName        string        `json:"tier_name"`
	MonthlyPriceUSD float64       `json:"monthly_price_usd"`
	Benefits        []PlusBenefit `json:"benefits"`
}

