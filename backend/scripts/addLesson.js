import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";

dotenv.config();

const addLessons = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`);
    const courseId = "67d4292204b2cba93e76d3b3";

    const newLessons = [
      {
        title: "New Lesson 1",
        article: "Content for new lesson 1.",
        videos: ["http://example.com/video1.mp4"],
      },
      {
        title: "New Lesson 2",
        article: "Content for new lesson 2.",
        videos: ["http://example.com/video2.mp4"],
      },
      {
        title: "New Lesson 3",
        article: "Content for new lesson 3.",
        videos: ["http://example.com/video3.mp4"],
      },
      {
        title: "New Lesson 4",
        article: "Content for new lesson 4.",
        videos: ["http://example.com/video4.mp4"],
      },
      {
        title: "New Lesson 5",
        article: "Content for new lesson 5.",
        videos: ["http://example.com/video2.mp4"],
      },
      {
        title: "New Lesson 6",
        article: "Content for new lesson 6.",
        videos: ["http://example.com/video2.mp4"],
      },
    ];

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { lessons: { $each: newLessons } } },
      { new: true }
    );

    console.log("Updated Course:", updatedCourse);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error adding lessons:", error);
    mongoose.connection.close();
  }
};

addLessons();
