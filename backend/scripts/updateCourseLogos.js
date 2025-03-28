// filepath: c:\StudyNotion\backend\scripts\updateCourseLogos.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";

dotenv.config();

// Define a mapping from course titles to logo filenames.
// Adjust the keys based on your actual course titles.
const logoMapping = {
  "C#": "C_sharp.svg",
  "c++": "C++.svg",
  Go: "Go-Logo_Blue.svg",
  "HTML & CSS": "htmlcss.svg",
  Java: "java.svg",
  JavaScript: "javascript.svg",
  php: "new-php-logo.svg",
  Python: "python.svg",
  React: "react.svg",
  Rust: "rust-logo.png",
};

const updateCourseLogos = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`);
    console.log("Connected to MongoDB");

    // Fetch all courses from the database
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses`);

    // Loop through each course and update the logo if a mapping exists.
    for (const course of courses) {
      const mappedLogo = logoMapping[course.title];
      if (mappedLogo) {
        course.logo = mappedLogo;
        await course.save();
        console.log(
          `Updated course "${course.title}" with logo: ${mappedLogo}`
        );
      } else {
        console.log(`No logo mapping found for course "${course.title}"`);
      }
    }

    mongoose.connection.close();
    console.log("Logo update complete.");
  } catch (error) {
    console.error("Error updating course logos:", error);
    mongoose.connection.close();
  }
};

updateCourseLogos();
