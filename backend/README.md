# Bank Transaction System - Backend API

A secure, production-ready Node.js/Express backend for a bank transaction system with immutable ledger entries, real-time balance calculation, and transaction tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- EmailJS account (for notifications)

### Installation

```bash
# 1. Clone and navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env

# 4. Update .env with your credentials
# - MONGODB_URI: Your MongoDB connection string
# - EmailJS credentials (Service ID, Template ID, etc.)

# 5. Start development server
npm run dev
```

**Server runs on:** `http://localhost:5000`

---

## 📋 API Routes Overview

### Base URL
```
http://localhost:5000/api
```

### Authentication
All routes (except user creation) require authentication header:
```
x-clerk-id: your_clerk_id_here
```

---

## 👤 USER ROUTES

### 1. Create/Save User (Sync from Clerk)
**Endpoint:** `POST /api/users/save`

**Request:**
```json
{
  "clerkId": "user_2KHAm0Z8w4xRq3nP9vL2kM8j",
  "email": "admin@banksystem.com",
  "firstName": "System",
  "lastName": "Administrator",
  "profileImage": "https://example.com/avatar.jpg"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "User saved successfully",
  "user": {
    "_id": "65e4a8b1c2f3d4e5a6b7c8f9",
    "clerkId": "user_2KHAm0Z8w4xRq3nP9vL2kM8j",
    "email": "admin@banksystem.com",
    "firstName": "System",
    "lastName": "Administrator",
    "profileImage": "https://example.com/avatar.jpg",
    "isSystemUser": false,
    "createdAt": "2026-03-03T14:22:00.000Z",
    "updatedAt": "2026-03-03T14:22:00.000Z"
  }
}
```

---

### 2. Get All Users
**Endpoint:** `GET /api/users/`

**Request:**
```
Headers: x-clerk-id: user_xxxxx
```

