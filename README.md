# Techna

> A cross-platform employee portal with an HR assistant, built for web and mobile.

Techna is an internal employee portal that combines a modern cross-platform frontend with backend services for authentication and an HR-oriented chat assistant.

The application provides employees with a central place to access company information, interact with an HR assistant, and navigate internal services.

## Features

* 🔐 **Employee authentication** with token-based sessions
* 💬 **HR Assistant** for questions about vacations, benefits, certificates, payments, and internal processes
* ⚡ **Quick actions** for common HR questions
* 📰 **Company news** section
* 📅 **Employee calendar**
* 📄 **Documents** section
* 🖼️ **Photo gallery**
* 🛍️ **12:21STORE** portal entry
* 📱 **Cross-platform UI** for Android, iOS, and Web
* 🗃️ **Document and knowledge-base infrastructure** using object storage and vector search

## Tech Stack

### Frontend

* React Native
* Expo SDK 54
* TypeScript
* Expo Router
* Zustand
* React Native Reanimated

### Backend

* **Go + Gin** — authentication service
* **Python + FastAPI** — HR assistant / bot service
* **PostgreSQL** — application data
* **Qdrant** — vector search / knowledge retrieval
* **MinIO** — S3-compatible object storage
* **Docker Compose** — local development infrastructure

## Architecture

```text
                    ┌──────────────────────┐
                    │      Techna App      │
                    │ React Native / Expo  │
                    │  Android / iOS / Web  │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │  Auth Service   │          │   Bot Service   │
       │   Go + Gin      │          │ Python + FastAPI│
       │     :8080       │          │      :8000      │
       └────────┬────────┘          └────────┬────────┘
                │                            │
                ▼                ┌───────────┴───────────┐
       ┌─────────────────┐       │                       │
       │   PostgreSQL    │       ▼                       ▼
       │      :5432      │   ┌─────────┐            ┌─────────┐
       └─────────────────┘   │ Qdrant  │            │  MinIO  │
                             │  :6333  │            │ :9000   │
                             └─────────┘            └─────────┘
```

## Project Structure

```text
Techna/
├── assets/                 # Images, icons and application assets
├── backend/
│   ├── auth/               # Go authentication service
│   └── bot/                # Python HR assistant service
├── src/
│   ├── app/                # Expo Router screens
│   ├── components/         # Reusable UI components
│   ├── services/           # API clients
│   ├── store/              # Zustand application state
│   └── types/              # TypeScript types
├── docker-compose.yaml     # Backend infrastructure
├── app.json                # Expo configuration
├── package.json            # Frontend dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Requirements

Make sure the following tools are installed:

* Node.js and npm
* Docker Desktop or Docker Engine with Docker Compose

You do not need to install Go or Python manually when using the provided Docker setup.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MonsieurJaDex/Techna.git
cd Techna
```

### 2. Install frontend dependencies

```bash
npm ci
```

### 3. Configure the frontend

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

The frontend uses `EXPO_PUBLIC_API_BASE_URL` to determine where API requests should be sent.

### 4. Configure the authentication service

Create:

```text
backend/auth/.env
```

Example:

```env
DEBUG=true

DB_NAME=techna
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgres
DB_PORT=5432

HOST_ADDR=0.0.0.0
HOST_PORT=8080

SECRET=change-this-secret
```

The authentication service requires all of these configuration values to be present.

### 5. Configure the bot service

Create:

```text
backend/bot/.env
```

Example:

```env
DEBUG=true

DB_NAME=techna
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgres
DB_PORT=5432

S3_HOST=minio
S3_PORT=9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=files

API_KEY=your-api-key
```

Replace `API_KEY` with the key required by your deployment.

### 6. Start the backend

```bash
docker compose up --build
```

The default services expose:

| Service       |   Port | Purpose                          |
| ------------- | -----: | -------------------------------- |
| Auth API      | `8080` | Authentication and user sessions |
| Bot API       | `8000` | HR assistant backend             |
| PostgreSQL    | `5432` | Relational database              |
| MinIO         | `9000` | Object storage API               |
| MinIO Console | `9001` | Object storage administration    |
| Qdrant REST   | `6333` | Vector database API              |
| Qdrant gRPC   | `6334` | Vector database gRPC API         |

To run the services in the background:

```bash
docker compose up -d --build
```

To stop them:

```bash
docker compose down
```

## Running the Frontend

Start the Expo development server:

```bash
npm run start
```

Or use one of the platform-specific commands:

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

### Web

```bash
npm run web
```

There is also an offline development mode:

```bash
npm run dev
```

which starts Expo on port `8082` with the offline option enabled.

## Local Device Configuration

When running the application on a physical phone, `localhost` refers to the phone itself rather than your development computer.

Set `EXPO_PUBLIC_API_BASE_URL` to the local network address of the computer running the backend, for example:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080
```

For an Android emulator, you may need:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080
```

## HR Assistant

The application includes an HR chat interface available after authentication.

Users can ask questions such as:

```text
How many vacation days do I have?
When is the salary paid?
How do I request vacation?
What does the DMS program include?
```

The frontend sends authenticated requests to the backend chat endpoint and displays the returned answer together with optional sources.

The backend is designed around a retrieval-oriented architecture using Qdrant for vector search and MinIO for document storage.

## Development

### Frontend

Useful commands:

```bash
npm run start
npm run android
npm run ios
npm run web
```

Install dependencies from the lockfile:

```bash
npm ci
```

### Authentication Service

The authentication service is written in Go and uses:

* Gin
* GORM
* PostgreSQL
* JWT
* `godotenv`

The service loads its configuration from `backend/auth/.env`.

### Bot Service

The HR assistant is implemented in Python using FastAPI.

Its infrastructure includes:

* PostgreSQL
* Qdrant
* MinIO
* FastAPI
* `qdrant-client`
* MinIO client
* OpenAI Python SDK
* FastEmbed

## Environment Variables

### Frontend

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Authentication service

```env
DEBUG=true
DB_NAME=techna
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgres
DB_PORT=5432
HOST_ADDR=0.0.0.0
HOST_PORT=8080
SECRET=change-this-secret
```

### Bot service

```env
DEBUG=true
DB_NAME=techna
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgres
DB_PORT=5432
S3_HOST=minio
S3_PORT=9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=files
API_KEY=your-api-key
```

> Never commit real credentials
