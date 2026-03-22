# Bank Transaction System

A secure, full-stack banking application with user authentication, account management, and transaction processing with immutable ledger tracking.

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB database with Mongoose ODM
- Clerk authentication integration
- EmailJS for email notifications
- CORS enabled for cross-origin requests

### Frontend
- React 19 with Vite
- TypeScript/JavaScript with React Router
- Tailwind CSS for styling
- Radix UI component library
- Clerk React SDK for authentication
- Sonner for toast notifications
- Lucide React for icons

## Features Implemented

### Authentication
- Clerk-based user authentication and account management
- Secure API routes with custom middleware authentication using x-clerk-id header
- User profile synchronization from Clerk to database

### User Management
- User registration and profile creation
- User data synchronization from Clerk
- Profile information retrieval
- Email notifications on account registration

### Account Management
- Create new bank accounts with currency support
- View all user accounts
- Account status management (ACTIVE, FROZEN, CLOSED)
- Real-time balance calculation from ledger entries
- Account details and metadata

### Transactions
- Money transfer between accounts
- Idempotency key support for safe transaction retry
- Transaction status tracking (PENDING, COMPLETED, FAILED, REVERSED)
- Email notifications for successful and failed transactions
- Transaction history with timestamps
- Secure authorization checks for account ownership

### Ledger System
- Immutable ledger entries for audit trail
- Double-entry bookkeeping (DEBIT/CREDIT)
- Real-time balance calculations from ledger
- Complete transaction history per account
- Ledger entries cannot be updated or deleted, only new entries can be created

### Dashboard
- Overview of total balance across all accounts
- Count of active accounts
- Recent transactions display
- Quick access to key features

### User Interface Pages
- **Home**: Landing page with feature overview and call-to-action
- **Dashboard**: Main user hub with account summaries and recent activity
- **Accounts**: Manage accounts, view balances, create new accounts
- **Transfer**: Execute money transfers between accounts with confirmation
- **History**: View complete transaction ledger with filtering and pagination
- **Profile**: User information display and account settings

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── user.controller.js    # User management logic
│   │   ├── account.controller.js # Account operations
│   │   └── transaction.controller.js # Transaction processing
│   ├── middleware/
│   │   └── auth.middleware.js    # Request authentication
│   ├── models/
│   │   ├── user.model.js         # User schema
│   │   ├── account.model.js      # Account schema
│   │   ├── transaction.model.js  # Transaction schema
│   │   └── ledger.model.js       # Immutable ledger schema
│   ├── plugins/
│   │   └── immutable-ledger.plugin.js # Ledger immutability enforcement
│   ├── routes/
│   │   ├── user.routes.js        # User endpoints
│   │   ├── account.routes.js     # Account endpoints
│   │   └── transaction.routes.js # Transaction endpoints
│   └── services/
│       └── email.service.js      # Email notification service
├── server.js                      # Express app initialization
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx            # Main layout wrapper
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── Footer.jsx            # Footer
│   │   └── ui/                   # Radix UI components
│   ├── pages/
│   │   ├── Home.jsx              # Landing page
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── Accounts.jsx          # Account management
│   │   ├── Transfer.jsx          # Money transfer
│   │   ├── History.jsx           # Transaction history
│   │   ├── Profile.jsx           # User profile
│   │   ├── Admin.jsx             # Admin interface
│   │   └── AdminPanel.jsx        # Admin panel
│   ├── services/
│   │   └── apiService.js         # Backend API client
│   ├── hooks/
│   │   └── useSyncUserToDatabase.js # User sync hook
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # React entry point
└── package.json
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- EmailJS account (for email notifications)
- Clerk account (for authentication)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173

# EmailJS Configuration
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID_REGISTRATION=your_template_id
EMAILJS_TEMPLATE_ID_TRANSACTION=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key

