import os

def create_pdf(filename):
    lines = [
        ("SMRUTI RANJAN NAYAK", 16, True),
        ("AI/ML Practitioner & Full-Stack Developer | DEV SHOWCASE", 11, False),
        ("Email: smrutiranjan2412@gmail.com | Portfolio: https://smrutiranjan-portfolio.vercel.app/", 9, False),
        ("GitHub: https://github.com/SMRU08 | LinkedIn: https://www.linkedin.com/in/smruti-ranjan-nayak-67a733360", 9, False),
        ("----------------------------------------------------------------------------------------------------", 9, False),
        ("EDUCATION", 12, True),
        (" * B.Tech Computer Science & Engineering (2024 - 2028)", 10, True),
        ("   Synergy Institute of Engineering & Technology, Dhenkanal | CGPA: 7.5 through 2nd Year", 9, False),
        (" * Higher Secondary - Class 12 Science, CHSE Odisha (2024)", 10, True),
        ("   Sri Aurobinda Science Higher Secondary School, Cuttack | First Division", 9, False),
        (" * Secondary School - Class 10, BSE Odisha (2022)", 10, True),
        ("   Indipur High School, Dhenkanal | Distinction", 9, False),
        ("----------------------------------------------------------------------------------------------------", 9, False),
        ("FEATURED PROJECTS", 12, True),
        (" * SafeSync - AI Vision-Based Industrial Safety Monitoring (BPUT Hackathon 2026)", 10, True),
        ("   Technologies: Python, FastAPI, React 18, TypeScript, Vite, Computer Vision. 306 passing tests.", 9, False),
        ("   Real-time computer vision for workplace PPE compliance, combustion detection & risk assessment.", 9, False),
        ("   Demo: https://safesync-xerses.vercel.app | Repo: https://github.com/SMRU08/SafeSync", 9, False),
        (" * JANBHASHA - Offline AI Vernacular Pedagogy Platform (Smart India Hackathon SIH 2026)", 10, True),
        ("   Technologies: React Native, TypeScript, Python, ONNX Runtime Mobile, Kotlin, C++17 JSI, Edge AI.", 9, False),
        ("   100% air-gapped on-device neural translation for Santali (Ol Chiki), Ho & Mundari for primary schools.", 9, False),
        ("   Repo: https://github.com/SMRU08/JANBHASHA", 9, False),
        (" * Face Recognition Attendance System (CTTC Capstone)", 10, True),
        ("   Technologies: Python, OpenCV, Machine Learning, Keras, Computer Vision.", 9, False),
        ("   Real-time automated face detection and verification attendance tracking system.", 9, False),
        (" * Real-Time Emotion Detection", 10, True),
        ("   Technologies: Python, OpenCV, NumPy, TensorFlow, Keras, Computer Vision.", 9, False),
        ("   Facial landmark analysis and real-time expression recognition using deep learning.", 9, False),
        (" * Personal Portfolio Website", 10, True),
        ("   Technologies: React, Vite, JavaScript, Tailwind CSS, Framer Motion, GSAP, Lenis.", 9, False),
        ("   Demo: https://smrutiranjan-portfolio.vercel.app/ | Repo: https://github.com/SMRU08", 9, False),
        ("----------------------------------------------------------------------------------------------------", 9, False),
        ("INTERNSHIP EXPERIENCE", 12, True),
        (" * Artificial Intelligence & Machine Learning Intern (16 June 2026 - 15 July 2026)", 10, True),
        ("   Central Tool Room & Training Centre (CTTC), Bhubaneswar", 9, False),
        ("   Topics: Python, Machine Learning, NLP, Computer Vision, Deep Learning using Keras.", 9, False),
        ("   Capstone Project: Face Recognition Attendance System.", 9, False),
        ("----------------------------------------------------------------------------------------------------", 9, False),
        ("TECHNICAL SKILLS", 12, True),
        (" * Programming & Core: C, C++, Python, Java, HTML, CSS, JavaScript, TypeScript, Node.js, FastAPI, SQL.", 9, False),
        (" * AI / ML / Vision: OpenCV, NumPy, TensorFlow, Keras, ONNX Runtime, Machine Learning, Deep Learning, NLP.", 9, False),
        (" * Frontend & Mobile: React, React Native, Vite, Tailwind CSS, Framer Motion, GSAP, Lenis.", 9, False),
        (" * Tools & Platforms: Git, GitHub, VS Code.", 9, False),
        ("----------------------------------------------------------------------------------------------------", 9, False),
        ("CERTIFICATIONS", 12, True),
        (" * Managing Machine Learning Projects (Coursera - Mar 2024)", 9, False),
        (" * Introduction to Machine Learning (Coursera - Mar 2024)", 9, False),
        (" * Data Science in Python (University of Michigan - Mar 2024)", 9, False),
        (" * Introduction to Big Data (UC San Diego - Apr 2024)", 9, False),
        (" * Programming for Everybody - Python (Coursera - Apr 2024)", 9, False),
        (" * Play It Safe: Manage Security Risks (Google - Apr 2024)", 9, False),
        (" * AI Strategic Approach to Cybersecurity (Coursera - Mar 2024)", 9, False),
        (" * Introduction to Artificial Intelligence (IBM - Mar 2024)", 9, False),
        (" * Cybersecurity Essentials (IBM - Apr 2024)", 9, False),
    ]

    # Build PDF stream
    stream_content = "BT\n"
    y = 800
    for text, size, is_bold in lines:
        font = "/F2" if is_bold else "/F1"
        safe_text = text.replace("(", "\\(").replace(")", "\\)")
        stream_content += f"{font} {size} Tf\n"
        stream_content += f"40 {y} Td\n"
        stream_content += f"({safe_text}) Tj\n"
        stream_content += f"-40 -{y} Td\n"
        y -= (size + 3) if size > 11 else (size + 2.5)
    stream_content += "ET\n"

    stream_bytes = stream_content.encode("latin-1")
    length = len(stream_bytes)

    objects = []
    # 1: Catalog
    objects.append("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    # 2: Pages
    objects.append("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    # 3: Page
    objects.append("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n")
    # 4: Stream
    objects.append(f"4 0 obj\n<< /Length {length} >>\nstream\n".encode("latin-1") + stream_bytes + b"\nendstream\nendobj\n")
    # 5: Font F1
    objects.append("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")
    # 6: Font F2
    objects.append("6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n")

    # Assemble PDF with cross-reference table
    output = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = []
    for obj in objects:
        offsets.append(len(output))
        if isinstance(obj, str):
            output.extend(obj.encode("latin-1"))
        else:
            output.extend(obj)

    xref_offset = len(output)
    output.extend(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode("latin-1"))
    for offset in offsets:
        output.extend(f"{offset:010d} 00000 n \n".encode("latin-1"))

    output.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode("latin-1"))

    with open(filename, "wb") as f:
        f.write(output)

if __name__ == "__main__":
    create_pdf("public/Smruti_Ranjan_Nayak_CV.pdf")
    print("Updated CV PDF created successfully.")
