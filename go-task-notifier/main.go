package main

import (
	"log"
	"time"

	"github.com/EdvinFlodstrom/task-manager/go-task-notifier/config"
	"github.com/EdvinFlodstrom/task-manager/go-task-notifier/services"
)

func main() {
	cfg := config.LoadConfig()
	notificationsService := services.NewNotificationService(cfg)

	// Ticker for periodic execution
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop() // Stop ticker before exiting

	for {
		log.Println("Checking for upcoming task notifications...")
		notificationsService.CheckAndNotify()
		<-ticker.C
	}
}
