package models

import "time"

// Represents the Task received from the API
type Task struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"dueDate"`
	Completed   bool      `json:"completed"`
}
