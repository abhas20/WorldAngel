# Development Notes

## Quick Commands

```bash
# One-time setup (from root directory)
npm run setup

# Start development (both servers)
npm run dev

# Install dependencies for both projects
npm run install-all

# Build for production
npm run build
```

## Environment Variables Reference

### Backend (.env in backend_country/)
```env
DB_URL=mongodb://localhost:27017/           # MongoDB connection
DB_NAME=worldangel                          # Database name
ACCESS_TOKEN_SECRET=your_secret_here        # JWT access token secret
ACCESS_TOKEN_EXPIRY=15m                     # Access token expiry
REFRESH_TOKEN_SECRET=your_refresh_secret    # JWT refresh token secret
REFRESH_TOKEN_EXPIRY=10d                   # Refresh token expiry
CLOUDINARY_CLOUD_NAME=your_cloud_name      # Cloudinary config
CLOUDINARY_API_KEY=your_api_key            # Cloudinary API key
CLOUDINARY_API_SECRET=your_api_secret      # Cloudinary API secret
PORT=8080                                  # Server port
FRONTEND_URL=http://localhost:5173         # Frontend URL for CORS
```

### Frontend (.env in frontend_country/)
```env
VITE_BACKEND_URL=http://localhost:8080/api/v1    # Backend API URL
VITE_BACKEND_URL_SOCKET=http://localhost:8080    # Socket.io server URL
```

## Common Issues & Solutions

### MongoDB Connection
- **Local**: Ensure MongoDB is running on port 27017
- **Atlas**: Whitelist your IP address and use correct connection string

### Cloudinary Issues  
- Create free account at cloudinary.com
- Get credentials from dashboard
- Verify API limits

### Port Conflicts
- Backend default: 8080
- Frontend default: 5173
- Change PORT in backend .env if needed

### CORS Errors
- Ensure FRONTEND_URL matches your React dev server
- Check both URLs in browser console

## Project Architecture

```
WorldAngel/
├── Root package.json (scripts to manage both apps)
├── backend_country/ (Node.js API)
└── frontend_country/ (React SPA)
```

## Development Workflow

1. Make changes to code
2. Changes auto-reload with nodemon/vite
3. Test in browser
4. Check console for errors
5. Commit and push changes

## Useful Development Links

- REST Countries API: https://restcountries.com/v3.1/all
- Cloudinary Dashboard: https://cloudinary.com/console
- MongoDB Atlas: https://cloud.mongodb.com/
- Socket.io Docs: https://socket.io/docs/