import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";

dotenv.config();

const quizData = {
  Methods: {
    questions: [
      {
        questionText: "What is the purpose of a method in C#?",
        options: [
          "To store data",
          "To perform a specific task or operation",
          "To define a class",
          "To create a variable",
        ],
        correctAnswer: "To perform a specific task or operation",
      },
      {
        questionText: "Which keyword is used to define a method in C#?",
        options: ["method", "function", "void", "def"],
        correctAnswer: "void",
      },
    ],
  },
};

const updateCSharpMethodsQuiz = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`);
    console.log("Connected to MongoDB");

    const course = await Course.findOne({ title: "C#" });

    if (!course) {
      console.log(`Course "C#" not found`);
      return;
    }

    const lesson = course.lessons.find((l) => l.title === "Methods");

    if (lesson) {
      lesson.quiz = quizData["Methods"];
      console.log(`Updated quiz for "C#" - "Methods"`);
    } else {
      console.log(`Lesson "Methods" not found in course "C#"`);
    }

    await course.save();
    console.log(`Saved updates for course "C#"`);
  } catch (error) {
    console.error("Error updating quiz:", error);
  } finally {
    mongoose.disconnect();
  }
};

updateCSharpMethodsQuiz();
