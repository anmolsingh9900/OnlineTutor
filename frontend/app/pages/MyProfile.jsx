import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { usePopup, PopupProvider } from "../components/Popup";
import "./MyProfile.css";

function MyProfile() {
  const navigate = useNavigate();
  const { popup, showAlert, closePopup } = usePopup();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  const email = localStorage.getItem("email");

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!email) {
        setLoading(false);
        return;
      }
      
      const encodedEmail = encodeURIComponent(email);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile/${encodedEmail}`);
      
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        mobile: res.data.mobile || "",
        gender: res.data.gender || "",
        dob: res.data.dob || "",
        role: res.data.role || "",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      showAlert("Failed to load profile ❌", "❌ Error");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [email, navigate, fetchProfile]);

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.mobile.trim()) return "Mobile is required";
    if (!form.gender) return "Gender is required";
    if (!form.dob) return "Date of Birth is required";

    // Mobile validation (10 digits)
    if (!/^[0-9]{10}$/.test(form.mobile))
      return "Mobile must be 10 digits";

    // Password validation (only if password is being changed)
    if (form.password) {
      if (form.password.length < 6)
        return "Password must be at least 6 characters";

      if (form.password !== form.confirmPassword)
        return "Passwords do not match";
    }

    return null;
  };

  const handleSave = async () => {
    const error = validateForm();

    if (error) {
      showAlert(error + " ❌", "❌ Validation Error");
      return;
    }

    try {
      const updateData = {
        name: form.name,
        mobile: form.mobile,
        gender: form.gender,
        dob: form.dob
      };

      // Only include password if user wants to change it
      if (form.password) {
        updateData.password = form.password;
      }

      const encodedEmail = encodeURIComponent(email);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/profile/${encodedEmail}`,
        updateData
      );

      // Update localStorage with new name if changed
      if (form.name !== localStorage.getItem("name")) {
        localStorage.setItem("name", form.name);
      }

      showAlert("Profile updated successfully ✅", "✅ Updated");
      setIsEditing(false);
      setForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      showAlert("Failed to update profile ❌", "❌ Update Failed");
    }
  };

  const handleCancel = () => {
    fetchProfile(); // Reset form
    setIsEditing(false);
  };

  if (loading) {
    return <div className="profile-container"><p>Loading profile...</p></div>;
  }

  // Show error if no name is loaded
  if (!form.name) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p style={{color: 'red', textAlign: 'center', fontSize: '18px', marginTop: '20px'}}>
            Failed to load profile data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PopupProvider popup={popup} closePopup={closePopup} />
      
      <div className="profile-container">
        <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {form.role === "student" && "🎓"}
            {form.role === "tutor" && "👨‍🏫"}
          </div>
          <div className="profile-header-content">
            <h2>My Profile</h2>
            <p className="profile-role">
              ({form.role.charAt(0).toUpperCase() + form.role.slice(1)})
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          {!isEditing ? (
            // DISPLAY MODE
            <>
              <div className="profile-field">
                <label>👤 Name</label>
                <p>{form.name}</p>
              </div>

              <div className="profile-field">
                <label>📧 Email</label>
                <p>{form.email}</p>
              </div>

              <div className="profile-field">
                <label>📱 Mobile</label>
                <p>{form.mobile}</p>
              </div>

              <div className="profile-field">
                <label>⚧ Gender</label>
                <p>{form.gender.charAt(0).toUpperCase() + form.gender.slice(1)}</p>
              </div>

              <div className="profile-field">
                <label>🎂 Date of Birth</label>
                <p>{form.dob ? new Date(form.dob).toLocaleDateString() : "Not provided"}</p>
              </div>

              <div className="profile-actions">
                <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </button>
              </div>
            </>
          ) : (
            // EDIT MODE
            <>
              <div className="profile-form-group">
                <label>👤 Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                />
              </div>

              <div className="profile-form-group">
                <label>📧 Email</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  placeholder="Email (cannot change)"
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="profile-form-group">
                <label>📱 Mobile</label>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="profile-form-group">
                <label>⚧ Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="profile-form-group">
                <label>🎂 Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                />
              </div>

              <hr className="profile-divider" />

              <div className="profile-form-group">
                <label>🔒 New Password (optional)</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave empty to keep current password"
                />
              </div>

              <div className="profile-form-group">
                <label>🔒 Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="profile-actions">
                <button className="btn save-btn" onClick={handleSave}>
                  💾 Save Changes
                </button>
                <button className="btn cancel-btn" onClick={handleCancel}>
                  ❌ Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default MyProfile;
