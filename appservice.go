package main

import (
	"context"
	"time"

	"github.com/wailsapp/wails/v3/pkg/application"
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

type AppService struct {
	app  *application.App
	info AppInfo
}

func NewAppService(app *application.App, info AppInfo) *AppService {
	return &AppService{app: app, info: info}
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

func (s *AppService) Now() string {
	return time.Now().Format(time.RFC1123)
}
