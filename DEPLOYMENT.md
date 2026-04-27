# 🚀 Deployment Guide: Online Tutor Platform

## Architecture
- **Database**: MongoDB Atlas
- **Backend**: Render
- **Frontend**: Vercel

---

## STEP 1: MongoDB Atlas Setup ✅

### 1.1 Create Account & Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up → Create Project "OnlineTutor"
3. Create M0 (Free) cluster
4. Select your region

### 1.2 Create Database User
1. Security → Database Access → Add Database User
   - Username: `tutorAdmin` (or your choice)
   - Password: Create strong password (save it!)
   - Role: `Atlas admin`

### 1.3 Allow Network Access
1. Network Access → Add IP Address
2. Select "Allow from anywhere" (0.0.0.0/0)

### 1.4 Get Connection String
1. Databases → Connect → Drivers
2. Copy connection string
3. **Format**: `mongodb+srv://tutorAdmin:PASSWORD@cluster.mongodb.net/online_tutor?retryWrites=true&w=majority`

---

## STEP 2: Backend Preparation & Deployment

### 2.1 Update .env File
Replace in `/backend/.env`:
```
MONGODB_URI=mongodb+srv://tutorAdmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/online_tutor?retryWrites=true&w=majority
PORT=5001
NODE_ENV=production
CORS_ORIGIN=http://localhost:5173,https://yourfrontend.vercel.app
GITHUB_TOKEN=your_github_token
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=your_repo
```

### 2.2 Ensure package.json has start script
Backend package.json should have:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 2.3 Create Render Account & Deploy
1. Go to https://render.com
2. Sign up with GitHub
3. Click **New** → **Web Service**
4. Connect your GitHub repository
5. Fill in:
   - **Name**: `online-tutor-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Choose closest to users
6. Click **Advanced** → Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://tutorAdmin:PASSWORD@cluster...
   PORT=5001
   NODE_ENV=production
   CORS_ORIGIN=http://localhost:5173,https://yourfrontend.vercel.app
   GITHUB_TOKEN=your_token
   GITHUB_REPO_OWNER=your_username
   GITHUB_REPO_NAME=your_repo
   ```
7. Click **Create Web Service**
8. Wait for deployment (2-5 minutes)
9. **Copy your backend URL** (e.g., `https://online-tutor-backend.onrender.com`)

---

## STEP 3: Frontend Preparation & Deployment

### 3.1 Update Frontend .env
In `/frontend/.env`:
```
VITE_API_BASE_URL=https://online-tutor-backend.onrender.com
VITE_ENV=production
```

### 3.2 Build & Test Locally (Optional)
```bash
cd frontend
npm run build
npm run preview
```

### 3.3 Create Vercel Account & Deploy
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Fill in:
   - **Framework**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: `./frontend`
6. Click **Environment Variables** → Add:
   ```
   VITE_API_BASE_URL=https://online-tutor-backend.onrender.com
   VITE_ENV=production
   ```
7. Click **Deploy**
8. Wait for deployment (1-3 minutes)
9. **Get your frontend URL** (e.g., `https://online-tutor.vercel.app`)

### 3.4 Update Backend CORS (Important!)
Go back to Render dashboard:
1. Select your backend service
2. Environment → Edit `CORS_ORIGIN`
3. Change to: `https://yourfrontend.vercel.app`
4. Deploy again

---

## STEP 4: Testing Production

### Test Checklist:
- [ ] Backend API test: `https://online-tutor-backend.onrender.com/api/test/tutors`
- [ ] Register a new user on Vercel frontend
- [ ] Login
- [ ] Browse tutors/courses
- [ ] Send a message
- [ ] Check MongoDB Atlas - see new documents
- [ ] Upload course image - verify on GitHub

---

## Important Notes

### Free Tier Limits:
- **Render**: Spins down after 15 min of inactivity (cold start ~30 sec)
- **Vercel**: Unlimited deployments
- **MongoDB Atlas**: 512MB storage (enough for testing)

### To Keep Render Awake:
Add a pinging service:
```javascript
// Add to backend server.js
setInterval(async () => {
  try {
    await fetch('https://your-render-url.onrender.com/');
  } catch (err) {}
}, 600000); // Ping every 10 minutes
```

### Troubleshooting:

**"MONGODB_URI is not defined"**
- Check Render environment variables are set
- Redeploy after adding variables

**"CORS error" on frontend**
- Update CORS_ORIGIN in backend
- Ensure frontend URL matches exactly
- Redeploy backend

**404 on backend endpoints**
- Test: `https://backend-url.onrender.com/api/test/tutors`
- Check routes are correct in server.js

**Images not uploading**
- Verify GITHUB_TOKEN in backend .env
- Check token has repo write access
- Test token: `curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user`

---

## Next Steps

1. ✅ Setup MongoDB Atlas
2. ✅ Deploy Backend on Render
3. ✅ Deploy Frontend on Vercel
4. ✅ Test all features
5. 📧 Add email notifications (Nodemailer)
6. 💳 Add payment gateway (Stripe/Razorpay)
7. 🔐 Add JWT authentication
8. 📱 Mobile app (React Native)
