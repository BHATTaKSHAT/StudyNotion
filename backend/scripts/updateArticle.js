import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";

dotenv.config();

const lessonArticles = [
  {
    title: "HTML elements and Syntax",
    article: `
<p>HTML is the standard markup language used to create web pages. It uses a series of elements (tags) to structure content. Every HTML document starts with a <code>&lt;!DOCTYPE html&gt;</code> declaration, followed by an <code>&lt;html&gt;</code> tag containing a <code>&lt;head&gt;</code> and a <code>&lt;body&gt;</code>.</p>
<pre><code class="language-html">
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;My First Page&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello, World!&lt;/h1&gt;
    &lt;p&gt;This is a simple HTML page.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code></pre>
<p>This lesson introduces HTML elements, their syntax, and how they are used to build the skeleton of web pages.</p>
`,
  },
  {
    title: "Forms",
    article: `
<p>Forms in HTML are used to collect user input. They include various input elements such as text fields, checkboxes, radio buttons, and submit buttons. The <code>&lt;form&gt;</code> element wraps these inputs and provides attributes like <code>action</code> and <code>method</code> to determine how and where to send the data.</p>
<pre><code class="language-html">
&lt;form action="/submit" method="post"&gt;
  &lt;label for="name"&gt;Name:&lt;/label&gt;
  &lt;input type="text" id="name" name="name"&gt;
  &lt;input type="submit" value="Submit"&gt;
&lt;/form&gt;
</code></pre>
<p>This lesson covers form structure, various input types, and best practices for user-friendly forms.</p>
`,
  },
  {
    title: "CSS Essentials",
    article: `
<p>CSS (Cascading Style Sheets) is used to style and layout web pages. It allows you to control colors, fonts, spacing, and more. CSS can be applied inline, embedded within the HTML, or via an external stylesheet.</p>
<pre><code class="language-css">
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
}

p {
  line-height: 1.6;
}
</code></pre>
<p>This lesson introduces the basic concepts of CSS, including selectors, properties, and values to style HTML elements effectively.</p>
`,
  },
  {
    title: "Classes, Selectors & Cascade",
    article: `
<p>Classes and selectors are core concepts in CSS that allow you to target HTML elements for styling. Classes are defined with a preceding dot (<code>.</code>) and can be reused on multiple elements. The cascade determines how conflicting styles are applied based on specificity and order.</p>
<pre><code class="language-css">
/* Class selector */
.card {
  padding: 20px;
  border: 1px solid #ccc;
}

/* Element selector */
h1 {
  color: #007BFF;
}

/* Combined selectors */
.card h1 {
  font-size: 1.5em;
}
</code></pre>
<p>This lesson explains how to use classes, element selectors, and the cascade to create maintainable and scalable styles.</p>
`,
  },
  {
    title: "HTML5 semantic elements",
    article: `
<p>HTML5 introduces semantic elements that provide meaning to the web page structure. Elements like <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;article&gt;</code>, and <code>&lt;footer&gt;</code> help improve accessibility and SEO.</p>
<pre><code class="language-html">
&lt;header&gt;
  &lt;h1&gt;Website Title&lt;/h1&gt;
&lt;/header&gt;
&lt;nav&gt;
  &lt;ul&gt;
    &lt;li&gt;&lt;a href="#"&gt;Home&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#"&gt;About&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;
&lt;article&gt;
  &lt;h2&gt;Article Title&lt;/h2&gt;
  &lt;p&gt;Content goes here...&lt;/p&gt;
&lt;/article&gt;
&lt;footer&gt;
  &lt;p&gt;Copyright © 2025&lt;/p&gt;
&lt;/footer&gt;
</code></pre>
<p>This lesson highlights the importance and usage of semantic elements for clear, descriptive web page structure.</p>
`,
  },
  {
    title: "Chrome Dev Tools",
    article: `
<p>Chrome Dev Tools are essential for web developers to inspect, debug, and optimize web pages. They allow you to view and modify HTML, CSS, and JavaScript in real time, monitor performance, and diagnose issues.</p>
<pre><code class="language-text">
- Open Dev Tools by right-clicking on a page and selecting "Inspect" or pressing F12.
- Use the Elements panel to inspect HTML and modify CSS.
- The Console panel displays errors and logs.
- Network and Performance panels help analyze loading times.
</code></pre>
<p>This lesson demonstrates how to utilize Dev Tools effectively to enhance your web development workflow.</p>
`,
  },
  {
    title: "CSS Layout & Position",
    article: `
<p>CSS layout techniques include using Flexbox, Grid, and traditional methods like floats and positioning. Positioning properties (<code>static</code>, <code>relative</code>, <code>absolute</code>, and <code>fixed</code>) determine how elements are placed on the page.</p>
<pre><code class="language-css">
.container {
  display: flex;
  justify-content: space-around;
}

.box {
  width: 100px;
  height: 100px;
  position: relative;
  top: 20px;
}
</code></pre>
<p>This lesson covers modern layout techniques and positioning methods to create responsive and well-structured designs.</p>
`,
  },
  {
    title: "Pseudo Classes & elements",
    article: `
<p>Pseudo-classes and pseudo-elements allow you to style elements based on their state or add decorative content. Pseudo-classes like <code>:hover</code> and <code>:active</code> respond to user interaction, while pseudo-elements like <code>::before</code> and <code>::after</code> insert content without modifying HTML.</p>
<pre><code class="language-css">
a:hover {
  color: red;
}

p::first-letter {
  font-size: 2em;
}
</code></pre>
<p>This lesson explains how to enhance user experience and visual appeal using pseudo classes and pseudo elements.</p>
`,
  },
  {
    title: "Media Queries",
    article: `
<p>Media queries are a key feature of responsive web design. They allow you to apply CSS rules based on device characteristics such as screen width, orientation, or resolution. This helps create layouts that work well on various devices, from mobile phones to desktops.</p>
<pre><code class="language-css">
@media (max-width: 768px) {
  body {
    background-color: #eee;
  }
  .container {
    flex-direction: column;
  }
}
</code></pre>
<p>This lesson covers the syntax and usage of media queries to ensure your designs adapt seamlessly to different screen sizes.</p>
`,
  },
  {
    title: "Wrap & Next steps",
    article: `
<p>This final lesson summarizes key concepts from the course and provides guidance on next steps for further learning. It encourages best practices, project organization, and continued exploration of advanced topics.</p>
<p>Review what you've learned about HTML and CSS to build robust and accessible websites. Consider diving deeper into modern frameworks, preprocessors like SASS, or learning JavaScript to enhance interactivity.</p>
<p>With a solid foundation in HTML and CSS, you are now ready to tackle more complex projects and keep growing your web development skills.</p>
`,
  },
];

async function updateLessonArticles() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`);
    console.log("Connected to MongoDB");

    const course = await Course.findOne({ title: "HTML & CSS" });
    if (!course) throw new Error("HTML & CSS course not found");

    for (const { title, article } of lessonArticles) {
      const lesson = course.lessons.find((lesson) => lesson.title === title);
      if (lesson) {
        lesson.article = article;
        console.log(`Updated article for lesson: ${title}`);
      } else {
        console.warn(`Lesson "${title}" not found`);
      }
    }

    await course.save();
    console.log("All HTML & CSS lesson articles updated successfully.");
  } catch (err) {
    console.error("Error updating articles:", err);
  } finally {
    mongoose.disconnect();
  }
}

updateLessonArticles();
