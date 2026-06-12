package main

import (
	"context"
	"embed"
	"fmt"
	"log"
	"net/http"
	"runtime"
	"time"

	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/services/notifications"
	"github.com/wailsapp/wails/v3/pkg/updater"
	"github.com/wailsapp/wails/v3/pkg/updater/providers/appcast"
)

// Wails uses Go's `embed` package to embed the frontend files into the binary.
// Any files in the frontend/dist folder will be embedded into the binary and
// made available to the frontend.
// See https://pkg.go.dev/embed for more information.

//go:embed all:frontend/dist
var assets embed.FS

func init() {
	application.RegisterEvent[AppInfo]("app:ready")
	application.RegisterEvent[NotificationInteraction]("notification:result")
	// Register a custom event whose associated data type is string.
	// This is not required, but the binding generator will pick up registered events
	// and provide a strongly typed JS/TS API for them.
	application.RegisterEvent[string]("time")
}

// main function serves as the application's entry point. It initializes the application, creates a window,
// and starts a goroutine that emits a time-based event every second. It subsequently runs the application and
// logs any error that might occur.
func main() {

	// Create a new Wails application by providing the necessary options.
	// Variables 'Name' and 'Description' are for application metadata.
	// 'Assets' configures the asset server with the 'FS' variable pointing to the frontend files.
	// 'Bind' is a list of Go struct instances. The frontend has access to the methods of these instances.
	// 'Mac' options tailor the application when running an macOS.
	app := application.New(application.Options{
		Name:         appName,
		Description:  appDescription,
		MarshalError: marshalAppError,
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	info := AppInfo{
		Name:              appName,
		DisplayName:       appDisplayName,
		Description:       appDescription,
		Version:           appVersion,
		ProductIdentifier: appProductIdentifier,
		Author:            appAuthor,
		TitlebarHeight:    titlebarHeight,
	}

	notificationService := notifications.New()
	notificationService.OnNotificationResponse(func(result notifications.NotificationResult) {
		interaction := NotificationInteraction{
			ID:               result.Response.ID,
			ActionIdentifier: result.Response.ActionIdentifier,
			CategoryID:       result.Response.CategoryID,
			Title:            result.Response.Title,
			Subtitle:         result.Response.Subtitle,
			Body:             result.Response.Body,
			UserText:         result.Response.UserText,
			UserInfo:         result.Response.UserInfo,
		}
		if result.Error != nil {
			interaction.Error = result.Error.Error()
		}
		app.Event.Emit("notification:result", interaction)
	})

	app.RegisterService(application.NewService(notificationService))
	app.RegisterService(application.NewService(NewAppService(app, info, notificationService)))
	app.RegisterService(application.NewService(NewPreferenceService()))
	app.RegisterService(application.NewService(&GreetService{}))
	app.RegisterService(application.NewService(NewQRSerice()))

	appcastUpdater, err := appcast.New(appcast.Config{
		URL: updateFeedURL(),
		HTTPClient: &http.Client{
			Timeout: 5 * time.Minute,
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	if err := app.Updater.Init(updater.Config{
		CurrentVersion: appVersion,
		Providers:      []updater.Provider{appcastUpdater},
		Window: &updater.BuiltinWindow{
			Options: updater.WindowOptions{
				Width:         520,
				Height:        360,
				DisableResize: true,
			},
		},
	}); err != nil {
		log.Fatal(err)
	}

	// Create a new window with the necessary options.
	// 'Title' is the title of the window.
	// 'BackgroundColour' is the background colour of the window.
	// 'URL' is the URL that will be loaded into the webview.
	app.Window.NewWithOptions(application.WebviewWindowOptions{
		BackgroundColour: application.NewRGB(27, 38, 54),
		URL:              "/",
	})

	// Create a goroutine that emits an event containing the current time every second.
	// The frontend can listen to this event and update the UI accordingly.
	go func(ctx context.Context) {
		ticker := time.NewTicker(time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				app.Event.Emit("time", time.Now().Format(time.RFC1123))
			}
		}
	}(app.Context())

	// Run the application. This blocks until the application has been exited.
	err = app.Run()

	// If an error occurred while running the application, log it and exit.
	if err != nil {
		log.Fatal(err)
	}
}

func updateFeedURL() string {
	return fmt.Sprintf(
		"https://github.com/%s/releases/latest/download/appcast-%s-%s.xml",
		appRepository,
		runtime.GOOS,
		runtime.GOARCH,
	)
}
