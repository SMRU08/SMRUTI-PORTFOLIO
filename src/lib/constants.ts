import type {
  Certification,
  Education,
  Internship,
  PersonalInfo,
  Project,
  SkillCategory,
} from "@/types";

export const personalInfo: PersonalInfo = {
  name: "Smruti Ranjan Nayak",
  brand: "DEV SHOWCASE",
  experienceTitle: "THE IMPOSSIBLE PORTFOLIO",
  tagline: "Learn · Build · Evolve",
  title: "AI/ML Enthusiast & Full-Stack Developer",
  subtitle:
    "Learn · Build · Evolve — Crafting intelligent computer vision systems, edge AI applications, and modern interactive web experiences.",
  bio: "Computer Science & Engineering undergraduate at Synergy Institute of Engineering & Technology, Dhenkanal (2024–2028). Passionate about Artificial Intelligence, Machine Learning, Computer Vision, and full-stack engineering. Built SafeSync (BPUT Hackathon 2026) and JANBHASHA (Smart India Hackathon SIH 2026). Completed an AI & ML internship at Central Tool Room & Training Centre (CTTC), Bhubaneswar. Focused on mastering DSA, deep learning frameworks, modern React, and robust backend systems.",
  email: "smrutiranjan2412@gmail.com",
  location: "Dhenkanal, Odisha, India",
  cvUrl: "/Smruti_Ranjan_Nayak_CV.pdf",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/SMRU08",
      icon: "github",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/smruti-ranjan-nayak-67a733360",
      icon: "linkedin",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/sahill_._08/",
      icon: "instagram",
    },
    {
      name: "Portfolio",
      url: "https://smrutiranjan-portfolio.vercel.app/",
      icon: "portfolio",
    },
    {
      name: "Email",
      url: "mailto:smrutiranjan2412@gmail.com",
      icon: "mail",
    },
  ],
  stats: [
    { label: "CGPA (2nd Yr)", value: "7.5" },
    { label: "Projects Built", value: "6" },
    { label: "Certifications", value: "9" },
    { label: "Internship", value: "CTTC" },
  ],
};

export const projects: Project[] = [
  {
    id: "safesync",
    title: "SafeSync",
    description:
      "An autonomous AI vision-based industrial safety monitoring platform engineered for BPUT Hackathon 2026. Delivers real-time computer vision for workplace safety, PPE compliance governance, combustion hazard detection, and explainable risk assessment backed by 300+ passing tests.",
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Vite",
      "Computer Vision",
    ],
    image: "",
    githubUrl: "https://github.com/SMRU08/SafeSync",
    demoUrl: "https://safesync-xerses.vercel.app",
    hasDemo: true,
    featured: true,
  },
  {
    id: "janbhasha",
    title: "JANBHASHA (जनभाषा)",
    description:
      "An AI-powered offline vernacular pedagogy and real-time translation platform built for Smart India Hackathon (SIH 2026). Operates 100% air-gapped on low-cost Android tablets for primary tribal students in Odisha, Jharkhand & West Bengal, supporting Santali (Ol Chiki), Ho, and Mundari via on-device ONNX Runtime inference.",
    technologies: [
      "React Native",
      "TypeScript",
      "Python",
      "ONNX Runtime",
      "Kotlin",
      "Edge AI",
    ],
    image: "",
    githubUrl: "https://github.com/SMRU08/JANBHASHA",
    featured: true,
  },
  {
    id: "face-recognition-attendance",
    title: "Face Recognition Attendance System",
    description:
      "An automated attendance tracking platform utilizing computer vision and deep learning. Identifies faces in real time from camera feeds and matches them against database encodings for seamless, proxy-free attendance management.",
    technologies: [
      "Python",
      "OpenCV",
      "Machine Learning",
      "Keras",
      "Computer Vision",
    ],
    image: "",
    githubUrl: "https://github.com/SMRU08",
    featured: true,
  },
  {
    id: "real-time-emotion-detection",
    title: "Real-Time Emotion Detection",
    description:
      "A real-time facial expression classifier leveraging convolutional neural networks. Detects human faces from live video streams and classifies emotional expressions into distinct psychological categories with low latency.",
    technologies: [
      "Python",
      "OpenCV",
      "NumPy",
      "TensorFlow",
      "Keras",
      "Computer Vision",
    ],
    image: "",
    githubUrl: "https://github.com/SMRU08",
    featured: true,
  },
];

