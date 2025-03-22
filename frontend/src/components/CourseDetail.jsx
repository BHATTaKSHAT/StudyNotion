import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseDetail.css";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [videoProgress, setVideoProgress] = useState(0);
  const [progressData, setProgressData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/progress", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProgressData(res.data))
        .catch((err) => console.error(err));
    }
  }, [token]);

  // Flatten lessons and quizzes
  const flattenedItems =
    course &&
    course.lessons.reduce((acc, lesson, index) => {
      acc.push({ type: "lesson", lessonIndex: index, title: lesson.title });
      if (lesson.quiz) {
        acc.push({
          type: "quiz",
          lessonIndex: index,
          title: `Quiz ${index + 1}`,
        });
      }
      return acc;
    }, []);

  const handleItemClick = (index) => {
    setCurrentItemIndex(index);
    setSelectedOption({});
    setQuizResults({});
  };

  const handlePrev = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      setSelectedOption({});
      setQuizResults({});
    }
  };

  const handleNext = () => {
    if (currentItemIndex < flattenedItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setSelectedOption({});
      setQuizResults({});
    } else {
      navigate("/dashboard");
    }
  };

  // Update progress based on YouTube video events via react-youtube
  const onPlayerStateChange = (event) => {
    // When the video is playing, you can start tracking progress
    if (event.data === window.YT.PlayerState.PLAYING) {
      const duration = event.target.getDuration();
      const currentTime = event.target.getCurrentTime();
      const progress = (currentTime / duration) * 100;
      setVideoProgress(progress);
      // If progress is over 90%, mark lesson as complete
      if (progress >= 90) {
        handleLessonCompletion();
      }
    }
    // Optionally, handle other states like PAUSED or ENDED too.
    if (event.data === window.YT.PlayerState.ENDED) {
      // Ensure completion on finished playing
      setVideoProgress(100);
      handleLessonCompletion();
    }
  };

  const handleLessonCompletion = () => {
    axios.post(
      "http://localhost:5000/api/progress/update",
      {
        courseId: id,
        lessonIndex: flattenedItems[currentItemIndex].lessonIndex,
        isQuiz: false,
        isCompleted: true,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const handleOptionSelect = (questionIndex, option) => {
    const lessonIndex = flattenedItems[currentItemIndex].lessonIndex;
    const isCorrect =
      course.lessons[lessonIndex].quiz.questions[questionIndex]
        .correctAnswer === option;
    setSelectedOption((prev) => ({ ...prev, [questionIndex]: option }));
    setQuizResults((prev) => ({ ...prev, [questionIndex]: isCorrect }));
  };

  useEffect(() => {
    if (!course || !flattenedItems) return;
    const lessonIndex = flattenedItems[currentItemIndex].lessonIndex;
    if (!course.lessons[lessonIndex].quiz) return;

    const totalQuestions = course.lessons[lessonIndex].quiz.questions.length;
    const allAnswered = Object.keys(quizResults).length === totalQuestions;
    const allCorrect = Object.values(quizResults).every(
      (result) => result === true
    );

    if (allAnswered && allCorrect) {
      axios.post(
        "http://localhost:5000/api/progress/update",
        {
          courseId: id,
          lessonIndex,
          isQuiz: true,
          isCompleted: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  }, [quizResults, course, flattenedItems, currentItemIndex, id, token]);

  if (!course || !flattenedItems) return <div>Loading...</div>;

  const currentItem = flattenedItems[currentItemIndex];
  const lessonData = course.lessons[currentItem.lessonIndex];

  return (
    <div className="course-detail">
      <div className="lesson-explorer">
        <h3>{course.title}</h3>
        <ul>
          {flattenedItems.map((item, index) => {
            let isCompleted = false;
            if (progressData) {
              const courseProgress = progressData.find(
                (p) => p.courseId._id === id
              );
              if (courseProgress) {
                if (item.type === "lesson") {
                  isCompleted = courseProgress.completedLessons.includes(
                    item.lessonIndex
                  );
                } else if (item.type === "quiz") {
                  isCompleted = courseProgress.completedQuizzes.includes(
                    item.lessonIndex
                  );
                }
              }
            }
            return (
              <li
                key={index}
                className={`${index === currentItemIndex ? "active" : ""} ${
                  isCompleted ? "completed" : ""
                }`}
                onClick={() => handleItemClick(index)}
              >
                {item.title}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="lesson-content">
        {currentItem.type === "lesson" ? (
          <>
            <h3>{lessonData.title}</h3>
            {lessonData.videos.map((video, idx) => (
              <YouTube
                key={idx}
                videoId={video.split("/").pop()}
                opts={{ width: "640", height: "360" }}
                onStateChange={onPlayerStateChange}
              />
            ))}
            <p>{lessonData.article}</p>
          </>
        ) : (
          lessonData.quiz && (
            <div className="quiz">
              <h4>{`Quiz for ${lessonData.title}`}</h4>
              {lessonData.quiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="question">
                  <p>{question.questionText}</p>
                  <ul>
                    {question.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={
                          selectedOption[qIndex] === option
                            ? quizResults[qIndex]
                              ? "correct"
                              : "incorrect"
                            : ""
                        }
                        onClick={() => handleOptionSelect(qIndex, option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )
        )}
        <div className="navigation-buttons">
          <button onClick={handlePrev} disabled={currentItemIndex === 0}>
            Previous
          </button>
          <button onClick={handleNext}>
            {currentItemIndex < flattenedItems.length - 1
              ? "Next"
              : "Go Back to Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
