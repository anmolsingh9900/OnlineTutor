# Online Tutor Platform

A full-stack web application that connects students with tutors for online learning. Students can browse courses, make purchases, chat with tutors, and manage their learning journey. Tutors can create courses, manage students, and communicate in real-time.

## Features

### For Students
- **Authentication**: Sign up, login, and profile management
- **Course Browsing**: Discover and view available courses
- **Course Purchase**: Buy courses from tutors
- **Real-time Chat**: Direct messaging with tutors
- **My Courses**: View purchased courses
- **Dashboard**: Personalized student dashboard

### For Tutors
- **Course Management**: Create and manage courses with file uploads
- **Student Management**: View students enrolled in your courses
- **Real-time Chat**: Communicate with students
- **Tutor Dashboard**: Overview of students and courses
- **Profile Management**: Update tutor information

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Database ODM
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin requests
- **Port**: 5001

### Frontend
- **React** - UI library
- **Vite** - Build tool & dev server
- **ESLint** - Code quality
- **CSS** - Styling
- **Port**: 5173

## Project Structure

```
online_tutor/
├── backend/
│   ├── models/
│   │   ├── user.js
│   │   ├── chat.js
│   │   └── course.js
│   ├── routes/
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
