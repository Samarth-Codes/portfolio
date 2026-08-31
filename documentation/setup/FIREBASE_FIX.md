# Firebase Backend Error - Fixed

## Problem
Backend was showing authentication error when trying to access Firestore:
- Error Code: 16 (UNAUTHENTICATED)
- Error Message: "Request had invalid authentication credentials"

## Root Cause
Firestore Database was not enabled/created in the Firebase project.

## Solution Steps

### 1. Create Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **portfolio-7c76d**
3. Navigate to: Build → Firestore Database
4. Click "Create database"
5. Choose location (e.g., us-central1)
6. Start in "test mode" for development

### 2. Apply Security Rules
Copy the rules from `server/firestore.rules` to the Firebase Console:
- Go to Firestore → Rules tab
- Paste the rules and click "Publish"

### 3. Restart Backend Server
```powershell
# Stop the current server (Ctrl+C in the terminal)
cd d:\portfolio-1\server
npm start
```

### 4. Test the Connection
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/health
Invoke-RestMethod -Uri http://localhost:5000/api/achievements
```

## Note About "Database Secrets" Warning
The screenshot you shared about "Database secrets" deprecation is unrelated to this issue. That warning is for Firebase **Realtime Database**, but this project uses **Firestore** (a different service). Your Firebase Admin SDK configuration is already correct.

## Files Modified
- `server/firebase.js` - Added better error logging
- `server/firestore.rules` - Created security rules template
- `server/test-firebase.js` - Created diagnostic test script
