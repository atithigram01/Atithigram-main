# 🌿 ATITHIGRAM — Jharkhand Tourism Super App

> A scalable, AI-powered sustainable tourism platform built for Jharkhand — promoting eco-tourism, tribal culture, verified homestays, and authentic handicrafts.

---

## 🗂️ Project Structure

```
ATITHIGRAM/
├── frontend/               # React (Vite) + TailwindCSS
│   ├── src/
│   │   ├── components/     # Navbar, Footer
│   │   ├── context/        # AuthContext (JWT state)
│   │   ├── pages/          # All 11 pages
│   │   ├── services/       # Axios API client
│   │   └── App.jsx         # Router + AuthProvider
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                # Node.js + Express
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # Business logic (auth, places, homestays, products, bookings)
│   │   ├── middleware/     # JWT auth & role-based access
│   │   ├── models/         # Mongoose schemas (User, Place, Homestay, Product, Booking)
│   │   ├── routes/         # Express route definitions
│   │   └── server.js       # Express entry point
│   └── .env
│
├── package.json            # Root convenience scripts
└── README.md
```

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js >= 16
- npm >= 8
- MongoDB running locally (or Atlas URI)

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/atithigram
JWT_SECRET=atithigram_secret_key_2024
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Frontend runs at: http://localhost:5173  
Backend API runs at: http://localhost:5000

---

## 📄 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Tourist Places
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/places` | Public | Get all places (filter: `?category=Eco`) |
| GET | `/api/places/:id` | Public | Get single place |
| POST | `/api/places` | Admin | Create a place |
| PUT | `/api/places/:id` | Admin | Update a place |
| DELETE | `/api/places/:id` | Admin | Delete a place |

### Homestays
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/homestays` | Public | List all verified homestays |
| GET | `/api/homestays/:id` | Public | Get single homestay |
| POST | `/api/homestays` | Host/Admin | Create homestay listing |
| PUT | `/api/homestays/:id/verify` | Admin | Verify a homestay |

### Products (Handicrafts)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | List all verified products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Seller/Admin | Create a product listing |
| PUT | `/api/products/:id/verify` | Admin | Verify a product |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | User | Create a booking |
| GET | `/api/bookings/my` | User | Get my bookings |
| PUT | `/api/bookings/:id` | Admin | Update booking status |

---

## 🎯 Core Features

| Feature | Status |
|---------|--------|
| Home Page with Hero & Animations | ✅ |
| Tourist Places (Eco/Cultural/Heritage) | ✅ |
| Interactive SVG Map (Geotagged Places) | ✅ |
| Verified Homestays + Booking Logic | ✅ |
| Handicrafts Marketplace + Cart | ✅ |
| AI Travel Assistant (Mock Intelligence) | ✅ |
| Eco-Points Rewards System | ✅ |
| Emergency Help & Safety Tips | ✅ |
| Login / Signup (JWT) | ✅ |
| Admin Dashboard | ✅ |
| Role-Based Access (Admin/Host/Seller/User) | ✅ |
| 25% Homestay Commission Logic | ✅ |
| 20% Product Platform Fee Logic | ✅ |

---

## 💰 Revenue Model

- **Homestay Owners**: 25% commission on each booking
- **Handicraft Sellers**: 20% platform fee on each sale
- **AdSense**: Placeholder integrated (markings in Footer)
- **Eco-Points**: Gamified engagement to retain users

---

## 🌐 Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel or Netlify
```

### Backend (Render / Railway)
```bash
# Point your service to backend/src/server.js
# Set environment variables in the platform dashboard
```

---

## 🏆 Built For
- College Competition Projects
- Smart India Hackathon (SIH) Style Evaluation
- Sustainable Rural Tourism Initiatives

---

*Made with 💚 for Jharkhand Tourism | ATITHIGRAM © 2024*
