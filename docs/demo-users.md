# Demo User Credentials

For testing and development purposes, you can use the following demo accounts:

## Pre-created Demo Users

| Email | Username | Password | Display Name |
|-------|----------|----------|---------------|
| `demo@chatmessaging.com` | `demo` | `Demo@123` | Demo User |
| `john@chatmessaging.com` | `john` | `Demo@123` | John Doe |
| `jane@chatmessaging.com` | `jane` | `Demo@123` | Jane Smith |

## How to Create Demo Users

### Option 1: Via API

```bash
# Register demo user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@chatmessaging.com",
    "username": "demo",
    "password": "Demo@123",
    "displayName": "Demo User"
  }'

# Login to get tokens
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@chatmessaging.com",
    "password": "Demo@123"
  }'
```

### Option 2: Via Frontend

1. Navigate to `/register`
2. Fill in the registration form:
   - Email: `demo@chatmessaging.com`
   - Username: `demo`
   - Password: `Demo@123`
   - Display Name: `Demo User`
3. Click "Create account"

### Option 3: Database Seed (PostgreSQL)

Insert directly into the database:

```sql
-- Insert demo users (run in PostgreSQL container)
INSERT INTO users (id, email, username, "displayName", "role", "isEmailVerified", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'demo@chatmessaging.com', 'demo', 'Demo User', 'user', true, NOW(), NOW()),
  (gen_random_uuid(), 'john@chatmessaging.com', 'john', 'John Doe', 'user', true, NOW(), NOW()),
  (gen_random_uuid(), 'jane@chatmessaging.com', 'jane', 'Jane Smith', 'user', true, NOW(), NOW());

-- Note: Passwords must be hashed with bcrypt before insertion
-- The hashed password for 'Demo@123' is: $2a$10$N9qo8uLOickgx2ZMRZoMy... (use bcrypt to hash)
```

## Testing Flow

### Quick Test Flow

1. **Start the application**:
   ```bash
   docker-compose up --build
   ```

2. **Login with demo user**:
   - Open `http://localhost:3001`
   - Go to `/login`
   - Use: `demo@chatmessaging.com` / `Demo@123`

3. **Test messaging**:
   - Open a second browser/incognito window
   - Login as `john@chatmessaging.com`
   - Start a conversation between users
   - Send messages to test real-time functionality

### Automated Testing Flow

See [TESTING.md](./TESTING.md) for detailed testing instructions.

```bash
# Install dependencies
npm install

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## Security Notes

- ⚠️ **Change default passwords in production**
- ⚠️ **Use strong JWT secrets in production**
- ⚠️ **Enable email verification in production**
- Demo credentials are for testing only - disable or remove in production