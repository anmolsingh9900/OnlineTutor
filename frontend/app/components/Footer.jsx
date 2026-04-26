import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

return (
  <div className="footer">

    <div className="footer-container">

      {/* 🔹 COLUMN 1 - LOGO */}
      <div className="footer-col logo-col">
        <img src={logo} alt="logo" className="footer-logo" />
      </div>

      {/* 🔹 COLUMN 2 - NAV LINKS */}
      <div className="footer-col">
        <h3>Quick Links</h3>
        <span onClick={() => navigate("/")}>Home</span>
        <span onClick={() => navigate("/about")}>About Us</span>
        <span onClick={() => navigate("/contact")}>Contact Us</span>
        <span onClick={() => navigate("/terms")}>Terms & Conditions</span>
      </div>

      {/* 🔹 COLUMN 3 - INFO */}
      <div className="footer-col">
        <h3 className="AP">About Platform</h3>
        {/* STUDENTS */}
          <div className="FootAboutPlatform">
            <div> <h3>🎓 For Students</h3>
              <div>✔ Direct contact with tutors</div>
              <div>✔ Learn from expert tutors</div>
              <div>✔ Flexible timings</div>
            </div>

            <div><h3>👨‍🏫 For Tutors</h3>
              <div>✔ Earn by teaching online</div>
              <div>✔ Reach more students</div>
              <div>✔ No middleman</div>
            </div>
          </div>
      </div>

    </div>

    {/* 🔻 COPYRIGHT */}
    <p className="footer-copy">
      © 2026 Online Tutor Platform. All rights reserved.
    </p>

  </div>
);
}

export default Footer;