package main

import (
	"encoding/json"
	"errors"
)

const defaultErrorCode = "APP_ERROR"

type AppError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details any    `json:"details,omitempty"`
}

func (e AppError) Error() string {
	return e.Message
}

func NewAppError(code string, message string, details any) AppError {
	if code == "" {
		code = defaultErrorCode
	}
	return AppError{Code: code, Message: message, Details: details}
}

func marshalAppError(err error) []byte {
	var appErr AppError
	if errors.As(err, &appErr) {
		return mustMarshalError(appErr)
	}

	return mustMarshalError(AppError{
		Code:    defaultErrorCode,
		Message: err.Error(),
	})
}

func mustMarshalError(appErr AppError) []byte {
	data, err := json.Marshal(appErr)
	if err != nil {
		return nil
	}
	return data
}
