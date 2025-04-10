import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";

dotenv.config();

const courseDescriptions = {
  Python:
    "Learn Python, a versatile programming language used for web development, data analysis, artificial intelligence, and more.",
  JavaScript:
    "Master JavaScript, the language of the web, to build interactive websites and dynamic web applications.",
  Java: "Explore Java, a powerful and widely-used programming language for building enterprise-level applications and Android apps.",
  php: "Dive into PHP, a server-side scripting language designed for web development and creating dynamic websites.",
  "C++":
    "Understand C++, a high-performance programming language used for system software, game development, and competitive programming.",
  React:
    "Learn React, a popular JavaScript library for building user interfaces and single-page applications.",
  "C#": "Discover C#, a modern programming language used for developing Windows applications, games, and enterprise software.",
  Go: "Get started with Go (Golang), a fast and efficient programming language designed for scalable and reliable software.",
  Rust: "Learn Rust, a systems programming language focused on safety, speed, and concurrency, ideal for performance-critical applications.",
  "HTML & CSS":
    "Master HTML and CSS, the foundational technologies for creating and styling web pages.",
};

const updateCourseDescriptions = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`);
    console.log("Connected to MongoDB");

    for (const [title, description] of Object.entries(courseDescriptions)) {
      const course = await Course.findOne({ title });
      if (course) {
        course.description = description;
        await course.save();
        console.log(`Updated description for course: ${title}`);
      } else {
        console.log(`Course not found: ${title}`);
      }
    }

    mongoose.connection.close();
    console.log("Course descriptions updated successfully.");
  } catch (error) {
    console.error("Error updating course descriptions:", error);
    mongoose.connection.close();
  }
};

updateCourseDescriptions();
