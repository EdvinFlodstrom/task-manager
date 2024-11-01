package config

import "time"

type NotificationConfig struct {
	EarlyNotification time.Duration // Early notification threshold
	LateNotification  time.Duration // Late notification threshold
	ApiURL            string        // Base URL for backend API
}

// Initialize and return NotificationConfig with default values
func LoadConfig() NotificationConfig {
	return NotificationConfig{
		EarlyNotification: 120 * time.Hour,
		LateNotification:  24 * time.Hour,
		ApiURL:            "http://localhost:3001",
	}
}