**Response (200):**
```json
{
  "status": "success",
  "count": 5,
  "users": [
    {
      "_id": "65e4a8b1c2f3d4e5a6b7c8f9",
      "clerkId": "user_2KHAm0Z8w4xRq3nP9vL2kM8j",
      "email": "admin@banksystem.com",
      "firstName": "System",
      "lastName": "Administrator",
      "profileImage": "https://example.com/avatar.jpg",
      "isSystemUser": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get User by Clerk ID
**Endpoint:** `GET /api/users/:clerkId`

**Request:**
```
GET /api/users/user_2KHAm0Z8w4xRq3nP9vL2kM8j
Headers: x-clerk-id: user_xxxxx
```

**Response (200):**
```json
{
  "status": "success",
  "user": {
    "_id": "65e4a8b1c2f3d4e5a6b7c8f9",
    "clerkId": "user_2KHAm0Z8w4xRq3nP9vL2kM8j",
    "email": "admin@banksystem.com",
    "firstName": "System",
    "lastName": "Administrator",
    "isSystemUser": true
  }
}
```

---

## 💳 ACCOUNT ROUTES

All account routes require authentication: `x-clerk-id` header

### 1. Create Account
**Endpoint:** `POST /api/accounts/create`

**Request:**
```json
{
  "currency": "INR",
  "status": "ACTIVE"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Account created successfully",
  "account": {
    "_id": "65e4a9c2d3f2b1e4c5a6b8f9",
    "user": {
      "_id": "65e4a8b1c2f3d4e5a6b7c8f9",
      "email": "admin@banksystem.com",
      "firstName": "System",
      "lastName": "Administrator"
    },
    "currency": "INR",
    "status": "ACTIVE",
    "createdAt": "2026-03-03T14:22:00.000Z",
    "updatedAt": "2026-03-03T14:22:00.000Z"
  }
}
```

---

### 2. Get All User's Accounts
**Endpoint:** `GET /api/accounts/`

**Request:**
```
Headers: x-clerk-id: user_xxxxx
```

**Response (200):**
```json
{
  "status": "success",
  "count": 3,
  "accounts": [
    {
      "_id": "65e4a9c2d3f2b1e4c5a6b8f9",
      "user": {
        "_id": "65e4a8b1c2f3d4e5a6b7c8f9",
        "email": "admin@banksystem.com",
        "firstName": "System"
      },
      "status": "ACTIVE",
      "currency": "INR",
      "createdAt": "2026-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Get Account by ID
**Endpoint:** `GET /api/accounts/:accountId`

**Request:**
```
GET /api/accounts/65e4a9c2d3f2b1e4c5a6b8f9
Headers: x-clerk-id: user_xxxxx
```

**Response (200):**
```json
{
  "status": "success",
  "account": {
    "_id": "65e4a9c2d3f2b1e4c5a6b8f9",
    "user": {
      "_id": "65e4a8b1c2f3d4e5a6b7c8f9",
      "email": "admin@banksystem.com",
      "firstName": "System"
    },
    "status": "ACTIVE",
    "currency": "INR",
    "createdAt": "2026-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Get Account Balance (Calculated from Ledger)
**Endpoint:** `GET /api/accounts/:accountId/balance`

**Request:**
```
GET /api/accounts/65e4a9c2d3f2b1e4c5a6b8f9/balance
Headers: x-clerk-id: user_xxxxx
```

**Response (200):**
```json
{
  "status": "success",
  "balance": {
    "accountId": "65e4a9c2d3f2b1e4c5a6b8f9",
    "currency": "INR",
    "balance": "5000.00",
    "lastUpdated": "2026-03-03T14:22:00.000Z"
  }
}
```

**Balance Calculation:**
```
Balance = Total Credits (CREDIT ledger entries) - Total Debits (DEBIT ledger entries)
```

---

### 5. Update Account Status
**Endpoint:** `PUT /api/accounts/:accountId/status`

**Request:**
```json
{
  "status": "FROZEN"
}
```

**Valid Status Values:**
- `ACTIVE` - Account is active and can be used
- `FROZEN` - Account is frozen, no transactions allowed
- `CLOSED` - Account is closed

**Response (200):**
```json
{
  "status": "success",
  "message": "Account status updated successfully",
  "account": {
    "_id": "65e4a9c2d3f2b1e4c5a6b8f9",
    "user": { "email": "admin@banksystem.com" },
    "status": "FROZEN",
    "currency": "INR"
  }
}
```

---

### 6. Delete Account (Soft Delete)
**Endpoint:** `DELETE /api/accounts/:accountId`

**Request:**
```
DELETE /api/accounts/65e4a9c2d3f2b1e4c5a6b8f9
Headers: x-clerk-id: user_xxxxx
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Account deleted successfully"
}
```

**Note:** Soft delete - Account status is set to `CLOSED` instead of being removed.

---

## 💸 TRANSACTION ROUTES

All transaction routes require authentication: `x-clerk-id` header

### 1. Create Transaction (Transfer Money)
**Endpoint:** `POST /api/transactions/create`

**Request:**
```json
{
  "fromAccount": "65e4a9c2d3f2b1e4c5a6b8f9",
  "toAccount": "65e4a9c2d3f2b1e4c5a6b8fa",
  "amount": 1000,
  "idempotencyKey": "unique-key-12345"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Transaction created successfully",
  "transaction": {
    "_id": "65e4aaf3d3f2b1e4c5a6b8f9",
    "fromAccount": {
      "_id": "65e4a9c2d3f2b1e4c5a6b8f9",
      "user": { "email": "sender@bank.com", "firstName": "John" },
      "currency": "INR"
    },
    "toAccount": {
      "_id": "65e4a9c2d3f2b1e4c5a6b8fa",
      "user": { "email": "receiver@bank.com", "firstName": "Jane" }
    },
    "amount": 1000,
    "status": "COMPLETED",
    "idempotencyKey": "unique-key-12345",
    "createdAt": "2026-03-03T14:22:00.000Z"
  }
}
```

---

### 2. Get All User's Transactions
**Endpoint:** `GET /api/transactions/`

**Request:**
```
GET /api/transactions/?status=COMPLETED
Headers: x-clerk-id: user_xxxxx
```

**Query Parameters:**
- `status` (optional) - Filter by status: `PENDING`, `COMPLETED`, `FAILED`, `REVERSED`

**Response (200):**
```json
{
  "status": "success",
  "count": 5,
  "transactions": [
    {
      "_id": "65e4aaf3d3f2b1e4c5a6b8f9",
      "fromAccount": { "_id": "65e4a9c2d3f2b1e4c5a6b8f9", "currency": "INR" },
      "toAccount": { "_id": "65e4a9c2d3f2b1e4c5a6b8fa" },
      "amount": 1000,
      "status": "COMPLETED",
      "createdAt": "2026-03-03T14:22:00.000Z"
    }
  ]
}
```

---

### 3. Get Transaction by ID
**Endpoint:** `GET /api/transactions/:transactionId`

**Request:**
```
GET /api/transactions/65e4aaf3d3f2b1e4c5a6b8f9
Headers: x-clerk-id: user_xxxxx
```

**Response (200):**
```json
{
  "status": "success",
  "transaction": {
    "_id": "65e4aaf3d3f2b1e4c5a6b8f9",
    "fromAccount": {
      "_id": "65e4a9c2d3f2b1e4c5a6b8f9",
      "user": { "email": "sender@bank.com" },
      "currency": "INR"
    },
    "toAccount": {
      "_id": "65e4a9c2d3f2b1e4c5a6b8fa"
    },
    "amount": 1000,
    "status": "COMPLETED",
    "idempotencyKey": "unique-key-12345",
    "createdAt": "2026-03-03T14:22:00.000Z"
  }
}
```

---

### 4. Update Transaction Status
**Endpoint:** `PUT /api/transactions/:transactionId/status`

**Request:**
```json
{
  "status": "FAILED"
}
```

**Valid Status Values:**
- `PENDING` - Transaction is pending processing
- `COMPLETED` - Transaction completed successfully
- `FAILED` - Transaction failed
- `REVERSED` - Transaction was reversed/refunded

**Response (200):**
```json
{
  "status": "success",
  "message": "Transaction status updated successfully",
  "transaction": {
    "_id": "65e4aaf3d3f2b1e4c5a6b8f9",
    "fromAccount": { "email": "sender@bank.com" },
    "toAccount": { "_id": "65e4a9c2d3f2b1e4c5a6b8fa" },
    "amount": 1000,
    "status": "FAILED",
    "createdAt": "2026-03-03T14:22:00.000Z"
  }
}
```

---

## 📊 Transaction Flow - 10 Steps

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSACTION CREATION PROCESS                 │
└─────────────────────────────────────────────────────────────────┘
```

### Step 1: Validate Request
- Verify `fromAccount`, `toAccount`, and `amount` are provided
- Check amount is greater than 0
- Ensure `fromAccount` ≠ `toAccount`
- Validate `idempotencyKey` is non-empty string

**Status:** `400 Bad Request` if validation fails

---

### Step 2: Idempotency Check
- Check if transaction with same `idempotencyKey` exists
- **If exists:** Return existing transaction (prevents duplicate processing)
- **If not exists:** Continue to Step 3

**Purpose:** Prevent duplicate transactions from being created

---

### Step 3: Verify Accounts
- Check if `fromAccount` exists and belongs to authenticated user
- Verify `fromAccount` status is `ACTIVE` (not FROZEN/CLOSED)
- Check if `toAccount` exists and is ACTIVE
- Return `403 Forbidden` if account doesn't belong to user
- Return `400 Bad Request` if account is not ACTIVE

---

### Step 4: Derive Sender Balance
- Query all ledger entries for `fromAccount`
- **Calculate:** Balance = Total Credits - Total Debits
- **Aggregation Pipeline:**
  ```javascript
  $group: {
    totalDebits: Sum of DEBIT entries,
    totalCredits: Sum of CREDIT entries
  }
  $project: {
    balance: totalCredits - totalDebits
  }
  ```
- Check if sender has sufficient balance
- Return `400 Bad Request` if insufficient balance

---

### Step 5: Create Transaction (PENDING)
- Insert new transaction with status `PENDING`
- Assign unique `_id` to transaction
- Store: `fromAccount`, `toAccount`, `amount`, `idempotencyKey`
- Initialize MongoDB session for atomic operations

**Database:**
```json
{
  "fromAccount": ObjectId,
  "toAccount": ObjectId,
  "amount": 1000,
  "status": "PENDING",
  "idempotencyKey": "unique-key-12345",
  "createdAt": timestamp
}
```

---

### Step 6: Create DEBIT Ledger Entry
- Create ledger entry for sender's account
- **Entry Details:**
  - `account`: fromAccount ID
  - `transaction`: Created transaction ID
  - `direction`: "DEBIT"
  - `amount`: Transaction amount
  - `currency`: Sender's currency
  - `note`: "Transfer sent"

**Purpose:** Record money leaving sender's account

**Immutable:** Cannot be modified or deleted (ledger plugin enforces this)

---

### Step 7: Create CREDIT Ledger Entry
- Create ledger entry for receiver's account
- **Entry Details:**
  - `account`: toAccount ID
  - `transaction`: Created transaction ID
  - `direction`: "CREDIT"
  - `amount`: Transaction amount
  - `currency`: Receiver's currency
  - `note`: "Transfer received"

**Purpose:** Record money entering receiver's account

---

### Step 8: Mark Transaction COMPLETED
- Update transaction status from `PENDING` to `COMPLETED`
- Save transaction within MongoDB session
- All ledger entries are now final and immutable

**Database Update:**
```json
{
  "status": "COMPLETED",
  "updatedAt": timestamp
}
```

---

### Step 9: Commit MongoDB Session
- MongoDB atomically commits all changes:
  - Transaction created
  - DEBIT ledger entry created
  - CREDIT ledger entry created
  - Transaction marked COMPLETED
- **If any step fails:** Entire transaction is rolled back
- **If all succeed:** Changes are persisted

---

### Step 10: Send Email Notification
- Notify sender that transaction completed
- Template params:
  ```json
  {
    "to_email": "sender@bank.com",
    "transactionId": "65e4aaf3d3f2b1e4c5a6b8f9",
    "amount": 1000,
    "currency": "INR",
    "status": "COMPLETED"
  }
  ```
- Return success response with transaction details to client

---

## 📚 Ledger System

### What is Ledger?
A **double-entry bookkeeping ledger** that records all account transactions immutably.

### Ledger Entries

Each transaction creates **2 ledger entries**:

| Field | Value | Description |
|-------|-------|-------------|
| `account` | ObjectId | Account being affected |
| `transaction` | ObjectId | Transaction that created entry |
| `direction` | "DEBIT" or "CREDIT" | DEBIT = money out, CREDIT = money in |
| `amount` | Number | Amount transferred |
| `currency` | String | Account currency (INR, USD, etc.) |
| `note` | String | Description (e.g., "Transfer sent") |
| `createdAt` | Timestamp | When entry was created |

### Example Ledger for 1000 INR Transfer

**Sender's Account Ledger:**
| ID | Amount | Direction | Note | Status |
|----|--------|-----------|------|--------|
| 1 | 5000 | CREDIT | Initial credit | Immutable |
| 2 | 1000 | DEBIT | Transfer sent | Immutable |
| **Balance:** | | | **4000** | |

**Receiver's Account Ledger:**
| ID | Amount | Direction | Note | Status |
|----|--------|-----------|------|--------|
| 3 | 1000 | CREDIT | Transfer received | Immutable |
| **Balance:** | | | **1000** | |

### Balance Calculation Query

```javascript
const balance = await ledgerModel.aggregate([
  { $match: { account: accountId } },
  {
    $group: {
      totalDebits: { $sum: { $cond: [{ $eq: ["$direction", "DEBIT"] }, "$amount", 0] } },
      totalCredits: { $sum: { $cond: [{ $eq: ["$direction", "CREDIT"] }, "$amount", 0] } }
    }
  },
  {
    $project: {
      balance: { $subtract: ["$totalCredits", "$totalDebits"] }
    }
  }
]);

// Result: { balance: 4000 }
```

### Immutability
Once a ledger entry is created:
- ❌ Cannot be updated
- ❌ Cannot be deleted
- ✅ Can only create reversal entries for corrections
- ✅ Controlled by `LEDGER_IMMUTABLE` env variable

---

## 🔒 Security Features

### 1. Idempotency
- Duplicate transactions prevented via `idempotencyKey`
- Clients must include unique key for each transaction
- If retried, same response returned

### 2. Authorization
- User can only access own accounts
- User can only create transactions from own accounts
- Account ownership verified via user ID

### 3. Account Status Validation
- Transactions only allowed on ACTIVE accounts
- FROZEN accounts cannot be used
- CLOSED accounts cannot be used

### 4. Atomic Transactions
- All operations happen together or not at all
- MongoDB sessions ensure consistency
- Prevents partial/corrupted transactions

### 5. Immutable Ledger
- Ledger entries cannot be modified
- Ensures audit trail integrity
- Financial records never altered

---

## 📦 Data Models

### User Model
```javascript
{
  clerkId: String (unique),
  email: String (unique),
  firstName: String,
  lastName: String,
  profileImage: String,
  isSystemUser: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Account Model
```javascript
{
  user: ObjectId (ref: User),
  currency: String ("INR", "USD", etc.),
  status: String ("ACTIVE", "FROZEN", "CLOSED"),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  fromAccount: ObjectId (ref: Account),
  toAccount: ObjectId (ref: Account),
  amount: Number,
  status: String ("PENDING", "COMPLETED", "FAILED", "REVERSED"),
  idempotencyKey: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Ledger Model
```javascript
{
  account: ObjectId (ref: Account),
  transaction: ObjectId (ref: Transaction),
  direction: String ("DEBIT", "CREDIT"),
  amount: Number,
  currency: String,
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing the API

### Example: Create User → Create Account → Transfer Money

```bash
# Step 1: Create System Administrator User
curl -X POST http://localhost:5000/api/users/save \
  -H "Content-Type: application/json" \
  -d '{
    "clerkId": "user_admin123",
    "email": "admin@bank.com",
    "firstName": "System",
    "lastName": "Admin",
    "profileImage": "https://example.com/admin.jpg"
  }'

# Step 2: Create User 2
curl -X POST http://localhost:5000/api/users/save \
  -H "Content-Type: application/json" \
  -d '{
    "clerkId": "user_john123",
    "email": "john@bank.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://example.com/john.jpg"
  }'

# Step 3: Create Account for Admin (copy the user _id from response)
curl -X POST http://localhost:5000/api/accounts/create \
  -H "Content-Type: application/json" \
  -H "x-clerk-id: user_admin123" \
  -d '{
    "currency": "INR",
    "status": "ACTIVE"
  }'

