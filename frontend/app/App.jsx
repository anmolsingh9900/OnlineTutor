import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Terms from "./pages/Terms";
import ChatPage from "./pages/ChatPage";
import MyProfile from "./pages/MyProfile";
import MyPurchase from "./pages/MyPurchase";
import StudentDashboard from "./components/StudentDashboard";
import TutorDashboard from "./components/TutorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />

        {/* 🔒 Protected Routes - require login */}
        <Route path="/chats" element={
          <ProtectedRoute><ChatPage /></ProtectedRoute>
        } />
        <Route path="/myprofile" element={
          <ProtectedRoute><MyProfile /></ProtectedRoute>
        } />
        <Route path="/mypurchase" element={
          <ProtectedRoute requiredRole="student"><MyPurchase /></ProtectedRoute>
        } />
        <Route path="/student-dashboard" element={
          <ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/tutor-dashboard" element={
          <ProtectedRoute requiredRole="tutor"><TutorDashboard /></ProtectedRoute>
        } />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;