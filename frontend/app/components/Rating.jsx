import { useState, useEffect } from "react";
import axios from "axios";
import "./Rating.css";

function Rating({ tutorEmail, tutorName, courseId, courseName, studentEmail, studentName, starsOnly = false, onClose = null, onSubmit = null }) {
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [tutorRatings, setTutorRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch student's existing rating and all tutor ratings
  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      // Get student's existing rating
      const myRatingRes = await axios.get(
        `http://localhost:5001/api/ratings/student/${encodeURIComponent(studentEmail)}/tutor/${encodeURIComponent(tutorEmail)}/course/${courseId}`
      );
      
      if (myRatingRes.data.rating) {
        setMyRating(myRatingRes.data.rating.rating);
        setMyReview(myRatingRes.data.rating.review);
      }

      // Get all tutor ratings
      const tutorRatingsRes = await axios.get(
        `http://localhost:5001/api/ratings/tutor/${encodeURIComponent(tutorEmail)}`
      );
      
      setTutorRatings(tutorRatingsRes.data.ratings || []);
      setAverageRating(tutorRatingsRes.data.averageRating || 0);
      setTotalRatings(tutorRatingsRes.data.totalRatings || 0);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const handleSubmitRating = async () => {
    if (myRating === 0) {
      if (onSubmit) onSubmit("Please select a rating", false);
      return;
    }

    try {
      setLoading(true);
      console.log("📤 Submitting rating with data:", {
        tutorEmail,
        tutorName,
        studentEmail,
        studentName,
        courseId,
        courseName,
        rating: myRating,
        review: myReview
      });

      const response = await axios.post("http://localhost:5001/api/ratings/submit-rating", {
        tutorEmail,
        tutorName,
        studentEmail,
        studentName,
        courseId,
        courseName,
        rating: myRating,
        review: myReview
      });

      console.log("✅ Rating submitted successfully:", response.data);
      setSubmitted(true);
      if (onSubmit) {
        onSubmit("✅ Rating submitted successfully!", true);
      } else {
        alert("✅ Rating submitted successfully!");
      }
      setTimeout(() => setSubmitted(false), 2000);
      
      // Refresh ratings
      await fetchRatings();
    } catch (err) {
      console.error("❌ Error submitting rating:", err);
      console.error("Response data:", err.response?.data);
      console.error("Full error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Error submitting rating";
      if (onSubmit) {
        onSubmit("❌ " + errorMsg, false);
      } else {
        alert("❌ " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count, onClick = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= count ? "filled" : ""}`}
            onClick={() => onClick && onClick(star)}
            style={{ cursor: onClick ? "pointer" : "default" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={`rating-container ${starsOnly ? 'rating-stars-only' : ''}`}>
      {starsOnly ? (
        // COMPACT STARS-ONLY MODE
        <div className="rating-section-compact">
          <h3>⭐ Rate This Tutor</h3>
          
          <div className="rating-input-compact">
            <div className="rating-stars-compact">
              {renderStars(myRating, setMyRating)}
              <span className="rating-value-compact">{myRating > 0 ? `${myRating}/5` : "Select rating"}</span>
            </div>

            <button
              className="btn submit-rating-btn-compact"
              onClick={handleSubmitRating}
              disabled={loading || myRating === 0}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            {submitted && <p className="success-msg">✅ Rating submitted!</p>}
          </div>
        </div>
      ) : (
        // FULL MODE WITH REVIEWS
        <>
          <div className="rating-section">
            <h3>⭐ Rate This Tutor</h3>
            
            <div className="rating-input">
              <div className="rating-stars">
                {renderStars(myRating, setMyRating)}
                <span className="rating-value">{myRating > 0 ? `${myRating}/5` : "Select rating"}</span>
              </div>

              <textarea
                className="review-input"
                placeholder="Share your experience with this tutor (optional)"
                value={myReview}
                onChange={(e) => setMyReview(e.target.value)}
                maxLength={300}
              />

              <button
                className="btn submit-rating-btn"
                onClick={handleSubmitRating}
                disabled={loading || myRating === 0}
              >
                {loading ? "Submitting..." : "Submit Rating"}
              </button>

              {submitted && <p className="success-msg">✅ Rating submitted!</p>}
            </div>
          </div>

          {/* Show tutor's overall ratings */}
          <div className="tutor-ratings-section">
            <h3>📊 Tutor Ratings</h3>
            
            <div className="overall-rating">
              <div className="rating-stats">
                <div className="average-rating">
                  <span className="big-star">★</span>
                  <div>
                    <p className="average-value">{averageRating.toFixed(1)}</p>
                    <p className="rating-text">out of 5</p>
                  </div>
                </div>
                <p className="total-ratings">Based on {totalRatings} rating{totalRatings !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Individual ratings */}
            <div className="individual-ratings">
              {tutorRatings.length === 0 ? (
                <p className="no-ratings">No ratings yet</p>
              ) : (
                tutorRatings.map((rating, idx) => (
                  <div key={idx} className="rating-item">
                    <div className="rating-header">
                      <span className="student-name">{rating.studentName}</span>
                      <div className="rating-stars-small">
                        {renderStars(rating.rating)}
                      </div>
                    </div>
                    {rating.review && <p className="review-text">{rating.review}</p>}
                    <p className="rating-date">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Rating;
