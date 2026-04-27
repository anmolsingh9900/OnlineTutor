import "./Contact.css";

function Contact() {
  return (
    <div className="contact-wrapper">

      <div className="contact-card">

        {/* LEFT SIDE */}
        <div className="contact-info">
          <h2>Get in Touch 📞</h2>

          <p>
            Have questions or need help? We're here for you. Reach out to us
            anytime and we’ll get back to you as soon as possible.
          </p>

          <div className="info-item">
            <span>📧</span>
            <p>anmolsingh9900@gmail.com</p>
          </div>

          <div className="info-item">
            <span>📱</span>
            <p>+91 9431429905</p>
          </div>

          <div className="info-item">
            <span>📍</span>
            <p>JNU Campus, 
              New Mehrauli Road,
              Munirka, New Delhi, 
              110067,India</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="contact-form">
          <h2>Send Message ✉️</h2>

          <input placeholder="Your Name" />
          <input placeholder="Your Email" />
          <textarea placeholder="Your Message" rows="5"></textarea>

          <button className="btn contact-btn">
            Send Message 🚀
          </button>
        </div>

      </div>
    </div>
  );
}

export default Contact;