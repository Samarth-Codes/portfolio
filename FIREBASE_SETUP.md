# 🔥 Firebase Migration Guide

This guide will help you migrate from file-based storage to Firebase Firestore for your portfolio admin dashboard.

## 📋 Prerequisites

- Google Account
- 5 minutes of your time

---

## 🚀 Step-by-Step Setup

### 1️⃣ Create Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Click **"Add project"** or select existing project
3. Enter project name (e.g., "portfolio-samarth")
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 2️⃣ Enable Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. **Choose mode**: Select **"Start in production mode"**
4. **Select location**: Choose closest region (e.g., `asia-south1` for India)
5. Click **"Enable"**

### 3️⃣ Generate Service Account Key

1. Click the **⚙️ gear icon** → **"Project settings"**
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the confirmation dialog
5. **Save the downloaded JSON file** (keep it secure!)

### 4️⃣ Configure Environment Variables

#### For Local Development:

1. Create `server/.env` file:
```bash
ADMIN_PASSWORD=your_secure_password
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"..."}
PORT=5000
```

2. **Minify the service account JSON**:
   - Open the downloaded JSON file
   - Copy ALL content
   - Minify it (remove all line breaks and extra spaces)
   - Paste as the value for `FIREBASE_SERVICE_ACCOUNT`

#### For Render/Production:

1. Go to your Render dashboard
2. Select your web service
3. Navigate to **"Environment"** tab
4. Add these variables:
   - `ADMIN_PASSWORD`: Your secure admin password
   - `FIREBASE_SERVICE_ACCOUNT`: The minified JSON from step 3
   - `PORT`: 5000 (or leave blank, Render sets this automatically)

### 5️⃣ Migrate Existing Data (One-time)

Run this command to move your existing data to Firebase:

```bash
cd server
node migrate.js
```

This will transfer:
- ✅ All achievements
- ✅ All projects
- ✅ Resume URL

### 6️⃣ Test Locally

```bash
cd server
npm start
```

Visit: `http://localhost:5000/api/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "...",
  "firebase": "connected"
}
```

### 7️⃣ Deploy to Production

1. **Commit changes**:
```bash
git add .
git commit -m "Migrate to Firebase Firestore"
git push
```

2. **Render will auto-deploy** (if you have auto-deploy enabled)

3. **Verify**: Visit `https://samarthcodes.dev/api/health`

---

## 🔒 Firestore Security Rules

After migration, update your Firestore security rules:

1. Go to **Firebase Console** → **Firestore Database** → **Rules**
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Your backend will handle writes via Admin SDK
  }
}
```

3. Click **"Publish"**

---

## 📊 Firestore Collections Structure

```
portfolio (database)
├── achievements/
│   ├── {docId1}
│   │   ├── icon: "🎓"
│   │   ├── title: "Achievement Title"
│   │   ├── description: "Description..."
│   │   └── createdAt: "2024-01-17T..."
│   └── ...
├── projects/
│   ├── {docId1}
│   │   ├── title: "Project Title"
│   │   ├── description: "Description..."
│   │   ├── technologies: ["React", "Node.js"]
│   │   ├── github: "https://..."
│   │   └── createdAt: "2024-01-17T..."
│   └── ...
└── settings/
    └── resume
        ├── url: "https://drive.google.com/..."
        └── updatedAt: "2024-01-17T..."
```

---

## ✅ Benefits of Firebase

- ✅ **Persistent storage** - Data never gets wiped
- ✅ **Real-time sync** - Changes reflect instantly
- ✅ **Scalable** - Handles any traffic
- ✅ **Free tier** - More than enough for your portfolio
- ✅ **Global CDN** - Fast worldwide
- ✅ **Automatic backups** - Built-in data protection

---

## 🆘 Troubleshooting

### "Firebase initialization failed"
- Check that `FIREBASE_SERVICE_ACCOUNT` is properly minified (single line, no line breaks)
- Ensure the JSON is valid (use a JSON validator)

### "Permission denied" errors
- Verify your service account has the correct permissions
- Check Firestore security rules

### Data not showing
- Run the migration script: `node migrate.js`
- Check Firebase Console to verify data is in Firestore

---

## 📞 Need Help?

If you encounter any issues, check:
1. Firebase Console for error logs
2. Render logs for backend errors
3. Browser console for frontend errors

---

**You're all set! 🎉**
