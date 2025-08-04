const mongoose = require('mongoose');
const Course = require('../models/Course');
require('dotenv').config();

const sampleCourses = [
  {
    title: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript programming language including variables, functions, objects, and DOM manipulation. Perfect for beginners who want to start their web development journey.",
    instructor: "Sarah Johnson",
    duration: "6 hours",
    level: "Beginner",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
    content: [
      {
        title: "Introduction to JavaScript",
        description: "Understanding what JavaScript is and its role in web development",
        videoUrl: "https://example.com/video1",
        duration: "30 min"
      },
      {
        title: "Variables and Data Types",
        description: "Learn about variables, strings, numbers, and other data types",
        videoUrl: "https://example.com/video2",
        duration: "45 min"
      },
      {
        title: "Functions and Scope",
        description: "Understanding functions, parameters, and variable scope",
        videoUrl: "https://example.com/video3",
        duration: "60 min"
      }
    ],
    requirements: [
      "Basic computer knowledge",
      "A modern web browser",
      "Text editor (VS Code recommended)"
    ],
    learningOutcomes: [
      "Understand JavaScript syntax and structure",
      "Work with variables, functions, and objects",
      "Manipulate the DOM to create interactive web pages",
      "Debug and troubleshoot JavaScript code"
    ]
  },
  {
    title: "React.js Complete Guide",
    description: "Master React.js from basics to advanced concepts. Build modern, scalable web applications with React hooks, context API, and best practices.",
    instructor: "Michael Chen",
    duration: "12 hours",
    level: "Intermediate",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    content: [
      {
        title: "React Basics",
        description: "Introduction to React components and JSX",
        videoUrl: "https://example.com/react1",
        duration: "90 min"
      },
      {
        title: "State and Props",
        description: "Understanding React state management and props",
        videoUrl: "https://example.com/react2",
        duration: "120 min"
      },
      {
        title: "Hooks and Context",
        description: "Modern React with hooks and context API",
        videoUrl: "https://example.com/react3",
        duration: "150 min"
      }
    ],
    requirements: [
      "JavaScript fundamentals",
      "HTML and CSS knowledge",
      "Node.js installed on your computer"
    ],
    learningOutcomes: [
      "Build reusable React components",
      "Manage application state effectively",
      "Use React hooks for functional components",
      "Implement routing and navigation",
      "Deploy React applications"
    ]
  },
  {
    title: "Python for Data Science",
    description: "Learn Python programming specifically for data science applications. Cover pandas, numpy, matplotlib, and machine learning basics.",
    instructor: "Dr. Emily Rodriguez",
    duration: "15 hours",
    level: "Intermediate",
    category: "Data Science",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
    content: [
      {
        title: "Python Basics for Data Science",
        description: "Essential Python concepts for data analysis",
        videoUrl: "https://example.com/python1",
        duration: "120 min"
      },
      {
        title: "Pandas and Data Manipulation",
        description: "Working with data using pandas library",
        videoUrl: "https://example.com/python2",
        duration: "180 min"
      },
      {
        title: "Data Visualization",
        description: "Creating charts and graphs with matplotlib and seaborn",
        videoUrl: "https://example.com/python3",
        duration: "150 min"
      }
    ],
    requirements: [
      "Basic programming knowledge",
      "Python 3.7+ installed",
      "Jupyter Notebook or similar IDE"
    ],
    learningOutcomes: [
      "Write efficient Python code for data analysis",
      "Manipulate and clean datasets using pandas",
      "Create meaningful data visualizations",
      "Perform basic statistical analysis",
      "Prepare data for machine learning"
    ]
  },
  {
    title: "UI/UX Design Principles",
    description: "Master the fundamentals of user interface and user experience design. Learn to create intuitive, accessible, and beautiful digital products.",
    instructor: "Alex Thompson",
    duration: "8 hours",
    level: "Beginner",
    category: "Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    content: [
      {
        title: "Design Fundamentals",
        description: "Understanding color theory, typography, and layout",
        videoUrl: "https://example.com/design1",
        duration: "90 min"
      },
      {
        title: "User Research and Personas",
        description: "Conducting user research and creating user personas",
        videoUrl: "https://example.com/design2",
        duration: "120 min"
      },
      {
        title: "Wireframing and Prototyping",
        description: "Creating wireframes and interactive prototypes",
        videoUrl: "https://example.com/design3",
        duration: "150 min"
      }
    ],
    requirements: [
      "No prior design experience required",
      "Access to design tools (Figma recommended)",
      "Creative mindset and attention to detail"
    ],
    learningOutcomes: [
      "Understand core UI/UX design principles",
      "Conduct effective user research",
      "Create wireframes and prototypes",
      "Design user-friendly interfaces",
      "Apply accessibility guidelines"
    ]
  },
  {
    title: "Node.js Backend Development",
    description: "Build robust backend applications with Node.js and Express. Learn RESTful APIs, database integration, authentication, and deployment.",
    instructor: "David Kim",
    duration: "10 hours",
    level: "Intermediate",
    category: "Backend Development",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    content: [
      {
        title: "Node.js Fundamentals",
        description: "Understanding Node.js runtime and event loop",
        videoUrl: "https://example.com/node1",
        duration: "90 min"
      },
      {
        title: "Express.js Framework",
        description: "Building RESTful APIs with Express.js",
        videoUrl: "https://example.com/node2",
        duration: "120 min"
      },
      {
        title: "Database Integration",
        description: "Working with MongoDB and Mongoose",
        videoUrl: "https://example.com/node3",
        duration: "150 min"
      }
    ],
    requirements: [
      "JavaScript fundamentals",
      "Basic understanding of HTTP and APIs",
      "Node.js installed on your computer"
    ],
    learningOutcomes: [
      "Build scalable Node.js applications",
      "Create RESTful APIs with Express.js",
      "Integrate databases with your applications",
      "Implement authentication and authorization",
      "Deploy Node.js applications to production"
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/course-certificate-system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert sample courses
    const insertedCourses = await Course.insertMany(sampleCourses);
    console.log(`Successfully inserted ${insertedCourses.length} courses`);

    // Display inserted courses
    console.log('\nInserted courses:');
    insertedCourses.forEach(course => {
      console.log(`- ${course.title} (${course.level})`);
    });

    console.log('\nDatabase seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase(); 