import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  progress: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      completedLessons: [Number], // Array of lesson indices
      completedQuizzes: [Number], // Array of quiz indices
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ...existing code...

userSchema.methods.getResumePoint = function (course) {
  console.log("Finding progress for course:", course._id);

  const courseProgress = this.progress.find((progress) =>
    progress.courseId.equals(course._id)
  );
  console.log("Course Progress Found:", courseProgress);

  if (!courseProgress) {
    console.log("No progress found, returning first lesson");
    return { type: "lesson", index: 0 };
  }

  const { completedLessons, completedQuizzes } = courseProgress;
  console.log("Completed Lessons:", completedLessons);
  console.log("Completed Quizzes:", completedQuizzes);

  // Iterate through lessons in order
  for (let i = 0; i < course.lessons.length; i++) {
    const lesson = course.lessons[i];

    if (!completedLessons.includes(i)) {
      console.log("Resuming to incomplete lesson:", i);
      return { type: "lesson", index: i };
    }

    if (lesson.quiz && !completedQuizzes.includes(i)) {
      console.log("Resuming to quiz for lesson:", i);
      return { type: "quiz", index: i };
    }
  }

  console.log("All lessons and quizzes completed");
  return null;
};


// ...existing code...

const User = mongoose.model("User", userSchema);

export default User;
