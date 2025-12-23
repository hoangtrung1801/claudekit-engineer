# API Standards

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Product Architect

---

## 1. General Principles

- **RESTful** design for resource operations
- **Consistent** response formats across all endpoints
- **Versioned** APIs for backward compatibility
- **Documented** with OpenAPI/Swagger specs

---

## 2. URL Structure

### 2.1 Format

```
https://api.astraler.com/v1/{resource}/{id?}/{sub-resource?}
```

### 2.2 Conventions

| Rule | Example |
|------|---------|
| Lowercase | `/users` not `/Users` |
| Plural nouns | `/products` not `/product` |
| Hyphens for multi-word | `/order-items` not `/orderItems` |
| No trailing slash | `/users` not `/users/` |
| No file extensions | `/users` not `/users.json` |

### 2.3 Examples

```
GET    /v1/products              # List products
GET    /v1/products/:id          # Get single product
POST   /v1/products              # Create product
PATCH  /v1/products/:id          # Update product
DELETE /v1/products/:id          # Delete product

GET    /v1/orders/:id/items      # Sub-resource
POST   /v1/auth/login            # Action endpoint
```

---

## 3. HTTP Methods

| Method | Usage | Idempotent | Safe |
|--------|-------|------------|------|
| GET | Read resource(s) | Yes | Yes |
| POST | Create resource | No | No |
| PUT | Replace resource | Yes | No |
| PATCH | Partial update | Yes | No |
| DELETE | Remove resource | Yes | No |

---

## 4. Response Format

### 4.1 Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "price": 100000
  },
  "meta": {
    "requestId": "req_xxx"
  }
}
```

### 4.2 Collection Response

```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "Product 1" },
    { "id": "2", "name": "Product 2" }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 4.3 Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "requestId": "req_xxx"
  }
}
```

---

## 5. Status Codes

### 5.1 Success Codes

| Code | Usage |
|------|-------|
| 200 | Success (with body) |
| 201 | Created |
| 204 | Success (no body) |

### 5.2 Client Error Codes

| Code | Usage |
|------|-------|
| 400 | Bad request / Validation error |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (not authorized) |
| 404 | Not found |
| 409 | Conflict |
| 422 | Unprocessable entity |
| 429 | Rate limit exceeded |

### 5.3 Server Error Codes

| Code | Usage |
|------|-------|
| 500 | Internal server error |
| 502 | Bad gateway |
| 503 | Service unavailable |

---

## 6. Error Codes

### 6.1 Format

```
{DOMAIN}_{ERROR_TYPE}
```

### 6.2 Standard Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `AUTH_REQUIRED` | 401 | Authentication required |
| `AUTH_INVALID` | 401 | Invalid credentials |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected error |

---

## 7. Query Parameters

### 7.1 Pagination

```
GET /products?page=1&per_page=20
```

| Param | Default | Max |
|-------|---------|-----|
| `page` | 1 | - |
| `per_page` | 20 | 100 |

### 7.2 Sorting

```
GET /products?sort=price&order=desc
GET /products?sort=-created_at  # Alternative: prefix with -
```

### 7.3 Filtering

```
GET /products?status=active&category=electronics
GET /products?price_min=100&price_max=500
```

### 7.4 Searching

```
GET /products?q=search+term
```

### 7.5 Field Selection

```
GET /products?fields=id,name,price
```

---

## 8. Authentication

### 8.1 Bearer Token

```
Authorization: Bearer <access_token>
```

### 8.2 API Key (Service-to-Service)

```
X-API-Key: <api_key>
```

---

## 9. Versioning

### 9.1 Strategy

URL-based versioning: `/v1/`, `/v2/`

### 9.2 Rules

- Major version in URL (`/v1/`, `/v2/`)
- Minor/patch versions don't change URL
- Deprecation notice 6 months before removal
- Max 2 versions supported simultaneously

---

## 10. Rate Limiting

### 10.1 Limits

| Tier | Limit | Window |
|------|-------|--------|
| Anonymous | 30 req | 1 min |
| Authenticated | 100 req | 1 min |
| Service | 1000 req | 1 min |

### 10.2 Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703347200
```

---

**Cross-References:**
- Coding Standards: `02-standards/coding-standards.md`
- Data Architecture: `01-architecture/data-architecture.md`
