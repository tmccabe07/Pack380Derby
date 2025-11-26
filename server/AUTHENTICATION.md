# API Authentication

This API uses Bearer Token authentication to secure all endpoints.

## Setup

1. **Configure your bearer token** in the environment file:
   - Development: `dev.env`
   - Production: `prod.env`

   ```env
   API_BEARER_TOKEN="your-secure-token-here"
   ```

   **Important:** Use a strong, randomly generated token in production. You can generate one using:
   ```bash
   # PowerShell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   
   # Or online at: https://www.uuidgenerator.net/
   ```

## Making API Calls

### Using cURL
```bash
curl -H "Authorization: Bearer your-secret-bearer-token-change-this-in-production" http://localhost:3000/api/racer
```

### Using JavaScript/Fetch
```javascript
fetch('http://localhost:3000/api/racer', {
  headers: {
    'Authorization': 'Bearer your-secret-bearer-token-change-this-in-production'
  }
})
```

### Using Axios
```javascript
const axios = require('axios');

axios.get('http://localhost:3000/api/racer', {
  headers: {
    'Authorization': 'Bearer your-secret-bearer-token-change-this-in-production'
  }
})
```

### Using Swagger UI
1. Navigate to `http://localhost:3000/api/docs`
2. Click the **Authorize** button (lock icon) at the top
3. Enter your bearer token (without the "Bearer " prefix)
4. Click **Authorize**
5. Now all requests from Swagger will include the token

## Making Routes Public (Optional)

If you need specific endpoints to be publicly accessible without authentication, use the `@Public()` decorator:

```typescript
import { Public } from '../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @Public()  // This endpoint won't require authentication
  check() {
    return { status: 'ok' };
  }
}
```

## Error Responses

### 401 Unauthorized - Missing token
```json
{
  "statusCode": 401,
  "message": "Missing authorization header",
  "error": "Unauthorized"
}
```

### 401 Unauthorized - Invalid token
```json
{
  "statusCode": 401,
  "message": "Invalid bearer token",
  "error": "Unauthorized"
}
```

### 401 Unauthorized - Wrong auth type
```json
{
  "statusCode": 401,
  "message": "Invalid authorization type",
  "error": "Unauthorized"
}
```

## Security Best Practices

1. **Never commit tokens to version control** - They're in `.env` files which should be in `.gitignore`
2. **Use strong, random tokens** - At least 32 characters, mix of letters, numbers, and special characters
3. **Rotate tokens periodically** - Especially if you suspect compromise
4. **Use different tokens per environment** - Dev, staging, and production should all have unique tokens
5. **Use HTTPS in production** - Bearer tokens should never be sent over unencrypted connections
6. **Store tokens securely on the client** - Use environment variables, not hardcoded in source
