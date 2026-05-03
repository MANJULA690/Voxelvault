# VoxelVault — Setup & Deployment Guide

## Project Overview
VoxelVault is a MERN stack 3D model showcase platform with:
- JWT Authentication (signup / login)
- MongoDB Atlas database
- Model upload, gallery, likes, bookmarks
- User profiles
- Deployed: Netlify (frontend) + Render (backend)

---

## LOCAL SETUP

### 1. Clone / open the project
```
3d-showcase/
├── client/   ← React frontend
└── server/   ← Node.js backend
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env (see below)
npm run dev
```

**server/.env:**
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/3dshowcase
JWT_SECRET=any_long_random_string_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Frontend setup
```bash
cd client
npm install
cp .env.example .env
# .env already set to localhost:5000
npm start
```

---

## MONGODB ATLAS SETUP

1. Go to https://cloud.mongodb.com → Create free account
2. Create a new **Cluster** (free M0 tier)
3. Under **Database Access** → Add a user with read/write permissions
4. Under **Network Access** → Add IP: `0.0.0.0/0` (allow all, for deployment)
5. Click **Connect** → Drivers → copy the connection string
6. Replace `<password>` with your DB user password in MONGO_URI

---

## DEPLOYMENT

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
# Create a new repo on github.com then:
git remote add origin https://github.com/yourusername/voxelvault.git
git push -u origin main
```

### Step 2 — Deploy Backend on Render (free)
1. Go to https://render.com → Sign up / login
2. New → **Web Service** → Connect your GitHub repo
3. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Under **Environment Variables**, add:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = your secret key
   - `CLIENT_URL` = https://your-netlify-url.netlify.app
5. Click **Deploy** → Copy the live URL (e.g. `https://voxelvault-api.onrender.com`)

### Step 3 — Deploy Frontend on Netlify (free)
1. Go to https://netlify.com → Sign up / login
2. New site → **Import from Git** → Connect GitHub repo
3. Set:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`
4. Under **Environment Variables**, add:
   - `REACT_APP_API_URL` = https://voxelvault-api.onrender.com/api
5. Click **Deploy site**

---

## API ENDPOINTS REFERENCE

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | ❌ | Register new user |
| POST | /api/auth/login | ❌ | Login, get JWT |
| GET | /api/auth/me | ✅ | Get current user |

### Models
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/models | ❌ | List all (filter/search) |
| GET | /api/models/featured | ❌ | Featured models |
| GET | /api/models/:id | ❌ | Single model |
| POST | /api/models | ✅ | Upload new model |
| PUT | /api/models/:id/like | ✅ | Toggle like |
| DELETE | /api/models/:id | ✅ | Delete own model |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/users/:id/profile | ❌ | Public profile + uploads |
| PUT | /api/users/profile | ✅ | Update own profile |
| PUT | /api/users/bookmark/:modelId | ✅ | Toggle bookmark |
| GET | /api/users/bookmarks/me | ✅ | My bookmarks |

---

## FEATURES CHECKLIST
- ✅ Real user authentication (JWT, bcrypt hashed passwords)
- ✅ Signup & Login pages with form validation
- ✅ Protected routes (upload, bookmarks)
- ✅ MongoDB Atlas database integration
- ✅ Model upload with thumbnail, tags, category
- ✅ Gallery with search, category filter, sort
- ✅ Like / bookmark toggle
- ✅ User profiles with edit
- ✅ Responsive design
- ✅ Netlify deployment config (_redirects)
- ✅ Render deployment config (render.yaml)

---

## TECH STACK
- **Frontend:** React 18, React Router v6, Axios, react-hot-toast, lucide-react
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas
- **Auth:** JWT + bcryptjs
- **Deploy:** Netlify (FE) + Render (BE)
