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
  bio: "I'm Smruti Ranjan Nayak, a Computer Science student at Synergy Institute of Engineering & Technology, Dhenkanal (2024–2028). I enjoy building practical software, working with artificial intelligence, and developing clean web applications. I am focused on writing readable code, learning continuously, and creating useful digital products.",
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
      url: "https://smrutiportfolio.vercel.app/",
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
      "An AI-powered workplace safety system built for the BPUT Hackathon. It uses computer vision to monitor protective gear (PPE), detect fire and safety hazards, and alert workers in real time.",
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
      "An offline learning and translation app built for the Smart India Hackathon (SIH 2026). It works without internet on low-cost tablets to help primary school students learn in their local regional languages.",
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
      "A smart camera-based attendance app that detects and recognizes faces in real time, making daily attendance fast, automatic, and proxy-free.",
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
      "A computer vision application that analyzes live camera video to detect human faces and recognize facial expressions and emotions in real time.",
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
      "BPUT Hackathon project: Real-time camera monitoring for workplace safety, protective gear compliance, and automated hazard alerts with a clean web dashboard.",
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
      "Smart India Hackathon project: 100% offline edge AI app helping students learn school lessons in their mother tongue on Android tablets.",
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
      "Personal portfolio website showcasing my software projects, interactive animations, and responsive design.",
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
    demoUrl: "https://smrutiportfolio.vercel.app/",
    githubUrl: "https://github.com/SMRU08",
  },
  {
    id: "cttc-internship-project",
    title: "AI & ML Internship — CTTC Bhubaneswar",
    description:
      "AI & ML internship at Central Tool Room & Training Centre (CTTC), Bhubaneswar, focused on Python, Machine Learning, Computer Vision, and real-time face recognition.",
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
      "A clean, responsive web calculator built with HTML, CSS, and JavaScript for standard arithmetic operations.",
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
