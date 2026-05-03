# VoxelVault — 3D Model Showcase Platform

A full-stack MERN application built for DekNek3D internship Round 2.

---

## ⚡ QUICK SETUP (5 Steps)

### Step 1 — Install Prerequisites
Make sure you have installed:
- Node.js v18+ → https://nodejs.org
- Git → https://git-scm.com

---

### Step 2 — Setup MongoDB Atlas (Free)
1. Go to https://cloud.mongodb.com → Sign up free
2. Create a **free M0 cluster**
3. Under **Database Access** → Add user with read/write permissions
4. Under **Network Access** → Add IP: `0.0.0.0/0`
5. Click **Connect** → Drivers → Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

---

### Step 3 — Setup Backend (Server)
```bash
cd server
npm install
cp .env.example .env
```

Now open `.env` and fill in:
```
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/3dshowcase
JWT_SECRET=anylongrandomstring123456
PORT=5000
CLIENT_URL=http://localhost:3000
```

Start the server:
```bash
npm run dev
```
✅ You should see: `MongoDB connected` and `Server running on port 5000`

---

### Step 4 — Setup Frontend (Client)
Open a new terminal:
```bash
cd client
npm install
cp .env.example .env
```

The `.env` file already points to localhost:5000 — no changes needed for local dev.

Start the frontend:
```bash
npm start
```
✅ Browser opens at http://localhost:3000

---

### Step 5 — Test It
1. Open http://localhost:3000
2. Click **Sign Up** → Create an account
3. Browse the Gallery, Upload a model, test bookmarks

---

## 🚀 DEPLOYMENT

### Deploy Backend → Render (Free)
1. Push this project to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = your secret key
   - `CLIENT_URL` = https://your-app.netlify.app (add after Netlify deploy)
6. Deploy → Copy the URL (e.g. `https://voxelvault-api.onrender.com`)

### Deploy Frontend → Netlify (Free)
1. Go to https://netlify.com → New site from Git
2. Connect your GitHub repo
3. Settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://voxelvault-api.onrender.com/api`
5. Deploy!

---

## 📁 Project Structure
```
voxelvault/
├── server/                 ← Node.js + Express backend
│   ├── index.js            ← Entry point
│   ├── models/
│   │   ├── User.js         ← User schema
│   │   └── Model3D.js      ← 3D Model schema
│   ├── routes/
│   │   ├── auth.js         ← Login / Signup / Me
│   │   ├── models.js       ← CRUD + Like
│   │   └── users.js        ← Profile + Bookmarks
│   └── middleware/
│       └── auth.js         ← JWT protect middleware
│
└── client/                 ← React 18 frontend
    └── src/
        ├── App.js           ← Routes
        ├── context/
        │   └── AuthContext.js
        ├── utils/
        │   └── api.js       ← Axios instance
        ├── components/
        │   ├── Navbar.js
        │   ├── ModelCard.js
        │   └── ProtectedRoute.js
        └── pages/
            ├── Home.js
            ├── Login.js
            ├── Signup.js
            ├── Gallery.js
            ├── ModelDetail.js
            ├── UploadModel.js
            ├── Profile.js
            └── Bookmarks.js
```

## 🛠 Tech Stack
- **Frontend:** React 18, React Router v6, Axios, react-hot-toast, lucide-react
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas
- **Auth:** JWT + bcryptjs
- **Deploy:** Netlify + Render
