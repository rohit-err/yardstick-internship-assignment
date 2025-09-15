# Multi-Tenant SaaS Notes Application

A full-stack notes application supporting multiple tenants with role-based access control and subscription limits.

---

## 🏗️ Architecture

**Multi-tenancy Approach**: Shared schema with tenant ID columns  
- Each note and user belongs to a specific tenant  
- Strict data isolation enforced at API level  
- Single database with tenant-scoped queries  

---

## ✨ Features

- 🔑 JWT authentication with role-based access (Admin / Member)  
- 📌 Free plan: **3 notes limit**, Pro plan: **unlimited notes**  
- 📝 CRUD operations for notes with tenant isolation  
- 👨‍💼 Admin-only tenant upgrades and user invitations  

---

## 👤 Test Accounts

All accounts use password: `password`

- `admin@acme.test` → **Admin**, Acme Corp  
- `user@acme.test` → **Member**, Acme Corp  
- `admin@globex.test` → **Admin**, Globex Inc  
- `user@globex.test` → **Member**, Globex Inc  

---

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/auth/login` → User login  
- `GET /api/auth/checkAuth` → Verify authentication  
- `POST /api/auth/logout` → User logout  

### 📝 Notes
- `POST /api/notes` → Create note  
- `GET /api/notes` → List tenant notes  
- `GET /api/notes/:id` → Get single note  
- `PUT /api/notes/:id` → Update note  
- `DELETE /api/notes/:id` → Delete note  

### 🏢 Tenants
- `POST /api/tenants/:slug/upgrade` → Upgrade to Pro (**Admin only**)  
- `POST /api/tenants/:slug/invite` → Invite user (**Admin only**)  

### ❤️ Health
- `GET /health` → Health check  

---

## ⚙️ Setup

### Backend
```bash
npm install

# Set environment variables
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
NODE_ENV=production

# Seed database
node seed.js

# Start server
npm start
```

### Frontend
```bash
npm install
npm run dev
```

---

## 🔑 Environment Variables

```env
MONGO_URI=mongodb://...
JWT_SECRET=your-secret-key
PORT=5001
NODE_ENV=production
```

---

## 🚀 Deployment

- Both **frontend** and **backend** deployed on **Vercel**  
- CORS enabled for cross-origin access  
