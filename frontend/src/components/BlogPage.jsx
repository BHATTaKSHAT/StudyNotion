import React from "react";
import "./BlogPage.css";

const BlogPage = () => {
  const blogs = [
    {
      id: 1,
      title: "The Importance of Lifelong Learning",
      author: "John Doe",
      date: "January 25, 2025",
      content: `
        Lifelong learning is the ongoing, voluntary, and self-motivated pursuit of knowledge. 
        In today's fast-paced world, staying updated with new skills and knowledge is essential 
        for personal and professional growth. Whether it's learning a new language, mastering 
        a programming language, or exploring a new hobby, lifelong learning keeps your mind sharp 
        and opens up new opportunities.
      `,
    },
    {
      id: 2,
      title: "Top 5 Programming Languages to Learn in 2023",
      author: "Jane Smith",
      date: "March 20, 2025",
      content: `
        The tech industry is constantly evolving, and staying ahead means learning the right programming languages. 
        Here are the top 5 programming languages to learn in 2023:
        1. Python: Great for beginners and widely used in AI, machine learning, and web development.
        2. JavaScript: Essential for front-end and back-end web development.
        3. Go: Known for its simplicity and performance, ideal for cloud computing.
        4. Rust: A systems programming language focused on safety and performance.
        5. Kotlin: Perfect for Android development and gaining popularity in other areas.
        Start learning these languages to boost your career in tech!
      `,
    },
  ];

  return (
    <div className="blog-page">
      <h1 className="page-title">Our Blogs</h1>
      <div className="blog-container">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <h2 className="blog-title">{blog.title}</h2>
            <p className="blog-meta">
              By {blog.author} | {blog.date}
            </p>
            <p className="blog-content">{blog.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
