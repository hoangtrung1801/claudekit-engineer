# Data Architecture

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Product Architect

---

## 1. Overview

Defines the data layer architecture including database schemas, relationships, and data flow patterns.

---

## 2. Database Strategy

### 2.1 Primary Database

| Attribute | Value |
|-----------|-------|
| **Engine** | PostgreSQL 15 |
| **Provider** | Supabase |
| **Connection** | Connection pooling via Supavisor |
| **Backup** | Daily automated, 7-day retention |

### 2.2 Caching Layer

| Attribute | Value |
|-----------|-------|
| **Engine** | Redis |
| **Provider** | Upstash |
| **Strategy** | Cache-aside pattern |
| **TTL Default** | 5 minutes |

### 2.3 File Storage

| Attribute | Value |
|-----------|-------|
| **Provider** | Cloudflare R2 |
| **Access** | Signed URLs (15min expiry) |
| **CDN** | Cloudflare edge caching |

---

## 3. Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    users    │       │   orders    │       │  products   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │    ┌──│ id (PK)     │
│ email       │  │    │ user_id(FK) │◄───┘  │ name        │
│ name        │  └───►│ status      │       │ price       │
│ role        │       │ total       │       │ stock       │
│ created_at  │       │ created_at  │       │ created_at  │
└─────────────┘       └──────┬──────┘       └─────────────┘
                             │
                             │ 1:N
                             ▼
                      ┌─────────────┐
                      │ order_items │
                      ├─────────────┤
                      │ id (PK)     │
                      │ order_id(FK)│
                      │ product_id  │
                      │ quantity    │
                      │ unit_price  │
                      └─────────────┘

┌─────────────┐       ┌─────────────┐
│  payments   │       │notifications│
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ order_id(FK)│       │ user_id(FK) │
│ amount      │       │ type        │
│ method      │       │ channel     │
│ status      │       │ status      │
│ provider_id │       │ sent_at     │
└─────────────┘       └─────────────┘
```

---

## 4. Core Tables

### 4.1 users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255),
  name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'customer',
  status VARCHAR(20) DEFAULT 'active',
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 4.2 products

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,  -- in smallest currency unit
  compare_price BIGINT,
  cost BIGINT,
  stock INTEGER DEFAULT 0,
  sku VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft',
  images JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
```

### 4.3 orders

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending',
  subtotal BIGINT NOT NULL,
  shipping_fee BIGINT DEFAULT 0,
  discount BIGINT DEFAULT 0,
  total BIGINT NOT NULL,
  currency VARCHAR(3) DEFAULT 'VND',
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
```

---

## 5. Data Conventions

### 5.1 Column Standards

| Column | Type | Usage |
|--------|------|-------|
| `id` | UUID | Primary key, auto-generated |
| `*_id` | UUID | Foreign key reference |
| `created_at` | TIMESTAMPTZ | Record creation time |
| `updated_at` | TIMESTAMPTZ | Last modification time |
| `status` | VARCHAR(20) | State machine state |
| `metadata` | JSONB | Extensible attributes |

### 5.2 Money Handling

- Store in **smallest currency unit** (đồng for VND, cents for USD)
- Type: `BIGINT` (avoids float precision issues)
- Display: Divide by 100 (USD) or 1 (VND) at presentation

### 5.3 Timestamps

- All timestamps in **UTC** (TIMESTAMPTZ)
- Convert to user timezone at presentation layer
- Format: ISO 8601

---

## 6. Row Level Security (RLS)

### 6.1 Users Policy

```sql
-- Users can only read/update their own data
CREATE POLICY users_self ON users
  FOR ALL USING (auth.uid() = id);

-- Admins can access all users
CREATE POLICY users_admin ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### 6.2 Orders Policy

```sql
-- Users can only see their own orders
CREATE POLICY orders_owner ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can see all orders
CREATE POLICY orders_admin ON orders
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'staff'));
```

---

## 7. Migration Strategy

### 7.1 Naming Convention

```
{timestamp}_{action}_{table}.sql
20241223120000_create_users.sql
20241223120100_add_users_avatar.sql
```

### 7.2 Migration Rules

- **Forward only** - No down migrations in production
- **Atomic** - Each migration is single transaction
- **Reversible design** - Additive changes preferred
- **Tested** - Run on staging before production

---

## 8. Backup & Recovery

| Type | Frequency | Retention |
|------|-----------|-----------|
| Full backup | Daily | 7 days |
| Point-in-time | Continuous | 7 days |
| Snapshot | Weekly | 30 days |

### Recovery Targets

- **RPO** (Recovery Point Objective): < 1 hour
- **RTO** (Recovery Time Objective): < 4 hours

---

**Cross-References:**
- Master Map: `01-architecture/master-map.md`
- API Standards: `02-standards/api-standards.md`
