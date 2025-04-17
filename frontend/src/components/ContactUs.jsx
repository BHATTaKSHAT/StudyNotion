import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-us-page">
      <div className="contact-container">
        {/* Left Section: Google Map */}
        <div className="map-container">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.41941548468132!3d37.77492977975971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f0e6b1b1%3A0x4c7b8f1e0c8e9b0!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Right Section: Contact Form and Ideas */}
        <div className="contact-details">
          <h1>Contact Us</h1>
          <p>
            Have questions or need assistance? Feel free to reach out to us
            using the form below or through our contact details.
          </p>

          <form className="contact-form">
            <input
              type="text"
              placeholder="Your Name"
              required
              className="form-input"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className="form-input"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              required
              className="form-textarea"
            ></textarea>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>

          <div className="contact-info">
            <h3>Our Contact Details</h3>
            <p>Email: support@studynotion.com</p>
            <p>Phone: +91 9350090734</p>
            <p>Address: StudyNotion Hq, Chandigarh, India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
