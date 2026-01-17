# Admin Dashboard Backend Setup

## Overview
The admin dashboard uses a Node.js Express backend with JSON file storage that can be deployed to any hosting platform.

## Local Development

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Start the Backend Server
```bash
npm start
# Server will run on http://localhost:5000
```

### 3. Configure Frontend
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start Frontend
```bash
npm start
# Frontend will run on http://localhost:3000
```

### 5. Access Admin Dashboard
Navigate to: `http://localhost:3000/admin`
Default password: `admin123`

## Deployment

### Backend Deployment (Render/Railway/Fly.io)

1. **Push your code to GitHub**

2. **Deploy Backend:**
   - Go to Render.com (or Railway.app)
   - Create new Web Service
   - Connect your GitHub repo
   - Set build command: `cd server && npm install`
   - Set start command: `cd server && npm start`
   - Add environment variable: `ADMIN_PASSWORD=your_password_here`

3. **Get Backend URL:**
   - Copy your deployed backend URL (e.g., `https://your-backend.onrender.com`)

### Frontend Deployment (Vercel/Netlify)

1. **Update Frontend Environment:**
   - Add environment variable in Vercel/Netlify dashboard:
   - `REACT_APP_API_URL=https://your-backend.onrender.com/api`

2. **Deploy Frontend:**
   - Connect your GitHub repo to Vercel or Netlify
   - It will auto-deploy

## Environment Variables

### Backend (.env in server folder - optional)
```
PORT=5000
ADMIN_PASSWORD=your_secure_password
```

### Frontend (.env in root folder)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

### Public Endpoints
- `GET /api/achievements` - Get all achievements
- `GET /api/projects` - Get all projects
- `GET /api/health` - Health check

### Protected Endpoints (require X-Admin-Password header)
- `POST /api/achievements` - Add achievement
- `DELETE /api/achievements/:id` - Delete achievement  
- `POST /api/projects` - Add project
- `DELETE /api/projects/:id` - Delete project

## Security

- Change the default password in production
- The backend uses simple password authentication
- For production, consider adding JWT or OAuth
- CORS is enabled for all origins (restrict in production if needed)

## Data Storage

- Data is stored in JSON files in the `server/data/` directory
- Files: `achievements.json` and `projects.json`
- Files are created automatically on first run
- **Important**: Make sure to backup these files or use a database for production

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Run `npm install` in the server directory
- Check console for error messages

### Frontend can't connect to backend
- Verify `REACT_APP_API_URL` is correct
- Check if backend is running
- Check browser console for CORS errors
- Ensure backend URL doesn't have trailing slash

### Data not persisting
- Check that `server/data/` directory has write permissions
- Verify JSON files are being created
- Check for file system errors in backend logs
