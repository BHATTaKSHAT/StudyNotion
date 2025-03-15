// import mongoose from "mongoose";
// import { faker } from "@faker-js/faker";
// import Course from "./models/Course.js";
// import dotenv from "dotenv";

// dotenv.config();

// mongoose
//   .connect(`${process.env.MONGODB_URL}/StudyNotion`)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// async function seed() {
//   try {
//     await Course.deleteMany({});
//     console.log("Existing courses deleted");

//     const courses = [];
//     for (let i = 0; i < 10; i++) {
//       const lessons = [];
//       for (let j = 0; j < 10; j++) {
//         const lesson = {
//           title: faker.lorem.sentence(),
//           article: faker.lorem.paragraphs(3, "\n\n"),
//           videos: [faker.internet.url()],
//         };

//         if ((j + 1) % 5 === 0) {
//           lesson.quiz = {
//             questions: [
//               {
//                 questionText: "What is the main takeaway from this lesson?",
//                 options: ["Option A", "Option B", "Option C", "Option D"],
//                 correctAnswer: "Option B",
//               },
//               {
//                 questionText: "Which example was used in the lesson?",
//                 options: ["Example 1", "Example 2", "Example 3"],
//                 correctAnswer: "Example 2",
//               },
//             ],
//           };
//         }
//         lessons.push(lesson);
//       }
//       courses.push(
//         new Course({
//           title: faker.lorem.words(3),
//           description: faker.lorem.sentences(2),
//           lessons,
//         })
//       );
//     }
//     await Course.insertMany(courses);
//     console.log("Seed data inserted successfully!");
//   } catch (err) {
//     console.error("Error seeding data:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// seed();
