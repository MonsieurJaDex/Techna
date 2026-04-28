package utils

import (
	"encoding/json"
)

func PayloadToString(payload interface{}) (string, error) {
	bytesPayload, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	return string(bytesPayload), nil
}
