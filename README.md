# ChatMessaging - Real-Time Chat Platform

A production-grade, scalable real-time chat messaging platform similar to WhatsApp / Messenger / Slack DM.

## Overview

ChatMessaging is a full-stack real-time chat system built with modern technologies:

- **Backend**: Node.js, NestJS, TypeScript, Socket.IO, PostgreSQL, Redis
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Zustand
- **Architecture**: Clean Architecture with domain-driven design
- **Quality**: TypeScript, ESLint, Prettier, Jest tests

### Key Features

- Secure JWT authentication with refresh tokens
- Real-time bi-directional messaging via WebSocket
- Online/offline presence tracking
- Delivery and read receipts
- File attachments with S3/Cloud Storage support
- Scalable architecture with Redis adapter
- RESTful API with Swagger documentation

## Architecture

```
chatmessaging/
├── backend/                 # NestJS backend API
│   ├── src/
│   │   ├── common/         # Shared utilities (guards, filters, interceptors)
│   │   ├── domain/         # Domain entities
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/      # Authentication
│   │   │   ├── users/     # User management
│   │   │   ├── chat/      # Messaging
│   │   │   ├── conversations/
│   │   │   ├── presence/  # Online presence
│   │   │   ├── notifications/
│   │   │   ├── attachments/
│   │   │   └── admin/     # Admin endpoints
│   │   ├── config/        # Configuration
│   │   └── infrastructure/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # API and socket utilities
│   │   └── types/        # TypeScript types
│   ├── Dockerfile
│   └── package.json
│
├── deploy/                # Infrastructure as Code
│   ├── aws/              # AWS Terraform files
│   └── gcp/              # GCP Terraform files
│
├── .github/workflows/    # CI/CD pipelines
│
├── docker-compose.yml    # Local development
└── README.md
```

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: NestJS 10
- **Database**: PostgreSQL 15 with TypeORM
- **Cache/PubSub**: Redis 7
- **WebSocket**: Socket.IO with Redis adapter
- **Authentication**: JWT + Refresh Tokens
- **Validation**: class-validator
- **Logging**: Winston

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS
- **State**: Zustand
- **Real-time**: Socket.IO Client

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

### Local Development

1. Clone the repository
2. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   ```

3. Start with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the services:
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:3001
   - Swagger Docs: http://localhost:3000/api/docs
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run build
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout user |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Get current user |
| PATCH | `/api/v1/users/me` | Update current user |
| GET | `/api/v1/users/search` | Search users |

### Conversation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/conversations` | List user conversations |
| POST | `/api/v1/conversations` | Create conversation |
| POST | `/api/v1/conversations/direct/:userId` | Create/get direct conversation |
| GET | `/api/v1/conversations/:id` | Get conversation details |

### Message Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/conversations/:id/messages` | Get messages |
| POST | `/api/v1/conversations/:id/messages` | Send message |
| POST | `/api/v1/conversations/:id/messages/:messageId/read` | Mark as read |

### Attachment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/attachments/upload` | Upload file |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |

## WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|----------|-------------|
| `send_message` | `{ conversationId, content, type, clientMessageId }` | Send message |
| `join_conversation` | `{ conversationId }` | Join conversation room |
| `leave_conversation` | `{ conversationId }` | Leave conversation room |
| `typing_start` | `{ conversationId }` | User started typing |
| `typing_stop` | `{ conversationId }` | User stopped typing |
| `message_delivered` | `{ messageId }` | Mark message as delivered |
| `message_read` | `{ messageId, conversationId }` | Mark message as read |

### Server → Client

| Event | Payload | Description |
|-------|----------|-------------|
| `authenticated` | `{ userId }` | Connection authenticated |
| `receive_message` | `{ Message }` | New message received |
| `message_sent` | `{ serverMessageId, clientMessageId }` | Message sent confirmation |
| `typing_start` | `{ conversationId, userId }` | User started typing |
| `typing_stop` | `{ conversationId, userId }` | User stopped typing |
| `message_delivered` | `{ messageId, userId, status }` | Message delivered |
| `message_read` | `{ messageId, userId, status }` | Message read |
| `presence_update` | `{ userId, isOnline, lastSeenAt }` | Presence update |
| `error` | `{ code, message }` | Error occurred |

## Database Schema

### Entities

- **User**: User accounts with authentication
- **RefreshToken**: JWT refresh tokens
- **Conversation**: Chat conversations
- **ConversationParticipant**: Conversation members
- **Message**: Chat messages
- **MessageReceipt**: Delivery/read receipts
- **Attachment**: File attachments
- **BlockedUser**: Blocked users

## Testing

```bash
# Backend tests
cd backend
npm test

# With coverage
npm run test:cov
```

## Deployment

### AWS (ECS Fargate)

```bash
cd deploy/aws
terraform init
terraform plan
terraform apply
```

### GCP (Cloud Run)

```bash
cd deploy/gcp
terraform init
terraform plan
terraform apply -var="project_id=your-project"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 3000 |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | PostgreSQL user | postgres |
| `DB_PASSWORD` | PostgreSQL password | postgres |
| `DB_NAME` | Database name | chatmessaging |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | JWT secret | - |
| `JWT_ACCESS_TOKEN_EXPIRES_IN` | Access token expiry | 15m |
| `JWT_REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiry | 7d |

## License

MIT