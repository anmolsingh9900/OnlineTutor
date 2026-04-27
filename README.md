# 🎓 Online Tutor Platform

A comprehensive full-stack web application designed to connect students with qualified tutors for personalized online learning. This Service-Oriented Architecture (SOA) based platform provides real-time communication, course management, and quality assurance through integrated rating systems.

**Student Roll No:** 25/10/MT/030  
**Academic Project:** CS-738 (Service Oriented Architecture)  
**Institution:** School of Computer and Systems Sciences, Jawaharlal Nehru University  
**Guide:** Dr. Poonguzhali N.

---

## 📋 Overview

The Online Tutor Platform revolutionizes digital education by creating a seamless marketplace where:
- **Students** discover, purchase, and learn from expert tutors with real-time interaction
- **Tutors** create, manage courses, and build their student community with integrated communication tools
- **Platform** ensures quality through comprehensive rating systems, secure transactions, and data integrity

---

## ✨ Key Features

### 👨‍🎓 For Students

| Feature | Description |
|---------|-------------|
| **Authentication** | Secure registration, login, and profile management with email verification |
| **Course Discovery** | Browse available courses from verified tutors with detailed descriptions |
| **Course Purchase** | Secure enrollment with transaction tracking and purchase history |
| **Real-time Chat** | Instant messaging with tutors for questions and support |
| **My Courses** | View all enrolled courses with progress tracking and resources |
| **Ratings & Reviews** | Rate tutors and courses, view community feedback |
| **Dashboard** | Personalized overview with quick stats and easy navigation |
| **Profile Management** | Update personal information, preferences, and learning goals |

### 👨‍🏫 For Tutors

| Feature | Description |
|---------|-------------|
| **Course Management** | Create, edit, and publish courses with media uploads |
| **Student Tracking** | View enrolled students and their progress |
| **Real-time Communication** | Direct messaging with students for support and guidance |
| **Tutor Dashboard** | Analytics overview with revenue, student count, and ratings |
| **Profile Management** | Build professional profile with expertise and credentials |
| **Course Analytics** | Track course performance and student engagement metrics |

---

## 🏗️ System Architecture

### Architecture Pattern: Service-Oriented Architecture (SOA)

```
┌──────────────────────────────────────────────┐
│         Client Layer (Frontend - React)      │
│  • Single Page Application (SPA)             │
│  • Component-based UI                        │
│  • Responsive Design                         │
└──────────────┬───────────────────────────────┘
               │ REST API (HTTP/HTTPS)
┌──────────────▼───────────────────────────────┐
│      API Gateway Layer (Express.js)          │
│  • CORS Protection                           │
│  • Request Validation                        │
│  • Authentication Middleware                 │
└──────────────┬───────────────────────────────┘
               │
    ┌──────────┼──────────┬────────────┐
    │          │          │            │
┌───▼────┐ ┌──▼────┐ ┌───▼───┐ ┌─────▼─────┐
│ User   │ │Course │ │ Chat  │ │ Rating    │
│Service │ │Service│ │Service│ │ Service   │
└───┬────┘ └──┬────┘ └───┬───┘ └─────┬─────┘
    │         │         │            │
└───┴─────────┴─────────┴────────────┘
          │
┌─────────▼───────────────────┐
│   Data Tier (MongoDB)       │
│ • Users Collection          │
│ • Courses Collection        │
│ • Chats Collection          │
│ • Ratings Collection        │
└─────────────────────────────┘
```

### Three-Tier Architecture

1. **Presentation Tier**: React-based interactive UI with responsive design
2. **Business Logic Tier**: Express.js with modular service components
3. **Data Tier**: MongoDB with Mongoose ODM and optimized indexes

---

## 🛠️ Tech Stack

### Backend Stack
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js v5.2.1
- **Database ODM**: Mongoose v9.4.1
- **Authentication**: Bcrypt v6.0.0 (password hashing with 10 salt rounds)
- **File Upload**: Multer v1.4.5 (memory storage)
- **HTTP Client**: Axios v1.15.2 (GitHub API integration)
- **Security**: CORS v2.8.6, dotenv v17.4.2
- **Dev Tools**: Nodemon v3.1.14
- **Port**: 5001

