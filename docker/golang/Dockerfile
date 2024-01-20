FROM golang:1.20-alpine

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY . .

RUN cd server && go build -o /go-afisha-feeds main.go


ENTRYPOINT ["/go-afisha-feeds"]
