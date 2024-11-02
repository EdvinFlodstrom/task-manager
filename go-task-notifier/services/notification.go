package services

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/EdvinFlodstrom/task-manager/go-task-notifier/config"
	"github.com/EdvinFlodstrom/task-manager/go-task-notifier/models"
)

type NotificationService struct {
	config            config.NotificationConfig // Configuration struct for the service
	sentNotifications map[string]bool           // Track sent notifications as "taskID:notificataionType"
	mu                sync.Mutex
}

// Initialize the NotificationService with config
func NewNotificationService(cfg config.NotificationConfig) *NotificationService {
	return &NotificationService{
		config:            cfg,
		sentNotifications: make(map[string]bool),
	}
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
	activeTasks := make(map[int]bool)

	for _, task := range tasks {
		if task.Completed {
			log.Printf("Task is already completed: %v", task)
			continue
		}

		// For each task fetched, mark it as active
		// Use to prevent notifications from being sent to irrelevant tasks
		activeTasks[task.ID] = true

		timeUntilDue := task.DueDate.Sub(now)
		if timeUntilDue <= ns.config.LateNotification && timeUntilDue > 0 {
			ns.sendNotificationIfNotSent(task, "Late")
		} else if timeUntilDue <= ns.config.EarlyNotification && timeUntilDue > ns.config.LateNotification {
			ns.sendNotificationIfNotSent(task, "Early")
		}
	}

	ns.removeOldTasksFromNotifications(activeTasks) // Ensure notifications are not sent to old tasks
}

// Only send notifications for tasks that have not yet had notifications sent
func (ns *NotificationService) sendNotificationIfNotSent(task models.Task, notificationType string) {
	ns.mu.Lock()
	defer ns.mu.Unlock()

	notificationKey := ns.generateNotificationKey(task.ID, notificationType)
	if ns.sentNotifications[notificationKey] {
		return // Notification has already been sent, skip
	}

	if err := ns.sendNotification(task, notificationType); err == nil {
		ns.sentNotifications[notificationKey] = true // Mark the type of notification as sent
	} else {
		log.Printf("Failed to send notification of type %v for task %d: %v", notificationType, task.ID, err)
	}
}

// Prevent notifications from being sent to tasks that are no longer active
func (ns *NotificationService) removeOldTasksFromNotifications(activeTasks map[int]bool) {
	ns.mu.Lock()
	defer ns.mu.Unlock()

	for key := range ns.sentNotifications {
		// Does not go past the line below
		taskID, _ := parseNotificationKey(key)
		if !activeTasks[taskID] {
			delete(ns.sentNotifications, key)
		}
	}
}

func (ns *NotificationService) generateNotificationKey(taskID int, notificationType string) string {
	return fmt.Sprintf("%d:%s", taskID, notificationType)
}

func parseNotificationKey(key string) (int, string) {
	var taskID int
	var notificationType string

	_, err := fmt.Sscanf(key, "%d:%s", &taskID, &notificationType)
	if err != nil {
		log.Printf("Failed to parse notification key '%s': %v", key, err)
	}

	return taskID, notificationType
}

// Send a notification to the user
// TODO: Adjust to send notification instead of logging
func (ns *NotificationService) sendNotification(task models.Task, notificationType string) error {
	dueDateInLocal := task.DueDate.In(time.Local)
	log.Printf("Sending %s notification for task '%s' due on %v", notificationType, task.Title, dueDateInLocal)

	return nil
}
