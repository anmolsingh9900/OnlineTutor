import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { usePopup, PopupProvider } from "./Popup";
import "./StudentDashboard.css";
import "./RunningBanner.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [tutorRatings, setTutorRatings] = useState({});
  const { popup, showAlert, showConfirm, closePopup } = usePopup();
  const studentEmail = localStorage.getItem("email");
  const studentName = localStorage.getItem("name");

  // Get promo comment based on rating
  const getPromoComment = (rating) => {
    if (rating >= 4.5) return "🏆 Highly Recommended by Students";
    if (rating >= 4) return "⭐ Excellent Tutor";
    if (rating >= 3.5) return "👍 Good Reviews";
    if (rating >= 3) return "📚 Average Ratings";
    if (rating >= 2) return "⚠️ Mixed Reviews";
    return "👀 New on Platform";
  };

  // Get color for rating badge
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "#d4af37"; // Gold
    if (rating >= 4) return "#4CAF50"; // Green
    if (rating >= 3.5) return "#2196F3"; // Blue
    if (rating >= 3) return "#FF9800"; // Orange
    if (rating >= 2) return "#FF5252"; // Red
    return "#9E9E9E"; // Gray
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/courses`)
      .then((res) => {
        setCourses(res.data);
        // Fetch ratings for all tutors
        res.data.forEach(course => {
          axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/ratings/tutor/${course.tutorEmail}`)
            .then((ratingRes) => {
              setTutorRatings(prev => ({
                ...prev,
                [course.tutorEmail]: ratingRes.data
              }));
            })
            .catch((err) => {
              // Error handled silently
            });
        });
      })
      .catch((err) => {
        // Error handled silently
      });
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x150?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
  };

  const startChat = (c) => {
    // Pass course and tutor info via navigation state
    navigate("/chats", { state: { course: c } });
  };

  const handlePurchase = async (course) => {
    try {
      if (!studentEmail) {
        showAlert("Please login to purchase courses", "⚠️ Login Required");
        return;
      }

      // Confirmation popup
      const confirmed = await showConfirm(
        `Course: ${course.name}\nTutor: ${course.tutorName}\nFee: ₹${course.fee}\n\nDo you want to proceed with this purchase?`,
        `🛒 Confirm Purchase`
      );

      if (!confirmed) {
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/purchase`, {
        email: studentEmail,
        courseId: course._id || course.name,
        courseName: course.name,
        tutorName: course.tutorName,
        tutorEmail: course.tutorEmail,
        fee: course.fee
      });

      showAlert(`${course.name} purchased successfully!`, "✅ Purchase Successful");
      navigate("/mypurchase");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to purchase course";
      showAlert(errorMsg, "❌ Purchase Failed");
    }
  };

  return (
    <>
      <PopupProvider popup={popup} closePopup={closePopup} />
      
      {/* Running Text Banner */}
      <div className="RunningTextBanner StudentBanner">
        <div className="RunningTextContent">
          <span>🛡️ Secure Your Payment By Us 🛡️</span>
          <span className="separator"></span>
          <span>💎 Payment Transfer To Tutor Only After Course Completion💎</span>
          <span className="separator"></span>
          <span>⭐ Rate Your Tutor & Help Others ⭐</span>
          <span className="separator"></span>
          <span>🛡️ Secure Your Payment By Us 🛡️</span>
          <span className="separator"></span>
          <span>💎 Payment Transfer To Tutor Only After Course Completion💎</span>
          <span className="separator"></span>
          <span>⭐ Rate Your Tutor & Help Others ⭐</span>
        </div>
      </div>
      
      <div className="StudentDBContainer">
        <h2>Available Courses</h2>

        <div className="StudentDBGrid">
          {courses.map((c, i) => (
            <div key={i} className="StudentDBGridCourseCard">

              {/* ✅ COURSE IMAGE */}
              <img
                src={getImageUrl(c.image)}
                alt="course"
                className="StudentDBCourseImg"
              />

              {/* 2-COLUMN LAYOUT: Course Info + Tutor Details */}
              <div className="StudentDBInfoContainer">
                {/* Left Column: Course Name & Description */}
                <div className="StudentDBLeftColumn">
                  <h3>{c.name}</h3>
                  <p className="StudentDBCourseDesc">{c.about}</p>
                </div>

                {/* Divider Line */}
                <div className="StudentDBColumnDivider"></div>

                {/* Right Column: Tutor Info */}
                <div className="StudentDBRightColumn">
                  <p><b>👨‍🏫 Tutor:</b> {c.tutorName}</p>
                  <p><b>⏰ Time:</b> {c.time}</p>
                  <p><b>💰 Fee:</b> ₹{c.fee}</p>
                </div>
              </div>

              {/* ⭐ TUTOR RATING WITH COLOR & PROMO */}
              <div className="StudentDBRatingSection">
                {tutorRatings[c.tutorEmail]?.totalRatings > 0 ? (
                  <>
                    {/* Row 1: Colored Stars + Numeric Rating + Count */}
                    <div className="StudentDBRatingRow1">
                      <div className="StudentDBColoredStars">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i}
                            style={{ 
                              color: i < Math.round(tutorRatings[c.tutorEmail].averageRating) 
                                ? getRatingColor(tutorRatings[c.tutorEmail].averageRating)
                                : '#ddd'
                            }}
                            className="StudentDBStar"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="StudentDBRatingNumeric">
                        {tutorRatings[c.tutorEmail].averageRating.toFixed(1)}/5
                      </span>
                      <span className="StudentDBRatingCount">
                        {tutorRatings[c.tutorEmail].totalRatings} {tutorRatings[c.tutorEmail].totalRatings === 1 ? 'rating' : 'ratings'}
                      </span>
                    </div>
                    
                    {/* Row 2: Promo Comment */}
                    <p className="StudentDBRatingPromo">
                      {getPromoComment(tutorRatings[c.tutorEmail].averageRating)}
                    </p>
                  </>
                ) : (
                  <div className="StudentDBRatingPromoNew">
                    <p>⭐ New on Platform</p>
                    <p className="StudentDBRatingPromoNewSub">Be the first to rate this tutor!</p>
                  </div>
                )}
              </div>

              {/* 2 Action Buttons */}
              <div className="StudentDBActionBtns">
                <button className="btn StudentDBChatBtn" onClick={() => startChat(c)}>
                  💬 Chat
                </button>
                <button className="btn StudentDBPayBtn" onClick={() => handlePurchase(c)}>
                  💳 Pay Now
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;