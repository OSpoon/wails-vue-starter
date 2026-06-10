package main

import (
	"context"
	"fmt"
	"runtime"
	"strings"
	"time"

	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/services/notifications"
)

type AppInfo struct {
	Name              string `json:"name"`
	DisplayName       string `json:"displayName"`
	Description       string `json:"description"`
	Version           string `json:"version"`
	ProductIdentifier string `json:"productIdentifier"`
	Author            string `json:"author"`
	TitlebarHeight    int    `json:"titlebarHeight"`
}

type RuntimeEnvironment struct {
	OS           string         `json:"os"`
	Arch         string         `json:"arch"`
	Debug        bool           `json:"debug"`
	DarkMode     bool           `json:"darkMode"`
	AccentColor  string         `json:"accentColor"`
	PlatformInfo map[string]any `json:"platformInfo"`
}

type NotificationRequest struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	Body     string `json:"body"`
}

type NotificationInteraction struct {
	ID               string         `json:"id"`
	ActionIdentifier string         `json:"actionIdentifier"`
	CategoryID       string         `json:"categoryId"`
	Title            string         `json:"title"`
	Subtitle         string         `json:"subtitle"`
	Body             string         `json:"body"`
	UserText         string         `json:"userText"`
	UserInfo         map[string]any `json:"userInfo"`
	Error            string         `json:"error,omitempty"`
}

type NotificationAuthorization struct {
	Allowed  bool   `json:"allowed"`
	Platform string `json:"platform"`
	Message  string `json:"message"`
}

type AppService struct {
	app           *application.App
	info          AppInfo
	notifications *notifications.NotificationService
}

func NewAppService(
	app *application.App,
	info AppInfo,
	notificationService *notifications.NotificationService,
) *AppService {
	return &AppService{app: app, info: info, notifications: notificationService}
}

func (s *AppService) ServiceName() string {
	return "AppService"
}

func (s *AppService) ServiceStartup(ctx context.Context, _ application.ServiceOptions) error {
	s.app.Event.Emit("app:ready", s.info)
	return nil
}

func (s *AppService) Info() AppInfo {
	return s.info
}

func (s *AppService) Environment() RuntimeEnvironment {
	env := s.app.Env.Info()
	return RuntimeEnvironment{
		OS:           env.OS,
		Arch:         env.Arch,
		Debug:        env.Debug,
		DarkMode:     s.app.Env.IsDarkMode(),
		AccentColor:  s.app.Env.GetAccentColor(),
		PlatformInfo: env.PlatformInfo,
	}
}

func (s *AppService) OpenURL(url string) error {
	return s.app.Browser.OpenURL(url)
}

func (s *AppService) CopyText(text string) bool {
	return s.app.Clipboard.SetText(text)
}

func (s *AppService) ClipboardText() (string, bool) {
	return s.app.Clipboard.Text()
}

func (s *AppService) CheckNotificationAuthorization() (NotificationAuthorization, error) {
	if s.notifications == nil {
		return NotificationAuthorization{
			Allowed:  false,
			Platform: runtime.GOOS,
			Message:  "Notifications are not available.",
		}, NewAppError("NOTIFICATIONS_UNAVAILABLE", "Notifications are not available.", nil)
	}

	allowed, err := s.notifications.CheckNotificationAuthorization()
	if err != nil {
		return NotificationAuthorization{
			Allowed:  false,
			Platform: runtime.GOOS,
			Message:  err.Error(),
		}, normalizeNotificationError(err)
	}

	return NotificationAuthorization{
		Allowed:  allowed,
		Platform: runtime.GOOS,
		Message:  notificationAuthorizationMessage(allowed),
	}, nil
}

func (s *AppService) RequestNotificationAuthorization() (NotificationAuthorization, error) {
	if s.notifications == nil {
		return NotificationAuthorization{
			Allowed:  false,
			Platform: runtime.GOOS,
			Message:  "Notifications are not available.",
		}, NewAppError("NOTIFICATIONS_UNAVAILABLE", "Notifications are not available.", nil)
	}

	allowed, err := s.notifications.RequestNotificationAuthorization()
	if err != nil {
		return NotificationAuthorization{
			Allowed:  false,
			Platform: runtime.GOOS,
			Message:  err.Error(),
		}, normalizeNotificationError(err)
	}

	return NotificationAuthorization{
		Allowed:  allowed,
		Platform: runtime.GOOS,
		Message:  notificationAuthorizationMessage(allowed),
	}, nil
}

func (s *AppService) SendSystemNotification(request NotificationRequest) error {
	if s.notifications == nil {
		return NewAppError("NOTIFICATIONS_UNAVAILABLE", "Notifications are not available.", nil)
	}

	if request.ID == "" {
		request.ID = "starter-" + time.Now().Format("20060102150405.000000000")
	}

	allowed, err := s.notifications.CheckNotificationAuthorization()
	if err != nil {
		return normalizeNotificationError(err)
	}
	if !allowed {
		return NewAppError(
			"NOTIFICATIONS_NOT_ALLOWED",
			notificationAuthorizationMessage(false),
			map[string]any{"platform": runtime.GOOS},
		)
	}

	err = s.notifications.SendNotification(notifications.NotificationOptions{
		ID:       request.ID,
		Title:    request.Title,
		Subtitle: request.Subtitle,
		Body:     request.Body,
		Data: map[string]interface{}{
			"source": "foundation",
		},
	})
	if err != nil {
		return normalizeNotificationError(err)
	}

	return nil
}

func (s *AppService) Now() string {
	return time.Now().Format(time.RFC1123)
}

func notificationAuthorizationMessage(allowed bool) string {
	if allowed {
		return "System notifications are allowed for this application."
	}

	if runtime.GOOS == "darwin" {
		return "System notifications are not allowed. On macOS this usually requires a bundled, signed app and notification permission in System Settings."
	}

	return "System notifications are not allowed for this application."
}

func normalizeNotificationError(err error) error {
	if err == nil {
		return nil
	}

	message := err.Error()
	lowerMessage := strings.ToLower(message)
	if strings.Contains(lowerMessage, "not allowed") {
		return NewAppError(
			"NOTIFICATIONS_NOT_ALLOWED",
			fmt.Sprintf("%s %s", message, notificationAuthorizationMessage(false)),
			map[string]any{"platform": runtime.GOOS},
		)
	}

	return NewAppError(
		"NOTIFICATIONS_ERROR",
		message,
		map[string]any{"platform": runtime.GOOS},
	)
}
