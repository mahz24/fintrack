# 💰 FinTrack API

A powerful REST API for personal finance management built with Node.js, TypeScript, and PostgreSQL.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **Authentication** - JWT-based auth with access & refresh tokens
- **Accounts Management** - Track multiple bank accounts (savings, checking, credit, cash)
- **Categories** - Global and custom categories for transactions
- **Transactions** - Full CRUD with filtering by date, type, category
- **CSV Import** - Bulk import transactions using Node.js Streams
- **Reports & Analytics**
  - Financial summary (balance, income, expenses, savings)
  - Expenses by category with percentages
  - Monthly trends (last 12 months)
- **API Documentation** - Interactive Swagger UI

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **TypeScript** | Type safety |
| **Express** | Web framework |
| **PostgreSQL** | Database |
| **Prisma** | ORM |
| **JWT** | Authentication |
| **Zod** | Validation |
| **Swagger** | API Documentation |
| **Vitest** | Testing |
| **Docker** | Containerization |

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fintrack.git
cd fintrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fintrack?schema=public"
JWT_SECRET="your-super-secret-key-min-32-characters"
JWT_EXPIRES_IN="15m"
PORT=3000
NODE_ENV=development
```

### 4. Start the database

```bash
docker compose up -d
```

### 5. Run migrations and seed

```bash
npx prisma migrate dev
npx prisma db seed
```

### 6. Start the server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Interactive documentation available at: `http://localhost:3000/api-docs`

### Endpoints Overview

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |

#### Accounts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts` | Get all accounts |
| GET | `/api/accounts/:id` | Get account by ID |
| POST | `/api/accounts` | Create account |
| PUT | `/api/accounts/:id` | Update account |
| DELETE | `/api/accounts/:id` | Delete account |

#### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get category by ID |
| POST | `/api/categories` | Create custom category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

#### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all (with filters) |
| GET | `/api/transactions/:id` | Get transaction by ID |
| POST | `/api/transactions` | Create transaction |
| POST | `/api/transactions/import` | Import from CSV |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

#### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/summary` | Financial summary |
| GET | `/api/reports/by-category` | Expenses by category |
| GET | `/api/reports/monthly-trend` | Monthly trends |

## 🧪 Running Tests

```bash
npm test
```

## 📁 Project Structure

```
fintrack/
├── src/
│   ├── config/           # Configuration files
│   ├── modules/          # Feature modules
│   │   ├── auth/
│   │   ├── accounts/
│   │   ├── categories/
│   │   ├── transactions/
│   │   └── reports/
│   ├── shared/           # Shared utilities
│   │   ├── errors/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── types/
│   ├── lib/              # Database client
│   ├── app.ts            # Express app
│   └── server.ts         # Entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── uploads/              # CSV uploads (temporary)
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## 📊 Database Schema

```
User
├── id (uuid)
├── email (unique)
├── password (hashed)
├── name
└── accounts[]

Account
├── id (uuid)
├── name
├── type (CHECKING | SAVINGS | CREDIT | CASH)
├── balance
├── currency
├── userId (FK)
└── transactions[]

Category
├── id (uuid)
├── name
├── type (INCOME | EXPENSE)
├── icon (optional)
├── color (optional)
├── userId (nullable - null for global)
└── transactions[]

Transaction
├── id (uuid)
├── amount
├── type (INCOME | EXPENSE | TRANSFER)
├── description
├── date
├── accountId (FK)
└── categoryId (FK)
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register or login to get `accessToken` and `refreshToken`
2. Include the access token in requests:
   ```
   Authorization: Bearer <accessToken>
   ```
3. When access token expires, use refresh token to get a new one

## 📥 CSV Import Format

```csv
date,amount,type,description,categoryId
2026-01-15,50000,EXPENSE,Groceries,uuid-category
2026-01-16,3000000,INCOME,Salary,uuid-category
```

## 🐳 Docker

### Development

```bash
docker compose up -d
```

### Production (coming soon)

```bash
docker compose -f docker-compose.prod.yml up -d
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Marco** - Full Stack Developer

- GitHub: [@mahz24](https://github.com/mahz24)

---

⭐ If you found this project useful, please consider giving it a star!