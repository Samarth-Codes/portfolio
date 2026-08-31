# 🔥 Firebase Migration - Quick Start

## ⚡ 3-Minute Setup

### 1. Firebase Console (2 min)
1. Go to https://console.firebase.google.com/
2. Create project → Enable Firestore → Generate Service Account Key
3. Download the JSON file

### 2. Local Setup (1 min)
1. Create `server/.env`:
```bash
ADMIN_PASSWORD=your_password
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...paste entire JSON here as single line...}
```

2. Migrate data:
```bash
cd server
node migrate.js
```

3. Test:
```bash
npm start
```

### 3. Production Setup (Render)
Add environment variables in Render dashboard:
- `ADMIN_PASSWORD` = your_password
- `FIREBASE_SERVICE_ACCOUNT` = minified JSON

## 📝 Quick Commands

```bash
# Install dependencies (already done)
cd server
npm install

# Migrate existing data to Firebase
node migrate.js

# Start development server
npm start

# Deploy
git add .
git commit -m "Add Firebase integration"
git push
```

## ✅ What Changed?

### Before (File-based ❌)
- Data stored in `server/data/*.json`
- Gets wiped on every Render restart
- No persistence

### After (Firebase ✅)
- Data stored in Firestore cloud
- Persists forever
- Automatic backups
- Real-time sync

## 🎯 Collections Created

1. **achievements** - Your achievement cards
2. **projects** - Your project cards
3. **settings** - Resume URL and other settings

---

**Need detailed instructions?** See `FIREBASE_SETUP.md`
