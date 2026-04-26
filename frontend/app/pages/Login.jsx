import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { usePopup, PopupProvider } from "../components/Popup";
import logo from "../assets/logo.png";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const { popup, showAlert, closePopup } = usePopup();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/users/login",
        form
      );

      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);   // ✅ store name
      localStorage.setItem("email", res.data.email); // ✅ store email
      localStorage.setItem("isLoggedIn", "true");

      await showAlert("Login Successful ✅", "✅ Welcome");
      navigate("/");

    } catch (err) {
      showAlert("Invalid credentials ❌", "❌ Login Failed");
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

      <h2>Welcome Back 👋</h2>

      {userInfo && (
        <div className="login-preview">
          <h3>
            {userInfo.role === "student" && "🎓"}
            {userInfo.role === "tutor" && "👨‍🏫"} {userInfo.name}
          </h3>
          <p>
            You are registered as{" "}
            <b>
              {userInfo.role.charAt(0).toUpperCase() +
                userInfo.role.slice(1)}
            </b>
          </p>
        </div>
      )}

      <input
        placeholder="Email"
        onChange={async (e) => {
          const email = e.target.value;
          setForm({ ...form, email });

          if (email.length > 5) {
            try {
              const res = await axios.post(
                "http://localhost:5001/api/users/get-user",
                { email }
              );
              setUserInfo(res.data);
            } catch {
              setUserInfo(null);
            }
          }
        }}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />
      <p className="switch-auth">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/register")}>
          Register
        </span>
      </p>
      <button className="btn login-btn" onClick={handleLogin}>
        Login
      </button>

      </div>
    </>
);
}

export default Login;