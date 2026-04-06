# Environment Variables

## Development

Create a `.env` file in the backend directory:

```bash
cp backend/.env.example backend/.env
```

Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3000/chat
```

## Production

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment | Yes | `production` |
| `PORT` | Server port | Yes | `3000` |
| `CORS_ORIGIN` | Frontend URL | Yes | `https://your-domain.com` |
| `API_PREFIX` | API prefix | Yes | `api/v1` |
| `DB_HOST` | PostgreSQL host | Yes | `db.example.com` |
| `DB_PORT` | PostgreSQL port | Yes | `5432` |
| `DB_USERNAME` | PostgreSQL username | Yes | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | Yes | `secure-password` |
| `DB_NAME` | Database name | Yes | `chatmessaging` |
| `DB_POOL_SIZE` | Connection pool size | No | `20` |
| `REDIS_HOST` | Redis host | Yes | `redis.example.com` |
| `REDIS_PORT` | Redis port | Yes | `6379` |
| `REDIS_PASSWORD` | Redis password | No | `redis-password` |
| `JWT_SECRET` | JWT signing secret | Yes | `super-secret-key-min-32-chars` |
| `JWT_ACCESS_TOKEN_EXPIRES_IN` | Access token expiry | Yes | `15m` |
| `JWT_REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiry | Yes | `7d` |
| `AWS_ACCESS_KEY_ID` | AWS access key | No | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | No | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region | No | `us-east-1` |
| `AWS_S3_BUCKET` | S3 bucket name | No | `chatmessaging-attachments` |
| `AWS_ENDPOINT` | S3 endpoint (for S3-compatible) | No | `https://s3.amazonaws.com` |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `https://api.example.com/api/v1` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | Yes | `https://api.example.com/chat` |

### Example Production Backend .env

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.com
API_PREFIX=api/v1

DB_HOST=prod-db-host.aws.amazon.com
DB_PORT=5432
DB_USERNAME=chatuser
DB_PASSWORD=your-secure-db-password
DB_NAME=chatmessaging
DB_POOL_SIZE=20

REDIS_HOST=prod-redis-host.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-redis-password

JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=chatmessaging-attachments-prod
```

### Example Production Frontend .env.local

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
NEXT_PUBLIC_WS_URL=https://api.example.com/chat
```

## Docker Compose (Local Development)

The `docker-compose.yml` sets these default values:

- **PostgreSQL**: `localhost:5432` (user: `postgres`, password: `postgres`, db: `chatmessaging`)
- **Redis**: `localhost:6379`
- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:3001`