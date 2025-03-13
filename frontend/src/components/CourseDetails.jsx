import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`
        );
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course details", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  const handleVideoError = (e) => {
    console.error("Error playing video:", e);
  };

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <div>
        <p>{course.content}</p>
      </div>
      <iframe src={course.videoUrl} controls onError={handleVideoError}></iframe>
    </div>
  );
};

export default CourseDetails;
