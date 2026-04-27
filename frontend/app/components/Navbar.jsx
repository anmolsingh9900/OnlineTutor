import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const dropdownRef = useRef(null);

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role")?.toLowerCase();
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Check for unread messages
    const checkUnreadMessages = async () => {
      if (!isLoggedIn || !role) {
        setUnreadCount(0);
        return;
      }
      const email = localStorage.getItem("email");
      if (!email) {
        setUnreadCount(0);
        return;
      }

      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/chats/unread-count/${encodeURIComponent(email)}/${role}`;
        console.log("📡 Fetching unread count from:", apiUrl);
        const res = await axios.get(apiUrl);
        console.log("✅ Unread count response:", res.data);
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) {
        console.error("❌ Error fetching unread count:", err.message);
        console.error("Response:", err.response?.data);
        setUnreadCount(0);
      }
    };

    // Only start polling if user is logged in
    if (isLoggedIn && role) {
      checkUnreadMessages(); // Initial check
      const pollInterval = setInterval(checkUnreadMessages, 3000); // Poll every 3 seconds
      
      document.addEventListener("mousedown", handleClickOutside);
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        clearInterval(pollInterval);
      };
    } else {
      setUnreadCount(0);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isLoggedIn, role]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <img
            src={logo}
            alt="logo"
            className="logo"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          <div className="navbar-center">
            {!isLoggedIn ? (
              <>
              </>
            ) : (
              <>
                {/* Dashboard Button */}
                <button className="btn" onClick={() => {
                  if (role === "student") navigate("/student-dashboard");
                  if (role === "tutor") navigate("/tutor-dashboard");
                }}>
                  Dashboard
                </button>
              </>
            )}
            <button className="btn" onClick={() => navigate("/about")}>
              About Us
            </button>
            <button className="btn" onClick={() => navigate("/contact")}>
              Contact Us
            </button>
            <button className="btn" onClick={() => navigate("/terms")}>
              Terms & Conditions
            </button>
          </div>

          <div className="navbar-right">
            {!isLoggedIn ? (
              <>
                <button className="btn" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button className="btn" onClick={() => navigate("/register")}>
                  Register
                </button>
              </>
            ) : (
              <>
                <div 
                  className="profile-dropdown-container"
                  ref={dropdownRef}
                >
                  <button 
                    className={`user-info-btn ${showDropdown ? "active" : ""}`}
                    onClick={toggleDropdown}
                    title="Click to open profile menu"
                  >
                    <span className="UName">
                      {name}
                    </span>
                    <span className="URole">
                      ({role?.charAt(0).toUpperCase() + role?.slice(1)})
                    </span>
                    <span className={`dropdown-arrow ${showDropdown ? "rotate" : ""}`}>▼</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="profile-dropdown-menu">
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/myprofile");
                          closeDropdown();
                        }}
                      >
                        👤 My Profile
                      </button>

                      {role === "student" && (
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            navigate("/mypurchase");
                            closeDropdown();
                          }}
                        >
                          📚 My Purchase
                        </button>
                      )}

                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/chats");
                          closeDropdown();
                        }}
                      >
                        💬 My Chats
                      </button>

                      <div className="dropdown-divider"></div>

                      <button 
                        className="dropdown-item logout-item"
                        onClick={() => {
                          handleLogout();
                          closeDropdown();
                        }}
                      >
                        ⏻ Logout
                      </button>
                    </div>
                  )}
                </div>
                {/* Chat Icon */}
                <button
                  className="notification-bell"
                  onClick={() => {
                    navigate("/chats");
                  }}
                  title={unreadCount > 0 ? `You have ${unreadCount} unread messages` : "No new messages"}
                >
                  <h1>💬</h1>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Menu */}
        <button 
          className="hamburger-menu"
          onClick={() => setShowSidebar(!showSidebar)}
          title="Menu"
        >
          <span className={`hamburger-line ${showSidebar ? "open" : ""}`}></span>
          <span className={`hamburger-line ${showSidebar ? "open" : ""}`}></span>
          <span className={`hamburger-line ${showSidebar ? "open" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <>
          <div 
            className="sidebar-overlay"
            onClick={closeSidebar}
          ></div>
          <div className="sidebar-menu">
            {!isLoggedIn ? (
              <>
                {/* Navigation Links */}
                <button 
                  className="sidebar-item"
                  onClick={() => {
                    navigate("/about");
                    closeSidebar();
                  }}
                >
                  ℹ️ About Us
                </button>
                <button 
                  className="sidebar-item"
                  onClick={() => {
                    navigate("/contact");
                    closeSidebar();
                  }}
                >
                  📧 Contact Us
                </button>
                <button 
                  className="sidebar-item"
                  onClick={() => {
                    navigate("/terms");
                    closeSidebar();
                  }}
                >
                  📋 Terms & Conditions
                </button>

                <div className="sidebar-divider"></div>

                {/* Auth Buttons */}
                <button 
                  className="sidebar-item auth-btn"
                  onClick={() => {
                    navigate("/login");
                    closeSidebar();
                  }}
                >
                  🔑 Login
                </button>
                <button 
                  className="sidebar-item auth-btn"
                  onClick={() => {
                    navigate("/register");
                    closeSidebar();
                  }}
                >
                  📝 Register
                </button>
              </>
            ) : (
              <>
                {/* Dashboard */}
                <button 
                  className="sidebar-item"
                  onClick={() => {
                    if (role === "student") navigate("/student-dashboard");
                    if (role === "tutor") navigate("/tutor-dashboard");
                    closeSidebar();
                  }}
                >
                  📊 Dashboard
                </button>

                {/* Navigation Links */}
                <button 
                  className="sidebar-item"
                  onClick={() => {
                    navigate("/about");
                    closeSidebar();
                  }}
                >
                  ℹ️ About Us
                </button>
                <button 
                  className="sidebar-item"
                  onClick={() => {
                    navigate("/contact");
                    closeSidebar();
                  }}
                >
                  📧 Contact Us
                </button>
                <button 
                  className="sidebar-item"
                  onClick={() => {
                    navigate("/terms");
                    closeSidebar();
                  }}
                >
                  📋 Terms & Conditions
                </button>

                <div className="sidebar-divider"></div>

                {/* Profile Section */}
                <button 
                  className="sidebar-item"
                  onClick={() => {
                    navigate("/myprofile");
                    closeSidebar();
                  }}
                >
                  👤 My Profile
                </button>

                {role === "student" && (
                  <button 
                    className="sidebar-item"
                    onClick={() => {
                      navigate("/mypurchase");
                      closeSidebar();
                    }}
                  >
                    📚 My Purchase
                  </button>
                )}

                <button 
                  className="sidebar-item"
                  onClick={() => {
                    navigate("/chats");
                    closeSidebar();
                  }}
                >
                  💬 My Chats {unreadCount > 0 && <span className="unread-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                </button>

                <div className="sidebar-divider"></div>

                {/* Logout */}
                <button 
                  className="sidebar-item logout-btn"
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                >
                  ⏻ Logout
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
