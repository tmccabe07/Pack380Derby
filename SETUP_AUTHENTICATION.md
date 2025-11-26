# Bearer Token Authentication Setup Guide

Your Pinewood Derby application now uses bearer token authentication to secure all API endpoints. This guide explains how to set it up and use it.

## What Changed?

1. **Server (NestJS)**: All API endpoints now require a valid bearer token
2. **Client (Next.js)**: All API calls automatically include the bearer token
3. **Environment Variables**: Both apps need the token configured

## Setup Instructions

### Step 1: Generate a Secure Token

Generate a strong, random token for production. Here are some options:

**PowerShell (Windows):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Online Generator:**
- Visit https://www.uuidgenerator.net/
- Or https://randomkeygen.com/

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Configure the Server

1. Open `server/dev.env` (for development) or `server/prod.env` (for production)
2. Set the `API_BEARER_TOKEN` to your generated token:

```env
API_BEARER_TOKEN="your-generated-token-here"
```

**Example:**
```env
API_BEARER_TOKEN="a8f5c9e2b1d4a7c3f6e9b2d5a8c1f4e7"
```

### Step 3: Configure the Next.js Client

1. Open `app/.env.local` (create it if it doesn't exist)
2. Set the `NEXT_PUBLIC_API_BEARER_TOKEN` to **the same token** from Step 2:

```env
NEXT_PUBLIC_DERBY_API_URL="http://localhost:3000"
NEXT_PUBLIC_API_BEARER_TOKEN="a8f5c9e2b1d4a7c3f6e9b2d5a8c1f4e7"
```

**Important:** The tokens must match exactly between server and client!

### Step 4: Restart Both Applications

After updating the environment variables:

**Server:**
```bash
cd server
npm run start:dev
```

**Next.js App:**
```bash
cd app
npm run dev
```

## Testing the Setup

### Test 1: API Without Token (Should Fail)
```bash
curl http://localhost:3000/api/racer
```

Expected response:
```json
{
  "statusCode": 401,
  "message": "Missing authorization header",
  "error": "Unauthorized"
}
```

### Test 2: API With Token (Should Succeed)
```bash
curl -H "Authorization: Bearer your-generated-token-here" http://localhost:3000/api/racer
```

Expected response: JSON array of racers

### Test 3: Swagger UI
1. Navigate to http://localhost:3000/api/docs
2. Click the **Authorize** button (🔒 lock icon)
3. Enter your token (without "Bearer ")
4. Click **Authorize**
5. Try any endpoint - it should work

### Test 4: Next.js App
1. Navigate to http://localhost:3001 (or your Next.js port)
2. The app should load data normally
3. Check browser console - no 401 errors should appear

## Troubleshooting

### Problem: Getting 401 errors in Next.js app

**Solutions:**
1. Verify `.env.local` exists in the `app` directory
2. Verify `NEXT_PUBLIC_API_BEARER_TOKEN` is set correctly
3. Verify the token matches the server's `API_BEARER_TOKEN`
4. Restart the Next.js dev server (`npm run dev`)
5. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)

### Problem: Token not found in server

**Solutions:**
1. Verify `dev.env` or `prod.env` has `API_BEARER_TOKEN` set
2. Check that you're using the correct env file (dev vs prod)
3. Restart the server

### Problem: Still getting 401 even with correct token

**Solutions:**
1. Check for extra spaces in the token
2. Ensure no quotes are included in the actual token value
3. Verify the Authorization header format: `Bearer <token>`
4. Check server logs for specific error messages

## Production Deployment

### Security Checklist:

- [ ] Generate a new, unique token for production (don't reuse dev token)
- [ ] Use a token with at least 32 characters
- [ ] Never commit tokens to version control
- [ ] Use environment variables on your hosting platform
- [ ] Enable HTTPS/SSL on your production server
- [ ] Rotate tokens periodically (every 3-6 months)
- [ ] Use different tokens for different environments

### Deployment Platform Setup:

**Vercel (Next.js):**
1. Go to Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_API_BEARER_TOKEN` with your production token
3. Add `NEXT_PUBLIC_DERBY_API_URL` with your production API URL
4. Redeploy

**AWS/Heroku/etc (NestJS Server):**
1. Set environment variable `API_BEARER_TOKEN` in your platform
2. Set `NODE_ENV=prod`
3. Ensure `prod.env` has a fallback value (encrypted)
4. Redeploy

## Making Routes Public (Advanced)

If you need specific endpoints accessible without authentication, use the `@Public()` decorator:

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @Public()  // This endpoint is now public
  check() {
    return { status: 'ok', timestamp: Date.now() };
  }
}
```

## Architecture Overview

```
┌─────────────────┐                    ┌──────────────────┐
│  Next.js Client │                    │  NestJS Server   │
│                 │                    │                  │
│  .env.local:    │                    │  dev.env:        │
│  TOKEN="abc123" │    HTTP Request    │  TOKEN="abc123"  │
│                 │───────────────────>│                  │
│  API Client     │  Authorization:    │  Auth Guard      │
│  adds header    │  Bearer abc123     │  validates token │
│                 │<───────────────────│                  │
│                 │    JSON Response   │                  │
└─────────────────┘                    └──────────────────┘
```

## Need Help?

- Check server logs for authentication errors
- Check browser console for 401 responses
- Review the server's `AUTHENTICATION.md` for more details
- Ensure both server and client are using the same token