# Step 4: Create Account for John
curl -X POST http://localhost:5000/api/accounts/create \
  -H "Content-Type: application/json" \
  -H "x-clerk-id: user_john123" \
  -d '{
    "currency": "INR",
    "status": "ACTIVE"
  }'

# Step 5: Transfer Money (copy account _ids from responses)
curl -X POST http://localhost:5000/api/transactions/create \
  -H "Content-Type: application/json" \
  -H "x-clerk-id: user_admin123" \
  -d '{
    "fromAccount": "ADMIN_ACCOUNT_ID",
    "toAccount": "JOHN_ACCOUNT_ID",
    "amount": 5000,
    "idempotencyKey": "txn-001"
  }'

# Step 6: Get Balance
curl -X GET http://localhost:5000/api/accounts/ADMIN_ACCOUNT_ID/balance \
  -H "x-clerk-id: user_admin123"

# Step 7: Get Transactions
curl -X GET http://localhost:5000/api/transactions/ \
  -H "x-clerk-id: user_admin123"
```

---

## 🐛 Error Handling

### Common Error Responses

**400 Bad Request - Validation Error:**
```json
{
  "status": "failed",
  "message": "Amount must be greater than 0"
}
```

**401 Unauthorized - Missing Auth:**
```json
{
  "status": "failed",
  "message": "Authentication required. Please provide clerk ID"
}
```

**403 Forbidden - Unauthorized Access:**
```json
{
  "status": "failed",
  "message": "Unauthorized to create transaction from this account"
}
```

**404 Not Found:**
```json
{
  "status": "failed",
  "message": "Account not found"
}
```

**409 Conflict - Duplicate Key:**
```json
{
  "status": "failed",
  "message": "Duplicate idempotency key"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

---

## 📧 Email Notifications

### Configured Emails

1. **Registration Email** - Sent when new user signs up
2. **Transaction Success Email** - Sent when transaction completes
3. **Transaction Failed Email** - Sent when transaction fails

### Setup EmailJS

1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Create email service
3. Create email template with variables:
   - `to_email`, `to_name`, `from_name`, `subject`
   - `transactionId`, `amount`, `currency`, `status`, `reason`
4. Add credentials to `.env` file

---

## 🚀 Deployment Checklist

- [ ] Set `LEDGER_IMMUTABLE=true` in production
- [ ] Use MongoDB Atlas instead of local
- [ ] Add proper CORS origins for frontend
- [ ] Configure EmailJS with production domain
- [ ] Enable HTTPS only
- [ ] Set strong JWT secrets
- [ ] Add rate limiting middleware
- [ ] Enable request logging
- [ ] Setup error monitoring (Sentry, etc.)
- [ ] Create database backups
- [ ] Add API key authentication
- [ ] Test all transaction flows

---

## 📞 Support

For issues, check:
1. MongoDB connection in `.env`
2. EmailJS credentials
3. Frontend CORS origins in `server.js`
4. User authentication header `x-clerk-id`

---

**Version:** 1.0.0  
**Last Updated:** March 3, 2026  
**Status:** Production Ready ✅
