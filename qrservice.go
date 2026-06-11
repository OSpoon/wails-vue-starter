package main

import (
	"github.com/skip2/go-qrcode"
)

type QRService struct {
}

func NewQRSerice() *QRService {
	return &QRService{}
}

func (s *QRService) Generate(data string, size int) ([]byte, error){
	qrCode, err := qrcode.New(data, qrcode.Medium)
	if err != nil {
		return nil, err
	}

	png, err := qrCode.PNG(size)
	if err != nil {
		return nil, err
	}

	return png, nil
}