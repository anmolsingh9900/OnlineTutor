import slide1 from "../assets/sl1.png";
import slide2 from "../assets/sl2.png";
import slide3 from "../assets/sl3.png";
import slide4 from "../assets/sl4.png";
import slide5 from "../assets/sl5.png";
import slide6 from "../assets/sl6.png";
import "./Home.css";

// 🔥 Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // ✅ HOME PAGE - VISIBLE TO ALL USERS
  return (
    <div className="Slidecontainer">  
      {/* 🔥 SLIDER */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        loop={true}
        className="slider"
      >
        {[ 
          // 🎓 STUDENT 1
          { img: slide1, title: "Find the Perfect Tutor 🎓", desc: "Get matched with tutors based on your subject & needs" },

          // 👨‍🏫 TUTOR 1
          { img: slide2, title: "Share Your Knowledge 👨‍🏫", desc: "Teach students and earn with your expertise" },

          // 🎓 STUDENT 2
          { img: slide3, title: "Learn Anytime, Anywhere 📚", desc: "Flexible learning from the comfort of your home" },

          // 👨‍🏫 TUTOR 2
          { img: slide4, title: "Reach More Students 🌍", desc: "Expand your teaching reach without limitations" },

          // 🎓 STUDENT 3
          { img: slide5, title: "Affordable Learning 💰", desc: "Choose tutors that fit your budget" },

          // 👨‍🏫 TUTOR 3
          { img: slide6, title: "No Middleman 🚀", desc: "Direct connection with students, no commission cuts" }

        ].map((s, i) => (
          <SwiperSlide key={i}>
            <div
              className="slide"
              style={{
                backgroundImage: `url(${s.img})`
              }}
            >
              <div className="overlay">
                <h2>{s.title}</h2>
                <p>{s.desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="premium-section">

        <h1>Transform the Way You Learn & Teach</h1>
        <h2>🎓 Welcome to the Future of Education 🎓</h2>
        <p>
          Education is evolving rapidly, and so should the way we learn and teach.
          Our platform bridges the gap between students and tutors by creating a
          seamless, flexible, and direct learning ecosystem.
        </p>

        <p>
          Students often struggle to find the right tutor based on subject,
          availability, and affordability. At the same time, tutors face challenges
          in reaching the right students who value their knowledge.
        </p>

        <p>
          Traditional systems involve middlemen, lack flexibility, and fail to
          provide a unified platform. This leads to inefficiency, lack of trust,
          and missed learning opportunities.
        </p>

        <h1>Our Solution</h1>
        <h2>🚀 Connecting Students & Tutors Directly 🚀</h2>
        <p>
          Our Online Tutor Platform eliminates these challenges by connecting
          students and tutors directly — without any middleman.
        </p>

        <p>
          Tutors can create courses, set availability, and define their own fees,
          while students can easily explore and choose the best tutor for their needs.
        </p>

        <p>
          With upcoming features like payment integration, real-time chat,
          and tutor ratings after course completion, we ensure a transparent,
          scalable, and user-friendly experience.
        </p>

        {/* 🔥 FEATURES GRID */}
        <div className="features-grid">

          <div className="feature-box">
            <h3>🎓 For Students</h3>
            <p>✔ Find tutors easily</p>
            <p>✔ Learn anytime, anywhere</p>
            <p>✔ Affordable learning</p>
            <p>✔ Direct contact</p>
            <button
              className="btn"
              onClick={() =>
                !isLoggedIn ? (window.location.href = "/register?role=student") : <>
                  {() => {
                    if (role === "student") navigate("/student-dashboard");
                    if (role === "tutor") navigate("/tutor-dashboard");
                  }}
                </>
              }
            >
              {isLoggedIn ? "Go to Dashboard 🎓" : "Get Started Now 🚀"}
            </button>
          </div>

          <div className="feature-box">
            <h3>👨‍🏫 For Tutors</h3>
            <p>✔ Reach more students</p>
            <p>✔ Earn with skills</p>
            <p>✔ Flexible schedule</p>
            <p>✔ No middleman cuts</p>
            <button
              className="btn"
              onClick={() =>
                !isLoggedIn ? (window.location.href = "/register?role=tutor") : 
                <>
                  {() => {
                    if (role === "student") navigate("/student-dashboard");
                    if (role === "tutor") navigate("/tutor-dashboard");
                  }}
                </>
              }
            >
              {isLoggedIn ? "Go to Dashboard 👨‍🏫" : "Get Started Now 🚀"}
            </button>
          </div>

        </div>

        {/* 🔥 STATS */}
        <div className="stats-section">
          <div><h2>100+</h2><p>Students</p></div>
          <div><h2>10+</h2><p>Tutors</p></div>
          <div><h2>50+</h2><p>Courses</p></div>
          <div><h2>24/7</h2><p>Access</p></div>
        </div>
        <div className="stats-section"> 
          <h2>Let's increase these counts together!</h2>
        </div>

        {/* 🔥 TESTIMONIAL */}
        <div className="testimonial">
          <p>
            "Come and join us on this exciting journey to revolutionize education Whether you're a student eager to learn or a tutor passionate about teaching, our platform is designed to empower you. Together, we can create a vibrant learning community where knowledge flows freely and everyone has the opportunity to succeed."
          </p>

        </div>
      </div>  
    </div>
  );
}

export default Home;