// More practical work & hackathon projects
export const otherProjects: Project[] = [
  {
    id: "safesync-archive",
    title: "SafeSync — Industrial Safety AI",
    description:
      "BPUT Hackathon 2026 project: Real-time computer vision monitoring for PPE compliance, combustion hazard detection, and automated workplace incident prevention with FastAPI and React 18 frontend.",
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Vite",
      "Computer Vision",
    ],
    image: "",
    demoUrl: "https://safesync-xerses.vercel.app",
    githubUrl: "https://github.com/SMRU08/SafeSync",
  },
  {
    id: "janbhasha-archive",
    title: "JANBHASHA — SIH 2026 Vernacular AI",
    description:
      "Smart India Hackathon (SIH26042): 100% offline edge AI translation and mother-tongue pedagogy platform for tribal primary education (Santali, Ho, Mundari) using ONNX Runtime Mobile.",
    technologies: [
      "React Native",
      "TypeScript",
      "Python",
      "ONNX Runtime",
      "Kotlin",
      "Edge AI",
    ],
    image: "",
    githubUrl: "https://github.com/SMRU08/JANBHASHA",
  },
  {
    id: "portfolio-live-v1",
    title: "Personal Portfolio Website (Vite)",
    description:
      "Live personal portfolio showcasing modern web projects, responsive design, interactive animations, and smooth kinetic scrolling via Lenis.",
    technologies: [
      "React",
      "Vite",
      "JavaScript",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "Lenis",
    ],
    image: "",
    demoUrl: "https://smrutiranjan-portfolio.vercel.app/",
    githubUrl: "https://github.com/SMRU08",
  },
  {
    id: "cttc-internship-project",
    title: "AI & ML Internship — CTTC Bhubaneswar",
    description:
      "Intensive Artificial Intelligence & Machine Learning internship (16 June 2026 – 15 July 2026) at Central Tool Room & Training Centre (CTTC), Bhubaneswar. Covered Python, Machine Learning, NLP, Computer Vision, and Deep Learning using Keras, culminating in the Face Recognition Attendance System.",
    technologies: [
      "Python",
      "Machine Learning",
      "NLP",
      "Computer Vision",
      "Keras",
      "Deep Learning",
    ],
    image: "",
    githubUrl: "https://github.com/SMRU08",
  },
  {
    id: "interactive-calculator",
    title: "Basic Web Calculator",
    description:
      "Clean, user-friendly arithmetic calculator built with pure HTML, CSS, and vanilla JavaScript handling standard arithmetic calculations with responsive styling.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "",
    githubUrl: "https://github.com/SMRU08",
  },
];

export const education: Education[] = [
  {
    degree: "B.Tech Computer Science & Engineering",
    institution: "Synergy Institute of Engineering & Technology, Dhenkanal",
    period: "2024–2028",
    grade: "CGPA 7.5 through the second year",
  },
  {
    degree: "Class 12, Science (CHSE Odisha)",
    institution: "Sri Aurobinda Science Higher Secondary School, Cuttack",
    period: "2024",
    grade: "First Division",
  },
  {
    degree: "Class 10 (BSE Odisha)",
    institution: "Indipur High School, Dhenkanal",
    period: "2022",
    grade: "Distinction",
  },
];

export const internship: Internship = {
  role: "Artificial Intelligence & Machine Learning Intern",
  company: "Central Tool Room & Training Centre (CTTC), Bhubaneswar",
  period: "16 June 2026 – 15 July 2026",
  topics: [
    "Python",
    "Machine Learning",
    "NLP",
    "Computer Vision",
    "Deep Learning using Keras",
  ],
  finalProject: "Face Recognition Attendance System",
};

export const certifications: Certification[] = [
  {
    title: "Managing Machine Learning Projects",
    issuer: "Coursera",
    date: "March 2024",
  },
  {
    title: "Introduction to Machine Learning",
    issuer: "Coursera",
    date: "March 2024",
  },
  {
    title: "Data Science in Python",
    issuer: "University of Michigan",
    date: "March 2024",
  },
  {
    title: "Introduction to Big Data",
    issuer: "UC San Diego",
    date: "April 2024",
  },
  {
    title: "Programming for Everybody (Python)",
    issuer: "Coursera",
    date: "April 2024",
  },
  {
    title: "Play It Safe: Manage Security Risks",
    issuer: "Google",
    date: "April 2024",
  },
  {
    title: "AI Strategic Approach to Cybersecurity",
    issuer: "Coursera",
    date: "March 2024",
  },
  {
    title: "Introduction to Artificial Intelligence",
    issuer: "IBM",
    date: "March 2024",
  },
  {
    title: "Cybersecurity Essentials",
    issuer: "IBM",
    date: "April 2024",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "AI, Machine Learning & Vision",
    skills: [
      { name: "Python" },
      { name: "OpenCV" },
      { name: "NumPy" },
      { name: "TensorFlow" },
      { name: "Keras" },
      { name: "ONNX Runtime" },
      { name: "Machine Learning" },
      { name: "Computer Vision" },
    ],
  },
  {
    name: "Frontend & Mobile",
    skills: [
      { name: "React" },
      { name: "React Native" },
      { name: "JavaScript" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "Vite" },
      { name: "Tailwind CSS" },
      { name: "Framer Motion" },
      { name: "GSAP" },
      { name: "Lenis" },
    ],
  },
  {
    name: "Languages & Core Tools",
    skills: [
      { name: "C" },
      { name: "C++" },
      { name: "Java" },
      { name: "FastAPI" },
      { name: "Node.js" },
      { name: "SQL" },
      { name: "Git" },
      { name: "GitHub" },
      { name: "VS Code" },
    ],
  },
];

export const currentlyLearning: string[] = [
  "DSA",
  "Modern React Development",
  "Backend Development",
  "SQL",
  "AI Concepts",
  "System Design",
  "Problem Solving",
];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "More", href: "#more-projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
