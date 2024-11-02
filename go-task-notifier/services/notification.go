package services

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/EdvinFlodstrom/task-manager/go-task-notifier/config"
	"github.com/EdvinFlodstrom/task-manager/go-task-notifier/models"
)

type NotificationService struct {
	config config.NotificationConfig // Configuration struct for the service
}

// Initialize the NotificationService with config
func NewNotificationService(cfg config.NotificationConfig) *NotificationService {
	return &NotificationService{config: cfg}
}

// Fetch upcoming, incomplete tasks from the backend
func (ns *NotificationService) fetchUpcomingTasks() ([]models.Task, error) {
	upcomingTaskUrl := "/tasks/upcoming"

	response, err := http.Get(ns.config.ApiURL + upcomingTaskUrl)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	var tasks []models.Task
	if err := json.NewDecoder(response.Body).Decode(&tasks); err != nil {
		return nil, err
	}

	return tasks, nil
}

// Compare each task's due date to each threshold and notify user if any are met
func (ns *NotificationService) CheckAndNotify() {
	tasks, err := ns.fetchUpcomingTasks()
	if err != nil {
		log.Printf("Failed to fetch upcoming tasks: %v", err)
		return
	}

	now := time.Now()

	// TODO: Check if the following ever logs anything. It shouldn't. Remove first if statement eventually.
	for _, task := range tasks {
		if task.Completed {
			log.Printf("Task is already completed: %v", task)
			continue
		}

		timeUntilDue := task.DueDate.Sub(now)
		if timeUntilDue <= ns.config.LateNotification && timeUntilDue > 0 {
			ns.sendNotification(task, "Late notification")
		} else if timeUntilDue <= ns.config.EarlyNotification && timeUntilDue > ns.config.LateNotification {
			ns.sendNotification(task, "Early notification")
		}
	}
}

// Send a notification to the user
// TODO: Adjust to send notification instead of logging
func (ns *NotificationService) sendNotification(task models.Task, notificationType string) {
	dueDateInLocal := task.DueDate.In(time.Local)
	log.Printf("Sending %s for task '%s' due on %v", notificationType, task.Title, dueDateInLocal)
}
