import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [player, setPlayer] = useState(null);


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

  const queryParams = new URLSearchParams(location.search);
  const initialLessonIndex = queryParams.get("lesson");
  const initialQuizIndex = queryParams.get("quiz");
  const [appliedResume, setAppliedResume] = useState(false);

  useEffect(() => {
    if (!course || !flattenedItems) return;

    if (initialLessonIndex) {
      const lessonIndex = parseInt(initialLessonIndex, 10);
      const lessonItemIndex = flattenedItems.findIndex(
        (item) => item.type === "lesson" && item.lessonIndex === lessonIndex
      );
      if (lessonItemIndex !== -1) {
        setCurrentItemIndex(lessonItemIndex);
        setAppliedResume(true);
        // Remove query params from URL
        navigate(`/course/${id}`, { replace: true });
      }
    } else if (initialQuizIndex) {
      const quizIndex = parseInt(initialQuizIndex, 10);
      const quizItemIndex = flattenedItems.findIndex(
        (item) => item.type === "quiz" && item.lessonIndex === quizIndex
      );
      if (quizItemIndex !== -1) {
        setCurrentItemIndex(quizItemIndex);
        setAppliedResume(true);
        // Remove query params from URL
        navigate(`/course/${id}`, { replace: true });
      }
    }
  }, [flattenedItems, initialLessonIndex, initialQuizIndex]);

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
   if (!event || !event.target) return;

   const duration = event.target.getDuration();
   const currentTime = event.target.getCurrentTime();
   const progress = (currentTime / duration) * 100;

   if (event.data === window.YT.PlayerState.PLAYING) {
     setVideoProgress(progress);

     // If progress is over 90%, mark lesson as complete
     if (progress >= 90) {
       handleLessonCompletion();
     }
   }

   if (event.data === window.YT.PlayerState.PAUSED) {
     // Update resume point only if progress is less than 90%
     if (progress < 90) {
       updateResume(currentTime);
     }
   }

   if (event.data === window.YT.PlayerState.ENDED) {
     // Ensure completion on finished playing
     setVideoProgress(100);
     handleLessonCompletion();
   }
 };

  const updateResume = (currentTime, duration) => {
    axios.post(
      "http://localhost:5000/api/progress/update-resume",
      {
        courseId: id,
        lessonIndex: flattenedItems[currentItemIndex].lessonIndex,
        timestamp: currentTime,
        videoDuration: duration,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const handleLessonCompletion = () => {
    const lessonIndex = flattenedItems[currentItemIndex].lessonIndex;

    axios
      .post(
        "http://localhost:5000/api/progress/update",
        {
          courseId: id,
          lessonIndex,
          isQuiz: false,
          isCompleted: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        // Update local progressData so that the completed lesson is marked complete
        setProgressData((prevProgress) => {
          if (!prevProgress) return prevProgress;

          const newProgress = prevProgress.map((progress) => {
            if (progress.courseId._id === id) {
              // Add the lesson to completedLessons
              if (!progress.completedLessons.includes(lessonIndex)) {
                progress.completedLessons.push(lessonIndex);
              }

              // Clear lastWatched and remove related data from lastWatchedIndex
              if (progress.lastWatched?.lessonIndex === lessonIndex) {
                progress.lastWatched = null;
              }
              progress.lastWatchedIndex = progress.lastWatchedIndex.filter(
                (entry) => entry.lessonIndex !== lessonIndex
              );
            }
            return progress;
          });

          return newProgress;
        });
      })
      .catch((err) => console.error("Error marking lesson complete:", err));
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

  const currentProgress =
    progressData && progressData.find((p) => p.courseId._id === id);

  // Determine the current lesson index from the current item
  const currentLessonIndex = flattenedItems[currentItemIndex].lessonIndex;

  // Do not use resumeTime if the lesson is already marked completed
  const isCurrentLessonCompleted =
    currentProgress &&
    currentProgress.completedLessons.includes(currentLessonIndex);

  let resumeTime = 0;
  if (!isCurrentLessonCompleted && currentProgress) {
    if (
      currentProgress.lastWatched &&
      currentProgress.lastWatched.lessonIndex === currentLessonIndex
    ) {
      resumeTime = currentProgress.lastWatched.timestamp;
    } else if (currentProgress.lastWatchedIndex?.length) {
      // Filter only those resume entries for the current lesson
      const lessonResumes = currentProgress.lastWatchedIndex.filter(
        (entry) => entry.lessonIndex === currentLessonIndex
      );
      if (lessonResumes.length > 0) {
        resumeTime = lessonResumes[lessonResumes.length - 1].timestamp;
      }
    }
  }

  const onPlayerReady = (event) => {
     setPlayer(event.target);
     console.log("onPlayerReady resumeTime:", resumeTime);
     if (resumeTime > 0) {
       event.target.seekTo(resumeTime, true);
     }
  };

  // const handleVideoClick = () => {
  //   if (player && resumeTime > 0) {
  //     player.seekTo(resumeTime, true);
  //     player.playVideo();
  //   }
  // };

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
                  key={`${currentItem.lessonIndex}-${idx}`}
                  videoId={video.split("/").pop()}
                  opts={{
                    width: "640",
                    height: "360",
                    playerVars: { start: resumeTime }
                  }}
                  onReady={onPlayerReady}
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