### Frontend Stack
- **Library**: React v19.2.4
- **Build Tool**: Vite v8.0.1
- **Routing**: React Router v7.14.0
- **HTTP Client**: Axios v1.14.0
- **Carousel**: Swiper v12.1.3
- **Code Quality**: ESLint v9.39.4
- **Styling**: Native CSS with responsive design
- **Port**: 5173

### Database & Infrastructure
- **Database**: MongoDB Atlas (Cloud-hosted)
- **Backend Hosting**: Render (https://render.com)
- **Frontend Hosting**: Vercel (https://vercel.com)
- **File Storage**: GitHub API (CDN-backed)
- **Deployment**: Docker-ready with auto-scaling

---

## 📁 Project Structure

```
OnlineTutor/
├── backend/                          # Node.js/Express backend
│   ├── models/
│   │   ├── user.js                  # User authentication schema
│   │   ├── course.js                # Course metadata schema
│   │   ├── chat.js                  # Chat and messaging schema
│   │   └── rating.js                # Rating and reviews schema
│   ├── routes/
│   │   ├── userRoutes.js            # Auth & profile endpoints
│   │   ├── courseRoutes.js          # Course management endpoints
│   │   ├── chatRoutes.js            # Messaging endpoints
│   │   └── ratingRoutes.js          # Rating & review endpoints
│   ├── utils/
│   │   └── githubUpload.js          # GitHub API file upload utility
│   ├── uploads/                     # Course material storage
│   ├── dump/                        # MongoDB backup files
│   ├── server.js                    # Main Express server
│   ├── package.json                 # Backend dependencies
│   └── .env                         # Environment variables (create this)
│
├── frontend/                         # React SPA frontend
│   ├── app/
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Authentication
│   │   │   ├── Register.jsx         # User registration
│   │   │   ├── ChatPage.jsx         # Messaging interface
│   │   │   ├── MyProfile.jsx        # User profile
│   │   │   ├── MyPurchase.jsx       # Purchased courses
│   │   │   ├── About.jsx            # Platform info
│   │   │   ├── Contact.jsx          # Contact form
│   │   │   └── Terms.jsx            # Terms & conditions
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx           # Navigation
│   │   │   ├── Footer.jsx           # Footer
│   │   │   ├── StudentDashboard.jsx # Student overview
│   │   │   ├── TutorDashboard.jsx   # Tutor overview
│   │   │   ├── ChatList.jsx         # Chat threads list
│   │   │   ├── Chat.jsx             # Chat interface
│   │   │   ├── CourseCard.jsx       # Course display
│   │   │   ├── Rating.jsx           # Rating component
│   │   │   ├── Popup.jsx            # Modal dialogs
│   │   │   └── ProtectedRoute.jsx   # Route guards
│   │   ├── assets/                  # Images & media
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── styles.css               # Global styles
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint rules
│   └── .env                         # Environment variables (create this)
│
├── DEPLOYMENT.md                    # Deployment guide
├── README.md                        # This file
└── .env.example                     # Environment template
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v14 or higher
- **MongoDB** (local or Atlas account)
- **Git** for version control
- **GitHub account** for API token (file uploads)
- **npm** or **yarn** package manager

### Installation Steps

#### 1. Clone Repository
```bash
git clone <repository-url>
cd OnlineTutor
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/online_tutor?retryWrites=true&w=majority
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
GITHUB_TOKEN=your_github_token
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=your_repo_name
```

Start backend:
```bash
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_ENV=development
```

Start frontend:
```bash
npm run dev
```

#### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001

---

## 📚 API Endpoints

### Authentication Routes
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile/:email` - Get user profile
- `PUT /api/users/profile/:email` - Update profile
- `GET /api/users/tutors` - Get all tutors

### Course Routes
- `POST /api/courses/add` - Create course
- `GET /api/courses` - Get all courses
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Chat Routes
- `POST /api/chats/send-message` - Send message
- `GET /api/chats/list/:email/:role` - Get user chats
- `GET /api/chats/:id` - Get chat history

### Rating Routes
- `POST /api/ratings/submit-rating` - Submit rating
- `GET /api/ratings/tutor/:email` - Get tutor ratings
- `GET /api/ratings/course/:courseId` - Get course ratings

---

## 🔒 Security Features

✅ **Authentication**: Bcrypt hashing with 10 salt rounds  
✅ **API Security**: CORS protection with configurable origins  
✅ **Input Validation**: Server-side validation on all endpoints  
✅ **Access Control**: Role-based route protection  
✅ **Data Privacy**: No sensitive data in logs or responses  
✅ **Email Normalization**: Case-insensitive email comparison  
✅ **Purchase Verification**: Rating access restricted to verified buyers  

---

## 📊 Database Collections

### Users
- Stores authentication credentials and user profiles
- Maintains purchase history and enrollment records
- Supports role-based access (student/tutor)

### Courses
- Contains course metadata and tutor information
- Stores course images (GitHub CDN URLs)
- Maintains course pricing and duration

### Chats
- Real-time messaging between students and tutors
- Message archiving without deletion
- Unread message tracking
- Chat metadata (creation time, last update)

### Ratings
- Student reviews and star ratings (1-5 scale)
- Text-based feedback and comments
- Unique constraint per student-tutor-course combination
- Timestamp tracking for audit purposes

---

## 🎨 Design & Branding

**Color Scheme:**
- Primary: `#071124` (Dark Blue)
- Accent: `#ff7a00` (Orange)
- Secondary: `#4a6cf7` (Bright Blue)

**Responsive Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🌐 Deployment

### Development Deployment
See `DEPLOYMENT.md` for comprehensive deployment guide

### Production Deployment
- **Database**: MongoDB Atlas
- **Backend**: Render
- **Frontend**: Vercel
- **File Storage**: GitHub API

---

## 📋 Module Architecture

### 1. Authentication Module
Handles user registration, login, profile management, and password security

### 2. Course Management Module
Enables tutors to create, update, and manage course content with file uploads

### 3. Student Management Module
Manages student enrollment, purchase history, and dashboard operations

### 4. Communication Module
Facilitates real-time messaging with message persistence and archiving

### 5. Rating Module
Implements quality assurance through reviews and performance metrics

### 6. Dashboard Module
Provides role-specific interfaces for students and tutors

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test

# Lint checks
npm run lint
```

---

## 📝 Development Notes

- **Code Style**: Follow ESLint configuration
- **Component Structure**: Keep components reusable and modular
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components
- **Error Handling**: Comprehensive error messages and logging
- **Comments**: Document complex logic and algorithms

---

## 🔮 Future Enhancements

- [ ] Video conferencing integration (Zoom/Google Meet)
- [ ] Advanced payment gateway (Stripe/PayPal)
- [ ] Mobile applications (iOS/Android)
- [ ] AI-based course recommendations
- [ ] Gamification features (badges, leaderboards)
- [ ] Discussion forums and Q&A sections
- [ ] Assignment and quiz support
- [ ] Progress analytics and certificates
- [ ] Admin dashboard for system management
- [ ] Two-factor authentication (2FA)

---

## 📄 License

This project is developed as part of academic coursework at Jawaharlal Nehru University.  
Please refer to your institution's policies for usage and distribution rights.

---

## 👥 Contributors

**Developer**: Anmol Kumar Singh (25/10/MT/030)  
**Mentor**: Dr. Poonguzhali N.  
**Institution**: School of Computer and Systems Sciences, JNU

---

## 📞 Support & Contact

For questions, issues, or suggestions:
1. Check existing documentation in `DEPLOYMENT.md`
2. Review API endpoints in this README
3. Examine code comments for implementation details
4. Contact project mentor for academic guidance

---

## 🙏 Acknowledgments

- Open-source communities (Node.js, React, MongoDB)
- Jawaharlal Nehru University for academic support
- Dr. Poonguzhali N. for project guidance and mentorship

---

**Last Updated**: April 27, 2026  
**Version**: 1.0  
**Status**: Production Ready
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Authentication
│   │   │   ├── Register.jsx         # User registration
│   │   │   ├── ChatPage.jsx         # Messaging interface
│   │   │   ├── MyProfile.jsx        # User profile
│   │   │   ├── MyPurchase.jsx       # Purchased courses
│   │   │   ├── About.jsx            # Platform info
│   │   │   ├── Contact.jsx          # Contact form
│   │   │   └── Terms.jsx            # Terms & conditions
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx           # Navigation
│   │   │   ├── Footer.jsx           # Footer
│   │   │   ├── StudentDashboard.jsx # Student overview
│   │   │   ├── TutorDashboard.jsx   # Tutor overview
│   │   │   ├── ChatList.jsx         # Chat threads list
│   │   │   ├── Chat.jsx             # Chat interface
│   │   │   ├── CourseCard.jsx       # Course display
│   │   │   ├── Rating.jsx           # Rating component
│   │   │   ├── Popup.jsx            # Modal dialogs
│   │   │   └── ProtectedRoute.jsx   # Route guards
│   │   ├── assets/                  # Images & media
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── styles.css               # Global styles
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint rules
│   └── .env                         # Environment variables (create this)
│
├── DEPLOYMENT.md                    # Deployment guide
├── README.md                        # This file
└── .env.example                     # Environment template
│   │   ├── userRoutes.js
│   │   ├── chatRoutes.js
│   │   └── courseRoutes.js
│   ├── uploads/          (course files storage)
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── components/   (reusable components)
│   │   ├── pages/        (page components)
│   │   ├── assets/       (images and media)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── public/
│   │   └── logo.png         (project logo)
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── index.html
└── README.md
```

## 🎨 Design & Branding

- **Logo**: Professional illustration featuring a tutor teaching a student with education symbols
- **Logo File**: `logo.png` (used as favicon and branding asset)
- **Color Scheme**: 
  - Primary: `#071124` (Dark Blue)
  - Accent: `#ff7a00` (Orange)
  - Secondary: `#4a6cf7` (Bright Blue)
- **Cleaned Up**: Removed all default Vite logos and unnecessary template files

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd online_tutor
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running the Project

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```
Expected output:
```
Server running on port 5001
✅ MongoDB Connected
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE v8.0.3 ready in XXX ms
➜  Local:   http://localhost:5173/
```

3. **Open in Browser**
Navigate to `http://localhost:5173/` and start using the platform!

## 📝 Available Scripts

### Backend
- `npm start` - Run production server
- `npm run dev` - Run with nodemon (auto-restart on file changes)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/:email` - Get user profile
- `PUT /api/users/:email` - Update user profile

### Chats
- `GET /api/chats/list/:email/:role` - Get user's chats
- `POST /api/chats/send-message` - Send a message
- `GET /api/chats/:chatId` - Get chat messages

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course (tutor only)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/upload` - Upload course file

## Key Pages

- **Home** - Landing page
- **Login** - User authentication
- **Register** - New user signup
- **Student Dashboard** - Student overview
- **Tutor Dashboard** - Tutor overview
- **Chat Page** - Real-time messaging
- **My Profile** - User profile management
- **My Purchase** - Purchased courses
- **About** - About the platform
- **Contact** - Contact information

## Chat System

Messages are organized by:
- **Sent messages**: Appear on the right (blue background)
- **Received messages**: Appear on the left (white background)
- **Real-time updates**: Messages refresh every 1.5 seconds
- **Timestamps**: Each message shows when it was sent

## Security Features

- Password hashing with Bcrypt
- CORS protection
- Email normalization
- Role-based access control (Student/Tutor)

## Database Models

### User
- email, name, role (student/tutor), password, profile info

### Chat
- studentEmail, tutorEmail, courseId, messages array, timestamps

### Course
- name, description, tutorEmail, price, file uploads, createdAt

## Environment Setup

Make sure MongoDB is running and accessible. The backend connects to MongoDB on startup.

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or issues.

## Support

For issues or questions, please contact the development team or open an issue in the repository.
