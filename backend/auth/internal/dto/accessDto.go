package dto

type AccessDto struct {
	AccessToken string `json:"access_token" validate:"required"`
}
