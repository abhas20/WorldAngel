# 🌍 WorldAngel

A full-stack web application that allows users to explore different countries around the world and engage in real-time conversations with other users about their travel experiences and cultural insights.

## ✨ Features

### 🗺️ Country Exploration
- **Interactive Country Explorer**: Browse through 250+ countries worldwide
- **Detailed Country Information**: View flags, population, regions, capitals, and more
- **Advanced Search & Filter**: Search by country name and filter by geographical regions
- **Country Details**: Get comprehensive information about each country
- **REST Countries API Integration**: Real-time data from reliable sources

### 💬 Real-time Chat System
- **Room-based Chat**: Create or join chat rooms for different countries/topics
- **Live Messaging**: Real-time communication powered by Socket.io
- **File Sharing**: Send images and attachments in conversations
- **User Presence**: See who's online and active in each room

### 👤 User Management
- **User Registration & Authentication**: Secure JWT-based authentication
- **Profile Management**: Customize your profile with avatars
- **Password Management**: Change passwords securely
- **Protected Routes**: Secure areas requiring authentication

## 🚀 Technology Stack

### Frontend
- **React 19**: Modern React with hooks and context
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Socket.io Client**: Real-time WebSocket communication
- **Axios**: HTTP client for API calls
- **React Toastify**: User notifications

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **Socket.io**: Real-time bidirectional communication
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Token authentication
- **bcrypt**: Password hashing
- **Multer**: File upload handling
- **Cloudinary**: Cloud-based image and video storage
- **CORS**: Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (version 7.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary Account** (for file storage - free tier available)

## 🛠️ Installation & Setup

### Quick Start (Recommended)

```bash
# Clone the repository
git clone https://github.com/abhas20/WorldAngel.git
cd WorldAngel

# Install concurrently for running both servers
npm install

# Install all dependencies for both frontend and backend
npm run install-all

# Copy environment files
cp backend_country/.env.example backend_country/.env
cp frontend_country/.env.example frontend_country/.env

# Configure your environment variables (see sections below)
# Then run both frontend and backend simultaneously
npm run dev
```

### Manual Setup

If you prefer to set up each part manually:

### 1. Clone the Repository

```bash
git clone https://github.com/abhas20/WorldAngel.git
cd WorldAngel
```

### 2. Backend Setup

```bash
cd backend_country

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env  # If .env.example exists, otherwise create .env manually
```

Create a `.env` file in the `backend_country` directory with the following variables:

```env
# Database Configuration
DB_URL=mongodb://localhost:27017/
# OR for MongoDB Atlas:
# DB_URL=your_atlas_url
DB_NAME=worldangel

# JWT Configuration
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=8080
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend_country

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env  # If .env.example exists, otherwise create .env manually
```

Create a `.env` file in the `frontend_country` directory:

```env
# Backend API Configuration
VITE_BACKEND_URL=http://localhost:8080/api/v1
VITE_BACKEND_URL_SOCKET=http://localhost:8080
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will create the database automatically

#### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `DB_URL` in your backend `.env` file

### 5. Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from your dashboard
3. Update the Cloudinary variables in your backend `.env` file

## 🏃‍♂️ Running the Application

### Quick Start (Run Both Servers)

```bash
# From the root directory, run both frontend and backend simultaneously
npm run dev
```

This will start:
- Backend server at `http://localhost:8080`
- Frontend application at `http://localhost:5173`

### Individual Server Management

**Backend Only:**
```bash
cd backend_country
npm run dev
```

**Frontend Only:**
```bash
cd frontend_country
npm run dev
```

### Development Mode (Manual Setup)

**Terminal 1 - Backend:**
```bash
cd backend_country
npm run dev
```
The backend server will start at `http://localhost:8080`

**Terminal 2 - Frontend:**
```bash
cd frontend_country
npm run dev
```
The frontend application will start at `http://localhost:5173`

### Production Mode

**Backend:**
```bash
cd backend_country
npm start
```

**Frontend:**
```bash
cd frontend_country
npm run build
npm run preview
```

## 📁 Project Structure

```
WorldAngel/
├── backend_country/           # Backend Node.js application
│   ├── config/               # Configuration files
│   │   ├── db.js            # Database connection
│   │   └── socket.js        # Socket.io configuration
│   ├── controller/          # Route controllers
│   │   ├── user.controller.js
│   │   ├── chat.controller.js
│   │   └── message.controller.js
│   ├── middlewares/         # Custom middlewares
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/             # Database models
│   │   ├── userModel.js
│   │   ├── chatModel.js
│   │   └── messageModel.js
│   ├── routes/             # API routes
│   │   ├── user.route.js
│   │   └── chat.route.js
│   ├── utils/              # Utility functions
│   │   └── Cloudinary.js
│   ├── app.js              # Express app configuration
│   └── index.js            # Server entry point
│
├── frontend_country/          # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api/             # API service functions
│   │   │   ├── authApi.jsx
│   │   │   ├── chatApi.jsx
│   │   │   └── postApi.jsx
│   │   ├── auth/            # Authentication context and hooks
│   │   ├── chat/            # Socket.io client configuration
│   │   ├── components/      # Reusable React components
│   │   │   ├── layout/      # Layout components
│   │   │   └── ui/          # UI components
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Country.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── login.jsx
│   │   │   └── signup.jsx
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Application entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md                 # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/user/signup` - User registration
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/logout` - User logout
- `POST /api/v1/user/refresh-token` - Refresh access token
- `GET /api/v1/user/current-user` - Get current user info
- `POST /api/v1/user/change-password` - Change password
- `PATCH /api/v1/user/update-avatar` - Update user avatar

### Chat System
- `POST /api/v1/chat/create-room` - Create a chat room
- `POST /api/v1/chat/join-room` - Join a chat room
- `GET /api/v1/chat/get-all-rooms` - Get all available rooms
- `POST /api/v1/chat/send-message` - Send a message
- `GET /api/v1/chat/get-messages` - Get room messages

### Countries Data
- The app uses [REST Countries API](https://restcountries.com/) for country information

## 🌐 Live Demo

- **Frontend**: Deployed on Vercel at `https://world-angel.vercel.app`
- **Backend**: Deployed backend server (URL configured in CORS)

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or your Atlas connection string is correct
   - Check if your IP is whitelisted in MongoDB Atlas

2. **Cloudinary Upload Errors**
   - Verify your Cloudinary credentials are correct
   - Check your Cloudinary account limits

3. **CORS Errors**
   - Ensure frontend URL is added to CORS origins in backend
   - Check if both frontend and backend URLs are correct

4. **Socket.io Connection Issues**
   - Verify `VITE_BACKEND_URL_SOCKET` points to your backend server
   - Check if ports are correctly configured

5. **Environment Variables Not Loading**
   - Ensure `.env` files are in the correct directories
   - Restart development servers after changing environment variables
   - Check that variable names match exactly (case-sensitive)

### Development Tips

- Use `npm run dev` for both frontend and backend during development
- Check browser console and terminal logs for detailed error information
- Ensure all required environment variables are set before running the application

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

- GitHub: [@abhas20](https://github.com/abhas20)


⭐ If you found this project helpful, please give it a star on GitHub!
