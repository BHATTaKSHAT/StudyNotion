import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import studynotionlogo from "../assets/studynotionlogo.png"; // Make sure to import the logo
import "./CertificatePage.css";
import signature from "../assets/signature.png";
import { Download } from "lucide-react";

const CertificatePage = ({ courses }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef();

  const course = courses.find((c) => c._id === courseId);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!course) {
    return <div>Course not found or not completed.</div>;
  }

  const handleDownload = () => {
    if (certificateRef.current) {
      toPng(certificateRef.current)
        .then((dataUrl) => {
          saveAs(dataUrl, `${course.title}-certificate.png`);
        })
        .catch((err) => {
          console.error("Error generating certificate image:", err);
        });
    }
  };

  return (
    <div className="certificate-page">
      <div className="certificate-container" ref={certificateRef}>
        <div className="certificate-header">
          <img
            src={studynotionlogo}
            alt="Study Notion Logo"
            className="certificate-logo"
          />
          <h1>Certificate of Completion</h1>
        </div>
        <div className="certificate-border">
          <div className="certificate-content">
            <p className="presented-text">This is to certify that</p>
            <h2 className="student-name">{localStorage.getItem("username")}</h2>
            <p className="completion-text">
              has successfully completed the course
            </p>
            <img
              src={`http://localhost:5000/logos/${course.logo}`}
              alt={`${course.title} Logo`}
              className="course-logo-certificate"
            />
            <h3 className="course-title">{course.title}</h3>
            <p className="platform-text">
              through Study Notion E-Learning Platform
            </p>

            <div className="certificate-details">
              <p className="completion-date">Awarded on {formattedDate}</p>
              <p className="certificate-id">
                Certificate ID: {courseId.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="certificate-footer">
              <div className="inspiring-quote">
                <p className="quote-text">
                  "Education is not preparation for life; education is life
                  itself."
                </p>
                <p className="quote-author">- Akshat Bhatt</p>
              </div>
              <div className="signature-section">
                <div className="signature">
                  <img
                    src={signature}
                    alt="Signature"
                    className="signature-image"
                  />
                  <div className="signature-line"></div>
                  <div className="signature-info">
                    <p className="signature-name">Akshat Bhatt</p>
                    <p className="signature-title">Director of Education</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="certificate-actions">
        <button className="download-button" onClick={handleDownload}>
          <div className="download-content">
            <Download size={20} /> 
            <span>Download Certificate</span>
          </div>
        </button>
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CertificatePage;
