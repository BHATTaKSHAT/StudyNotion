import React, { useState } from "react";
import "./BlogPage.css";
import blog1 from "../assets/blog1.png"; // Add your image paths here
import blog2 from "../assets/blog2.png";

const BlogPage = () => {
  const [expandedId, setExpandedId] = useState(null);

  const blogs = [
    {
      id: 1,
      title: "The Importance of Lifelong Learning",
      author: "John Doe",
      date: "January 25, 2025",
      image: blog1,
      content: `
        In an age where information changes at lightning speed, lifelong learning has become more than just a buzzword—it's a necessity. For educators, students, and professionals alike, the ability to continuously acquire new knowledge is crucial for success.

Lifelong learning fosters adaptability. When we consistently seek out new information, we train our minds to be flexible, open-minded, and curious. In a field like technology—especially in web development, data science, or cybersecurity—this trait sets apart those who thrive from those who stagnate.

Online education platforms, such as Study Notion, empower learners by offering personalized and modular learning experiences. You can start with basic programming, transition into full-stack development, and eventually explore specialized fields like AI or blockchain.

Moreover, the self-paced nature of these platforms caters to all kinds of learners. Whether you're a college student or a working professional, you can tailor your education around your schedule. This empowerment encourages motivation and better knowledge retention.

Lastly, the habit of lifelong learning improves confidence. By actively building your skillset, you feel more capable, more employable, and more fulfilled. So whether you're picking up your first coding language or mastering a new framework—keep learning.

In conclusion, lifelong learning is not just a trend; it's a fundamental shift in how we approach education. With the right resources and mindset, anyone can become a lifelong learner. So why wait? Start your journey today with platforms like Study Notion, and unlock your potential for a brighter future.
      `,
    },
    {
      id: 2,
      title: "Why MERN Stack is the Future of Web Development",
      author: "Jane Smith",
      date: "March 20, 2025",
      image: blog2,
      content: `
        The web development industry is evolving rapidly, and the demand for full-stack developers has never been higher. One stack that has risen to prominence for its speed, flexibility, and efficiency is the MERN stack—MongoDB, Express.js, React, and Node.js.

Each component of the MERN stack plays a vital role:

MongoDB: NoSQL database ideal for modern, scalable applications.

Express.js: Minimalistic backend framework that simplifies server logic.

React: Arguably the most powerful front-end library, great for building fast and interactive UIs.

Node.js: Enables JavaScript to be used for server-side logic, offering unified language use across the stack.

Platforms like Study Notion rely heavily on this stack to provide a seamless and reactive user experience. From interactive quizzes and resume video playback to admin dashboards and student progress tracking—MERN makes it possible.

Furthermore, the developer ecosystem is massive. With thousands of open-source packages, tutorials, and tools, the MERN stack remains accessible to beginners while still being powerful enough for enterprise-grade applications.

If you're planning to learn web development or build your own platform—start with MERN. Its future-proof, developer-friendly, and battle-tested in production environments.
      `,
    },
  ];

  const handleClick = (id) => {
    setExpandedId(id);
  };

  const handleMinimize = () => {
    setExpandedId(null);
  };

  return (
    <div className="blog-page">
      <h1 className="page-title">Our Blogs</h1>
      <div className="blog-container">
        {blogs.map((blog) =>
          expandedId === null || expandedId === blog.id ? (
            <div
              key={blog.id}
              className={`blog-card ${
                expandedId === blog.id ? "expanded" : ""
              }`}
              onClick={() => expandedId === null && handleClick(blog.id)}
            >
              {expandedId === blog.id && (
                <button className="minimize-btn" onClick={handleMinimize}>
                  ← Back to Blogs
                </button>
              )}
              <img src={blog.image} alt={blog.title} className="blog-image" />
              <h2 className="blog-title">{blog.title}</h2>
              <p className="blog-meta">
                By {blog.author} | {blog.date}
              </p>
              {expandedId === blog.id && (
                <p className="blog-content expanded-content">{blog.content}</p>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default BlogPage;
