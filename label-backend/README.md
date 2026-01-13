# Nutri Saath Backend API

A Node.js + Express + TypeScript backend for the Nutri Saath application. Provides barcode scanning, bill parsing, and AI chat functionality.

## Features

- **Barcode Scanning**: Lookup product information using OpenFoodFacts API
- **Bill Scanner**: Parse receipts using Google Gemini Vision API  
- **AI Chatbot**: Natural language nutrition advice using Google Gemini
- **Health Monitoring**: MongoDB connection status and uptime tracking
- **Rate Limiting**: Per-route rate limits to prevent abuse
- **CORS Support**: Mobile app and ngrok development support

## Quick Start

### Prerequisites

- Node.js 20+ 
- MongoDB (optional - runs in degraded mode without it)
- Google Gemini API key (optional - for AI features)

### Installation

```bash
cd label-backend
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
# Required
NODE_ENV=development
PORT=8080

# Optional - MongoDB (app works without it)
MONGODB_URI=mongodb://localhost:27017/nutrisaath

# Optional - Google Gemini API (for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - OpenFoodFacts
OFF_APP_NAME=label-backend
OFF_USER_AGENT=label-backend/1.0

# Optional - CORS (comma-separated origins)
CORS_ORIGIN=http://localhost:5173,capacitor://localhost
```

### Running Locally

```bash
# Development mode with hot reload
npm run dev

# Production build and run
npm run build
npm start
```

The server will start on `http://localhost:8080`

### Exposing with ngrok

For mobile app development, expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose port 8080
ngrok http 8080
```

Copy the HTTPS URL (e.g., `https://proreduction-debra-nonmonarchally.ngrok-free.dev`) and use it in your mobile app configuration.

**Your current ngrok URL is already configured in CORS:**
- `https://proreduction-debra-nonmonarchally.ngrok-free.dev`

## API Endpoints

### Health Check

```bash
GET /health
```

Returns server status and MongoDB connection state:

```json
{
  "status": "ok",
  "uptime": 123.45,
  "commit": "local",
  "mongo": "connected"
}
```

### Barcode Lookup

```bash
POST /api/barcode/lookup
Content-Type: application/json

{
  "barcode": "8901030895061"
}
```

**Success Response:**
```json
{
  "found": true,
  "product": {
    "barcode": "8901030895061",
    "name": "Example Product",
    "brand": "Example Brand", 
    "ingredients": "Water, Sugar",
    "nutrients": { "energy-kcal": 140 },
    "images": [{"type": "front", "url": "https://..."}]
  },
  "source": "off"
}
```

**Not Found Response:**
```json
{
  "found": false
}
```

### Bill Scanner

```bash
POST /api/bill/parse
Content-Type: multipart/form-data

# Upload image file
curl -X POST http://localhost:8080/api/bill/parse \
  -F "image=@receipt.jpg"
```

**Success Response:**
```json
{
  "success": true,
  "bill": {
    "merchant": "Store Name",
    "date": "2024-01-15",
    "items": [
      {"name": "Product 1", "qty": 2, "unitPrice": 10.50},
      {"name": "Product 2", "qty": 1, "unitPrice": 5.00}
    ],
    "subtotal": 26.00,
    "tax": 2.60,
    "total": 28.60,
    "rawText": "Store Name\nProduct 1 x2 $10.50..."
  },
  "receiptId": "receipt_id_here"
}
```

### AI Chat

```bash
POST /api/ai/chat
Content-Type: application/json

{
  "message": "What are the health benefits of turmeric?"
}
```

**Success Response:**
```json
{
  "reply": "Turmeric is a powerful anti-inflammatory spice commonly used in Indian cooking...",
  "success": true
}
```

**Disabled Response:**
```json
{
  "error": "Gemini disabled",
  "message": "AI chat service is not configured"
}
```

## Rate Limits

- **Barcode Lookup**: 20 requests per minute
- **Bill Scanner**: 5 requests per minute  
- **AI Chat**: 10 requests per minute

## CORS Configuration

The API allows requests from:

- `http://localhost:*` (development)
- `capacitor://localhost` (Capacitor mobile apps)
- `ionic://localhost` (Ionic mobile apps)
- `*.ngrok.io` and `*.ngrok-free.app` (ngrok tunnels)
- Custom origins via `CORS_ORIGIN` environment variable

## Error Handling

All endpoints return consistent JSON error responses:

```json
{
  "error": {
    "message": "Error description",
    "requestId": "optional-request-id"
  }
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `503` - Service Unavailable (Gemini disabled)

## Development

### Project Structure

```
src/
├── controllers/     # Route handlers
├── services/        # Business logic
├── routes/          # Route definitions
├── middleware/      # Express middleware
├── models/          # Database models
├── config/          # Configuration
└── utils/           # Utilities
```

### Key Services

- **ProductService**: OpenFoodFacts integration with MongoDB caching
- **ReceiptService**: Gemini Vision API for bill parsing
- **ChatService**: Gemini text API for AI responses
- **OffClient**: OpenFoodFacts API client with retry logic

### Building for Production

```bash
# Build TypeScript
npm run build

# Run production server
npm start

# Or with Docker
docker build -t label-backend .
docker run -p 8080:8080 label-backend
```

## Mobile App Integration

### Capacitor Configuration

Update your `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.yourcompany.nutrisaath',
  appName: 'Nutri Saath',
  webDir: 'dist',
  server: {
    url: 'https://proreduction-debra-nonmonarchally.ngrok-free.dev',
    cleartext: true
  }
};
```

### Example API Calls

```typescript
// Barcode lookup
const response = await fetch('https://proreduction-debra-nonmonarchally.ngrok-free.dev/api/barcode/lookup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ barcode: '8901030895061' })
});

// Bill scanning
const formData = new FormData();
formData.append('image', imageFile);
const response = await fetch('https://proreduction-debra-nonmonarchally.ngrok-free.dev/api/bill/parse', {
  method: 'POST',
  body: formData
});
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**: App runs in degraded mode, some features may not work
2. **Gemini API Errors**: Check your API key and quota limits
3. **CORS Errors**: Ensure your origin is in the allowed list
4. **Rate Limiting**: Wait before retrying requests

### Logs

Check server logs for detailed error information:

```bash
# Development
npm run dev

# Production
npm start
```

### Health Check

Monitor server health:

```bash
curl http://localhost:8080/health
```

## License

MIT
