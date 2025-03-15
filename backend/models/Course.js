// models/course.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Quiz schema: used within a lesson (if needed)
const quizSchema = new Schema({
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true }, // or use index if you prefer
    },
  ],
});

// Lesson schema: each lesson has an article, videos, and an optional quiz
const lessonSchema = new Schema({
  title: { type: String, required: true },
  article: { type: String, required: true }, // formatted text (Markdown/HTML)
  videos: [{ type: String }], // URLs to videos
  quiz: quizSchema, // optional quiz
});

// Course schema: contains a list of lessons
const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  lessons: [lessonSchema],
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
