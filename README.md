# SmartBiz ERP Backend

RESTful API backend for SmartBiz ERP mobile application.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt Password Hashing

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartbiz_erp
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

Base URL: `http://localhost:5000/api`

- **Auth**: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- **Employees**: `/api/employees` (CRUD)
- **Attendance**: `/api/attendance/checkin`, `/api/attendance/checkout`
- **Tasks**: `/api/tasks` (CRUD)
- **Inventory**: `/api/inventory/products`, `/api/inventory/categories`
- **Orders**: `/api/orders` (CRUD)
- **Dashboard**: `/api/dashboard` (Admin/Manager only)

## Test Credentials

After seeding:
- **Admin**: admin@smartbiz.com / admin123
- **Manager**: manager@smartbiz.com / manager123
- **Employee**: alice@smartbiz.com / employee123

## Authentication

Include JWT token in requests:
```
Authorization: Bearer <token>
```

## Deployment

See `DEPLOY_RENDER.md` for Render deployment guide.

## Project Structure

```
src/
├── config/       # Database configuration
├── controllers/  # Route controllers
├── middleware/    # Auth & error handling
├── models/        # MongoDB models
├── routes/        # API routes
├── scripts/       # Seed script
├── utils/         # JWT utilities
└── server.js      # Entry point
```

## License

ISC
