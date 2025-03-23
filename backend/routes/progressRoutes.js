import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

const router = express.Router();

// Update progress for a course
router.post("/update", protect, async (req, res) => {
  const { courseId, lessonIndex, isQuiz, isCompleted } = req.body;

  try {
    const user = await User.findById(req.user._id);

    let courseProgress = user.progress.find(
      (progress) => progress.courseId.toString() === courseId
    );

    if (!courseProgress) {
      courseProgress = { courseId, completedLessons: [], completedQuizzes: [] };
      user.progress.push(courseProgress);
    }

    if (isQuiz) {
      if (
        isCompleted &&
        !courseProgress.completedQuizzes.includes(lessonIndex)
      ) {
        courseProgress.completedQuizzes.push(lessonIndex);
      }
    } else {
      if (
        isCompleted &&
        !courseProgress.completedLessons.includes(lessonIndex)
      ) {
        courseProgress.completedLessons.push(lessonIndex);
        // Set lastWatched to null (or any default value) for the completed lesson
        if (
          courseProgress.lastWatched &&
          courseProgress.lastWatched.lessonIndex === lessonIndex
        ) {
          courseProgress.lastWatched = null;
        }
        if (courseProgress.lastWatchedIndex) {
          courseProgress.lastWatchedIndex =
            courseProgress.lastWatchedIndex.filter(
              (entry) => entry.lessonIndex !== lessonIndex
            );
        }
      }
    }

    await user.save();
    res.json({ message: "Progress updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/update-resume", protect, async (req, res) => {
  const { courseId, lessonIndex, timestamp, videoDuration } = req.body;

  try {
    const user = await User.findById(req.user._id);

    let courseProgress = user.progress.find(
      (p) => p.courseId.toString() === courseId
    );

    // If no progress exists, create one
    if (!courseProgress) {
      courseProgress = {
        courseId,
        completedLessons: [],
        completedQuizzes: [],
        lastWatched: null,
        lastWatchedIndex: [],
      };
      user.progress.push(courseProgress);
    }

    // If the lesson is already completed, do not update the resume timestamp
    if (courseProgress.completedLessons.includes(lessonIndex)) {
      return res.json({
        message: "Lesson already completed, resume not updated",
      });
    }

    // Check if the video has reached 90% progress
    //const videoDuration = 100; // Assume the video duration is normalized to 100 for simplicity
    const progress = (timestamp / videoDuration) * 100;

    if (progress >= 90) {
      // Mark the lesson as completed
      if (!courseProgress.completedLessons.includes(lessonIndex)) {
        courseProgress.completedLessons.push(lessonIndex);
      }

      // Clear lastWatched and remove related data from lastWatchedIndex
      if (courseProgress.lastWatched?.lessonIndex === lessonIndex) {
        courseProgress.lastWatched = null;
      }
      courseProgress.lastWatchedIndex = courseProgress.lastWatchedIndex.filter(
        (entry) => entry.lessonIndex !== lessonIndex
      );
    } else {
      // Update lastWatched
      courseProgress.lastWatched = { lessonIndex, timestamp };

      // Update or add to lastWatchedIndex
      const entryIndex = courseProgress.lastWatchedIndex.findIndex(
        (entry) => entry.lessonIndex === lessonIndex
      );

      if (entryIndex !== -1) {
        courseProgress.lastWatchedIndex[entryIndex].timestamp = timestamp;
      } else {
        courseProgress.lastWatchedIndex.push({ lessonIndex, timestamp });
      }
    }

    await user.save();
    res.json({ message: "Resume point updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch progress for all courses
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "progress.courseId"
    );
    res.json(user.progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get resume point for a course
router.get("/resume/:courseId", protect, async (req, res) => {
  const { courseId } = req.params;

  try {
    console.log("Fetching course:", courseId);
    const user = await User.findById(req.user._id).populate("progress.courseId");
    const course = await Course.findById(courseId);

    if (!course) {
      console.log("Course not found");
      return res.status(404).json({ message: "Course not found" });
    }
    console.log("Course found:", course.title);
    console.log("User progress:", user.progress);

    const resumePoint = user.getResumePoint(course);

    if (!resumePoint) {
      console.log("User has completed all lessons and quizzes.");
      return res.json({ message: "All lessons and quizzes completed!" });
    }

    console.log("Resume Point:", resumePoint);
    res.json(resumePoint);
  } catch (err) {
    console.error("Error in resume route:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