# Ledger immutability setting
LEDGER_IMMUTABLE=true
```

5. Start development server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
All authenticated endpoints require:
```
x-clerk-id: your_clerk_id
```

### User Endpoints

**POST /users/save**
Create or update user (sync from Clerk)
- Request: `{clerkId, email, firstName, lastName, profileImage}`
- Response: User object with metadata

**GET /users/**
Get all users (requires authentication)
- Response: Array of user objects

**GET /users/:clerkId**
Get user by Clerk ID (requires authentication)
- Response: Single user object

### Account Endpoints

**POST /accounts/create**
Create new account (requires authentication)
- Request: `{currency: "INR", status: "ACTIVE"}`
- Response: Account object

**GET /accounts/**
Get all user accounts (requires authentication)
- Response: Array of account objects for authenticated user

**GET /accounts/:accountId**
Get specific account (requires authentication)
- Response: Single account object

**GET /accounts/:accountId/balance**
Get account balance (requires authentication)
- Response: `{balance: number}`

**GET /accounts/:accountId/ledger**
Get account ledger entries (requires authentication)
- Response: Array of ledger entries

**GET /accounts/ledger/all**
Get all ledger entries for user (requires authentication)
- Response: Array of all ledger entries across accounts

**PUT /accounts/:accountId/status**
Update account status (requires authentication)
- Request: `{status: "ACTIVE|FROZEN|CLOSED"}`
- Response: Updated account object

**DELETE /accounts/:accountId**
Soft delete account (requires authentication)
- Response: Confirmation message

### Transaction Endpoints

**POST /transactions/create**
Create transaction (requires authentication)
- Request: `{fromAccount, toAccount, amount, idempotencyKey}`
- Response: Transaction object with status

**GET /transactions/**
Get all user transactions (requires authentication)
- Response: Array of transaction objects

**GET /transactions/:transactionId**
Get transaction by ID (requires authentication)
- Response: Single transaction object

**PUT /transactions/:transactionId/status**
Update transaction status (requires authentication)
- Request: `{status: "COMPLETED|FAILED|REVERSED"}`
- Response: Updated transaction object

## Key Features

### Immutable Ledger
- All ledger entries are immutable by default
- Cannot be updated or deleted after creation
- Reversals create new ledger entries instead
- Enforced via plugin middleware on Mongoose schema

### Idempotency
- Transaction creation supports idempotency keys
- Prevents duplicate transactions on retry
- Unique index on idempotencyKey field

### Double-Entry Bookkeeping
- All transactions create DEBIT entry on source account
- All transactions create CREDIT entry on destination account
- Ledger entries track currency, amount, timestamp, and relationship

### Email Notifications
- Registration confirmation emails sent via EmailJS
- Transaction success notifications
- Failed transaction notifications
- Graceful failure if email service unavailable

### Account Status Management
- ACTIVE: Account can send and receive transactions
- FROZEN: Account restricted from operations
- CLOSED: Account marked for closure
- Status validation on transaction operations

## Deployment

### Backend Deployment (Vercel)
The backend is configured with Vercel serverless functions:
- `api/index.js` serves as the entry point
- `server.js` exports the Express app
- CORS configured for deployed frontend URL

### Frontend Deployment (Vercel)
The frontend is configured with Vite and Vercel:
- Environment variables configured in Vercel dashboard
- Build optimization with Vite
- Static file serving with Vercel CDN

## Database Models

### User
- clerkId (unique, required)
- email (unique, required)
- firstName (optional)
- lastName (optional)
- profileImage (optional)
- isSystemUser (immutable flag)
- timestamps (createdAt, updatedAt)

### Account
- user (reference to User)
- status (ACTIVE, FROZEN, CLOSED)
- currency (default: INR)
- timestamps (createdAt, updatedAt)

### Transaction
- fromAccount (reference to Account)
- toAccount (reference to Account)
- amount (required, min 0)
- status (PENDING, COMPLETED, FAILED, REVERSED)
- idempotencyKey (unique, required)
- timestamps (createdAt, updatedAt)

### Ledger
- account (reference to Account)
- transaction (reference to Transaction)
- direction (DEBIT or CREDIT)
- amount (required, min 0)
- currency (required)
- note (optional)
- timestamps (createdAt, updatedAt)
- IMMUTABLE (cannot be updated after creation)

## Development

### Running Tests
```bash
cd backend
npm test
```

### Code Style
- ESLint configured for JavaScript
- Use consistent formatting across codebase
- Follow established patterns in controller and service files

### Building for Production

Backend:
```bash
npm run build
```

Frontend:
```bash
npm run build
```

## Contributing

1. Create feature branches from main
2. Follow existing code patterns and structure
3. Ensure all endpoints are properly authenticated
4. Add email notifications for user-facing operations
5. Maintain immutability of ledger entries

## License

ISC
