package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/wailsapp/wails/v3/pkg/application"
)

const preferencesSchemaVersion = 1

type PreferencesSnapshot struct {
	SchemaVersion int            `json:"schemaVersion"`
	Values        map[string]any `json:"values"`
}

type PreferenceService struct {
	mu     sync.RWMutex
	path   string
	values map[string]any
}

func NewPreferenceService() *PreferenceService {
	return &PreferenceService{
		values: defaultPreferences(),
	}
}

func (s *PreferenceService) ServiceName() string {
	return "PreferenceService"
}

func (s *PreferenceService) ServiceStartup(_ context.Context, _ application.ServiceOptions) error {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return fmt.Errorf("resolve config directory: %w", err)
	}

	s.path = filepath.Join(configDir, appProductIdentifier, "preferences.json")
	return s.load()
}

func (s *PreferenceService) ServiceShutdown() error {
	return s.Save()
}

func (s *PreferenceService) Path() string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.path
}

func (s *PreferenceService) All() PreferencesSnapshot {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return PreferencesSnapshot{
		SchemaVersion: preferencesSchemaVersion,
		Values:        cloneMap(s.values),
	}
}

func (s *PreferenceService) Get(key string) (any, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	value, ok := s.values[key]
	return value, ok
}

func (s *PreferenceService) Set(key string, value any) error {
	if key == "" {
		return errors.New("preference key cannot be empty")
	}

	s.mu.Lock()
	s.values[key] = value
	s.mu.Unlock()

	return s.Save()
}

func (s *PreferenceService) Delete(key string) error {
	if key == "" {
		return errors.New("preference key cannot be empty")
	}

	s.mu.Lock()
	delete(s.values, key)
	s.mu.Unlock()

	return s.Save()
}

func (s *PreferenceService) Reset() error {
	s.mu.Lock()
	s.values = defaultPreferences()
	s.mu.Unlock()

	return s.Save()
}

func (s *PreferenceService) Save() error {
	s.mu.RLock()
	path := s.path
	snapshot := PreferencesSnapshot{
		SchemaVersion: preferencesSchemaVersion,
		Values:        cloneMap(s.values),
	}
	s.mu.RUnlock()

	if path == "" {
		return nil
	}

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return fmt.Errorf("create preferences directory: %w", err)
	}

	data, err := json.MarshalIndent(snapshot, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal preferences: %w", err)
	}

	tmpPath := path + ".tmp"
	if err := os.WriteFile(tmpPath, data, 0o600); err != nil {
		return fmt.Errorf("write preferences: %w", err)
	}
	if err := os.Rename(tmpPath, path); err != nil {
		return fmt.Errorf("replace preferences: %w", err)
	}
	return nil
}

func (s *PreferenceService) load() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.values = defaultPreferences()

	data, err := os.ReadFile(s.path)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("read preferences: %w", err)
	}

	var snapshot PreferencesSnapshot
	if err := json.Unmarshal(data, &snapshot); err != nil {
		return fmt.Errorf("decode preferences: %w", err)
	}

	for key, value := range snapshot.Values {
		s.values[key] = value
	}
	return nil
}

func defaultPreferences() map[string]any {
	return map[string]any{
		"theme":   "system",
		"sidebar": true,
	}
}

func cloneMap(source map[string]any) map[string]any {
	result := make(map[string]any, len(source))
	for key, value := range source {
		result[key] = value
	}
	return result
}
