package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"swimore.ai/backend/router"
)

func main() {
	// Load environment if .env is present
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("================================================================================")
	fmt.Println("   SWIMORE.AI — INGRESS API & TRANSPORT CONTROLLERS (LAYER 3)")
	fmt.Println("================================================================================")
	fmt.Printf(" [x] HTTP Gateway listening on :%s\n", port)
	fmt.Println(" [x] Metadata-only logging active (Zero chat transcript retention)")
	fmt.Println(" [x] Partner SeaBank QRIS tax calculation (1.1% fee deduction)")
	fmt.Println(" [x] Dual-trigger incident channels (Discord, Telegram bot, n8n)")
	fmt.Println(" [x] Pool daily quota resets at 00:00 WIB")
	fmt.Println("================================================================================")

	r := router.SetupRouter()
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Gateway failed to start: %v", err)
	}
}

