import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Rating from "../components/Rating";
import { usePopup, PopupProvider } from "../components/Popup";
import "./MyPurchase.css";

function MyPurchase() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState(null);
  const { popup, showAlert, showConfirm, showModal, closePopup } = usePopup();

  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      if (!email) {
        setLoading(false);
        return;
      }

      const encodedEmail = encodeURIComponent(email);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/purchases/${encodedEmail}`);
      
      setPurchases(res.data.purchasedCourses || []);
    } catch (err) {
      console.error("Error fetching purchases:", err.response?.status, err.response?.data || err.message);
      // Don't call showAlert here - it will be called in useEffect if needed
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    if (role !== "student") {
      showAlert("⚠️ Only students can view purchases", "⚠️ Access Denied");
      navigate("/");
      return;
    }

    fetchPurchases();
  }, [email, role, navigate, fetchPurchases]);

  const handleRateClick = (purchase) => {
    setRatingModal({
      tutorEmail: purchase.tutorEmail,
      tutorName: purchase.tutorName,
      courseId: purchase.courseId,
      courseName: purchase.courseName
    });
    
    // Show modal with Rating component
    showModal(
      <Rating
        tutorEmail={purchase.tutorEmail}
        tutorName={purchase.tutorName}
        courseId={purchase.courseId}
        courseName={purchase.courseName}
        studentEmail={email}
        studentName={name}
        starsOnly={true}
        onSubmit={(message, success) => {
          closePopup();
          showAlert(message, success ? "✅ Success" : "❌ Error");
        }}
      />,
      `⭐ Rate ${purchase.tutorName}`,
      { size: 'small' }
    );
  };

  if (loading) {
    return <div className="purchase-container"><p className="loading-text">Loading your purchases...</p></div>;
  }

  return (
    <>
      <PopupProvider popup={popup} closePopup={closePopup} />
      
      <div className="purchase-container">
        <div className="purchase-header">
          <h1>📚 My Purchases</h1>
          <p>View all courses you've enrolled in</p>
        </div>

        {purchases.length === 0 ? (
          <div className="no-purchases">
            <p className="empty-message">😔 You haven't purchased any courses yet</p>
            <button 
              className="btn explore-btn"
              onClick={() => navigate("/")}
            >
              🔍 Explore Courses
            </button>
          </div>
        ) : (
          <div className="purchases-grid">
            {purchases.map((purchase, index) => (
              <div key={index} className="purchase-card">
                <div className="purchase-card-header">
                  <h3>{purchase.courseName}</h3>
                  <span className="purchase-badge">✓ Purchased</span>
                </div>

                <div className="purchase-details">
                  <div className="detail-item">
                    <span className="label">👨‍🏫 Tutor:</span>
                    <span className="value">{purchase.tutorName}</span>
                  </div>

                  <div className="detail-item">
                    <span className="label">💰 Fee:</span>
                    <span className="value">₹{purchase.fee}</span>
                  </div>

                  <div className="detail-item">
                    <span className="label">📅 Purchased On:</span>
                    <span className="value">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="purchase-actions">
                  <button 
                    className="btn contact-btn"
                    onClick={() => navigate('/chats', {
                      state: {
                        course: {
                          _id: purchase.courseId,
                          name: purchase.courseName,
                          tutorEmail: purchase.tutorEmail,
                          tutorName: purchase.tutorName
                        }
                      }
                    })}
                  >
                    💬 Contact Tutor
                  </button>

                  <button 
                    className="btn rating-btn"
                    onClick={() => handleRateClick(purchase)}
                  >
                    ⭐ Rate Tutor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyPurchase;
