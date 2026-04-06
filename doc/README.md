# Chat Messaging Platform - Documentation

## Quick Start URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000 |
| Swagger API Docs | http://localhost:3000/api/docs |
| API Base URL | http://localhost:3000/api/v1 |

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [API Documentation](#api-documentation)
5. [WebSocket Events](#websocket-events)
6. [Database Schema](#database-schema)
7. [Deployment](#deployment)

---

## Features

### 1. Authentication & Authorization
- **User Registration**: Register with email and password
- **Login**: JWT-based authentication with access & refresh tokens
- **Token Refresh**: Automatic token refresh mechanism
- **Logout**: Secure logout with token invalidation
- **Password Hashing**: bcrypt password hashing

### 2. Real-time Messaging
- **WebSocket Communication**: Socket.IO based real-time messaging
- **Message Types**: Text, image, file attachments
- **Delivery Status**: Sent, delivered, read receipts
- **Typing Indicators**: Real-time typing status
- **Message History**: Persistent message storage

### 3. Conversations
- **Direct Messages**: One-on-one conversations
- **Group Conversations**: Multi-participant group chats
- **Conversation Management**: Create, list, get by ID
- **Participant Management**: Join/leave conversations

### 4. User Management
- **User Profile**: View and update profile
- **User Search**: Search users by name/email
- **Online Presence**: Real-time online/offline status

### 5. File Attachments
- **File Upload**: Multer-based file uploads
- **Attachment Types**: Images, documents, files
- **Secure Downloads**: Authenticated file retrieval

### 6. Admin Features
- **Statistics**: Platform usage statistics
- **User Management**: Admin user oversight
- **Health Check**: System health monitoring

---

## Tech Stack

### Backend
- **Framework**: NestJS
- **Real-time**: Socket.IO
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Cache**: Redis
- **Auth**: JWT + Passport
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **State**: React hooks

### Infrastructure
- **Container**: Docker
- **Database**: PostgreSQL (Docker)
- **Cache**: Redis (Docker)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                     │
│                    localhost:3001                           │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP + WebSocket
┌─────────────────────────▼───────────────────────────────────┐
│                    Backend (NestJS)                          │
│                    localhost:3000                            │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │ Auth Module │  Users      │ Conversations│  Messages   │ │
│  │             │  Module     │   Module    │   Module    │ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │  Chat       │ Attachments│  Admin      │   Health    │ │
│  │  Gateway    │  Module     │  Module     │   Module    │ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  PostgreSQL   │  │     Redis     │  │     File      │
│   :5433       │  │    :6380      │  │    Storage    │
└───────────────┘  └───────────────┘  └───────────────┘
```

---

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Swagger UI
Access interactive API docs at: http://localhost:3000/api/docs

---

### Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <access_token>
```

---

### User Endpoints

#### Get Current User
```
GET /users/me
Authorization: Bearer <access_token>
```

#### Update Current User
```
PATCH /users/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://..."
}
```

#### Search Users
```
GET /users/search?q=john
Authorization: Bearer <access_token>
```

---

### Conversation Endpoints

#### Create Conversation
```
POST /conversations
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "type": "direct", // or "group"
  "participantIds": ["uuid1", "uuid2"],
  "name": "Group Name" // for group chats
}
```

#### Get Direct Conversation
```
POST /conversations/direct/:userId
Authorization: Bearer <access_token>
```

#### List Conversations
```
GET /conversations
Authorization: Bearer <access_token>
```

#### Get Conversation by ID
```
GET /conversations/:id
Authorization: Bearer <access_token>
```

---

### Message Endpoints

#### Send Message
```
POST /conversations/:conversationId/messages
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "Hello!",
  "type": "text"
}
```

#### Get Messages
```
GET /conversations/:conversationId/messages?limit=50&before=messageId
Authorization: Bearer <access_token>
```

#### Mark Message as Read
```
POST /conversations/:conversationId/messages/:messageId/read
Authorization: Bearer <access_token>
```

---

### Attachment Endpoints

#### Upload File
```
POST /attachments/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <binary>
```

#### Download File
```
GET /attachments/:id
Authorization: Bearer <access_token>
```

---

### Admin Endpoints

#### Get Statistics
```
GET /admin/stats
Authorization: Bearer <admin_token>
```

#### Get All Users
```
GET /admin/users
Authorization: Bearer <admin_token>
```

#### Health Check
```
GET /admin/health
Authorization: Bearer <admin_token>
```

---

## WebSocket Events

### Connect
```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'access_token' }
});
```

### Client Events

#### Send Message
```javascript
socket.emit('send_message', {
  conversationId: 'uuid',
  content: 'Hello!',
  type: 'text'
});
```

#### Join Conversation
```javascript
socket.emit('join_conversation', { conversationId: 'uuid' });
```

#### Leave Conversation
```javascript
socket.emit('leave_conversation', { conversationId: 'uuid' });
```

#### Typing Start
```javascript
socket.emit('typing_start', { conversationId: 'uuid' });
```

#### Typing Stop
```javascript
socket.emit('typing_stop', { conversationId: 'uuid' });
```

#### Message Delivered
```javascript
socket.emit('message_delivered', { messageId: 'uuid' });
```

#### Message Read
```javascript
socket.emit('message_read', { messageId: 'uuid' });
```

### Server Events

#### New Message
```javascript
socket.on('new_message', {
  id: 'uuid',
  conversationId: 'uuid',
  senderId: 'uuid',
  content: 'Hello!',
  type: 'text',
  status: 'sent',
  createdAt: '2024-01-01T00:00:00Z'
});
```

#### User Typing
```javascript
socket.on('user_typing', {
  conversationId: 'uuid',
  userId: 'uuid',
  isTyping: true
});
```

#### Message Status
```javascript
socket.on('message_status', {
  messageId: 'uuid',
  status: 'delivered',
  userId: 'uuid'
});
```

#### User Presence
```javascript
socket.on('user_presence', {
  userId: 'uuid',
  online: true
});
```

---

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | Hashed password |
| firstName | VARCHAR(100) | First name |
| lastName | VARCHAR(100) | Last name |
| avatar | VARCHAR(500) | Avatar URL |
| role | ENUM('user','admin') | User role |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Update date |

### Conversations Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| type | ENUM('direct','group') | Conversation type |
| name | VARCHAR(100) | Group name |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Update date |

### Conversation Participants Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| conversationId | UUID | FK to conversations |
| userId | UUID | FK to users |
| role | ENUM('admin','member') | Participant role |
| joinedAt | TIMESTAMP | Join date |

### Messages Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| conversationId | UUID | FK to conversations |
| senderId | UUID | FK to users |
| content | TEXT | Message content |
| type | ENUM('text','image','file') | Message type |
| status | ENUM('sent','delivered','read') | Delivery status |
| createdAt | TIMESTAMP | Creation date |

### Message Receipts Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| messageId | UUID | FK to messages |
| userId | UUID | FK to users |
| type | ENUM('delivered','read') | Receipt type |
| createdAt | TIMESTAMP | Creation date |

### Attachments Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| messageId | UUID | FK to messages |
| userId | UUID | FK to users |
| url | VARCHAR(500) | File URL |
| filename | VARCHAR(255) | Original filename |
| type | ENUM('image','file') | Attachment type |
| size | INTEGER | File size |
| createdAt | TIMESTAMP | Creation date |

### Refresh Tokens Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | FK to users |
| token | TEXT | Refresh token |
| expiresAt | TIMESTAMP | Expiration date |
| createdAt | TIMESTAMP | Creation date |

### User Blocks Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| blockerId | UUID | FK to users (blocker) |
| blockedId | UUID | FK to users (blocked) |
| createdAt | TIMESTAMP | Creation date |

---

## Deployment

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+

### Development Setup

#### 1. Clone the repository
```bash
git clone <repository-url>
cd chatmessaging
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=chatmessaging

# Redis
REDIS_HOST=localhost
REDIS_PORT=6380

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3000
CORS_ORIGIN=http://localhost:3001
```

#### 4. Start Docker Services
```bash
docker-compose up -d
```

This starts PostgreSQL and Redis containers.

#### 5. Run Backend
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

#### 6. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 7. Run Frontend
```bash
# Development
npm run dev
```

The frontend will be available at http://localhost:3001

### Production Deployment

#### Using Docker Compose

1. Update `.env` with production values
2. Build and start all services:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

#### Manual Production Setup

**Backend:**
```bash
cd backend
npm install --production
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
npm run start
```

### Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_USERNAME | Database username | postgres |
| DB_PASSWORD | Database password | postgres |
| DB_DATABASE | Database name | chatmessaging |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | Access token expiry | 15m |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | 7d |
| CORS_ORIGIN | CORS allowed origins | * |

### Health Check

```bash
curl http://localhost:3000/api/v1/health
```

### Monitoring

- Swagger UI: http://localhost:3000/api/docs
- Health endpoint: http://localhost:3000/api/v1/health

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues
```bash
# Check Docker containers
docker ps

# Check logs
docker logs chatmessaging-postgres
docker logs chatmessaging-redis
```

### Clear Database
```bash
# Drop all tables (development only)
docker exec -it chatmessaging-postgres-1 psql -U postgres -c "DROP DATABASE IF EXISTS chatmessaging;"
docker exec -it chatmessaging-postgres-1 psql -U postgres -c "CREATE DATABASE chatmessaging;"
```

### Clear Redis
```bash
docker exec -it chatmessaging-redis-1 redis-cli FLUSHALL
```
