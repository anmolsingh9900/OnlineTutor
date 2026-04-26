import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { usePopup, PopupProvider } from "../components/Popup";
import logo from "../assets/logo.png";
import "./Register.css";

function Register() {
const location = useLocation();
const navigate = useNavigate();
const { popup, showAlert, closePopup } = usePopup();

const getRoleFromURL = () => {
  const params = new URLSearchParams(location.search);
  return params.get("role") || "student";
};

const [role, setRole] = useState(getRoleFromURL());

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: ""
  });

  const validateForm = () => {
  if (!form.name.trim()) return "Name is required";
  if (!form.email.trim()) return "Email is required";
  if (!form.mobile.trim()) return "Mobile is required";
  if (!form.gender) return "Gender is required";
  if (!form.dob) return "Date of Birth is required";
  if (!form.password) return "Password is required";
  if (!form.confirmPassword) return "Confirm your password";

  // Email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(form.email)) return "Invalid email format";

  // Mobile (10 digits)
  if (!/^[0-9]{10}$/.test(form.mobile))
    return "Mobile must be 10 digits";

  // Password length
  if (form.password.length < 6)
    return "Password must be at least 6 characters";

  // Match passwords
  if (form.password !== form.confirmPassword)
    return "Passwords do not match";

  return null;
};

const handleRegister = async () => {
  console.log("🚀 Registration started...");
  const error = validateForm();

  if (error) {
    showAlert(error + " ❌", "❌ Validation Error");
    return;
  }

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL.endsWith("/")
      ? import.meta.env.VITE_API_BASE_URL.slice(0, -1)
      : import.meta.env.VITE_API_BASE_URL;

    console.log(`📡 Sending request to: ${apiUrl}/api/users/register`);
    
    await axios.post(`${apiUrl}/api/users/register`, {
      role,
      ...form
    });

    await showAlert("Registered Successfully ✅", "✅ Account Created");
    navigate("/login");

  } catch (err) {
    console.error("❌ Registration Error:", err);
    if (err.response?.data?.error?.includes("duplicate")) {
      showAlert("Email already registered ❌", "❌ Duplicate Email");
    } else {
      showAlert("Error during registration ❌", "❌ Registration Failed");
    }
  }
};

return (
    <>
      <PopupProvider popup={popup} closePopup={closePopup} />
      
      <div className="login-card">

      {/* 🔥 FLOATING LOGO */}
      <div className="logo-wrapper">
        <img src={logo} alt="logo" className="login-logo" />
      </div>

      <h2>✨ Create Account ✨</h2>

      {/* ROLE */}
      <div className="role-toggle">
        <button
          className={role === "student" ? "active" : ""}
          onClick={() => setRole("student")}
        >
          🎓 Student
        </button>

        <button
          className={role === "tutor" ? "active" : ""}
          onClick={() => setRole("tutor")}
        >
          👨‍🏫 Tutor
        </button>
      </div>

      {/* NAME */}
      <input
        placeholder="Full Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* EMAIL */}
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* MOBILE */}
      <input
        placeholder="Mobile"
        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
      />

      {/* 🔥 GENDER + DOB (SIDE BY SIDE) */}
      <div className="RegGenderDobWrapper">
        <select
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value })
          }
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="Others">Others</option>
        </select>

        <input
          type="date"
          onChange={(e) =>
            setForm({ ...form, dob: e.target.value })
          }
        />
      </div>

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Create Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      {/* CONFIRM PASSWORD */}
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) =>
          setForm({ ...form, confirmPassword: e.target.value })
        }
      />
      <p className="switch-auth">
        Already registered?{" "}
        <span onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
      <button className="btn login-btn" onClick={handleRegister}>
        Register
      </button>

    </div>
    </>
);
}

export default Register;