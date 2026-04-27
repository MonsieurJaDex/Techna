FROM golang:1.26.2

WORKDIR /app


COPY go.mod ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -v -o app ./cmd/app

CMD ["./app"]