⚠️ **ACADEMIC ASSIGNMENT - PLEASE READ** ⚠️

### 📌 Project Information

**Project Name:** AD Decision Support System  
**Purpose:** Course Assignment for Semantic Web (Informatika UNS - 2025)  
**Created By:**
- **Danang Aprianto:** L0122043 (Informatika 2022, UNS)
- **Yudha Cahya P:** L0122156 (Informatika 2022, UNS)

**Course Details:**
- 🏫 **University:** Universitas Sebelas Maret (UNS)
- 📚 **Program:** Informatika (Computer Science)
- 👥 **Batch/Angkatan:** 2022
- 🎓 **Course:** Semantic Web
- 📅 **Academic Year:** 2025

**Assignment Description:**  
This project is created to fulfill the course requirements of the Semantic Web course at Informatika UNS. The assignment focuses on implementing semantic web technologies (OWL ontologies and RDF) in a real-world healthcare application - specifically for Alzheimer's Disease diagnosis and treatment decision support.

### ⚠️ Important Notice

> **DO NOT copy-paste or plagiarize** this code for your own assignments
> - This repository is published for reference and educational purposes only
> - If you're a student, create your own solution to learn the concepts properly
> - Plagiarism violates academic integrity policies and can result in serious consequences
> - Your instructor has tools to detect copied code - it's not worth the risk!

---

# AD Decision Support System

A web-based decision support system for Alzheimer's Disease diagnosis and treatment, built with React frontend and Python backend using semantic web technologies (OWL ontology).

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Features](#project-features)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## 🎯 Overview

This project is an intelligent decision support system that helps in the detection, assessment, diagnosis, and treatment of Alzheimer's Disease. It uses semantic web technologies (OWL ontologies) combined with modern web frameworks to provide a comprehensive clinical decision support interface.

**Course Assignment:**
- 🏫 **Course:** Semantic Web (Informatika UNS)
- 📅 **Academic Year:** 2025
- 👥 **Students:** L0122043 & L0122156 (Informatika 2022)

**Key Features:**
- 4-step clinical workflow (Detect → Assess → Diagnose → Treat)
- Knowledge-based system using OWL ontologies
- Real-time decision support
- Responsive web interface
- Docker containerization for easy deployment

## 📁 Project Structure

```
.
├── backend/                              # Python Flask/FastAPI backend
│   ├── main.py                          # Main application entry point
│   ├── requirements.txt                 # Python dependencies
│   ├── Dockerfile                       # Docker configuration for backend
│   ├── ad-decision-support-system.owl   # OWL ontology file
│   ├── ad-decision-support-system.ttl   # RDF Turtle format
│   ├── ad-decision-support-system.properties
│   ├── input_output.md                  # API input/output documentation
│   └── CORS_FIX.md                      # CORS configuration notes
│
├── frontend/                             # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                      # Main React component
│   │   ├── main.jsx                     # React entry point
│   │   ├── DecisionFlow.jsx             # Decision flow controller
│   │   ├── Stepper.jsx                  # Step navigation component
│   │   ├── page.jsx                     # Page routing
│   │   ├── layout.jsx                   # Layout wrapper
│   │   ├── api.js                       # API client
│   │   ├── steps/                       # Step components
│   │   │   ├── Step1Detect.jsx         # Detection step
│   │   │   ├── Step2Assess.jsx         # Assessment step
│   │   │   ├── Step3Diagnose.jsx       # Diagnosis step
│   │   │   └── Step4Treat.jsx          # Treatment step
│   │   ├── assets/                      # Static assets
│   │   ├── App.css                      # App styling
│   │   ├── globals.css                  # Global styles
│   │   └── index.css                    # Index styles
│   ├── public/                          # Public assets
│   ├── index.html                       # HTML entry point
│   ├── package.json                     # Node dependencies
│   ├── vite.config.js                   # Vite configuration
│   ├── eslint.config.js                 # ESLint configuration
│   ├── Dockerfile                       # Docker configuration for frontend
│   └── README.md                        # Frontend specific documentation
│
└── docker-compose.yml                   # Docker Compose configuration
```

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** CSS3
- **HTTP Client:** Axios (via api.js)
- **Code Quality:** ESLint

### Backend
- **Language:** Python 3.8+
- **Framework:** Flask/FastAPI
- **Semantic Web:** OWL Ontology (Protégé format)
- **RDF Support:** Turtle format (.ttl)

### DevOps
- **Containerization:** Docker & Docker Compose
- **Architecture:** Microservices (Frontend + Backend)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### For Docker (Recommended)
- Docker (v20.10+)
- Docker Compose (v2.0+)

### For Local Development
- **Backend:**
  - Python 3.8 or higher
  - pip (Python package manager)

- **Frontend:**
  - Node.js 16+ or npm 8+
  - npm or yarn

## 🚀 Installation

### Option 1: Using Docker Compose (Recommended)

1. **Clone or navigate to the project directory:**
   ```bash
   cd L0122043-L0122156-WEB
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

4. **Stop the containers:**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server:**
   ```bash
   python main.py
   ```
   Backend will be available at `http://localhost:5000`

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## 🎮 Running the Application

### With Docker Compose
```bash
docker-compose up
```

### Local Development (Two terminals)

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## ✨ Project Features

### 4-Step Clinical Workflow

1. **Step 1: Detection (Detect)**
   - Initial symptom detection
   - Risk assessment
   - Preliminary screening

2. **Step 2: Assessment (Assess)**
   - Detailed cognitive assessment
   - Clinical evaluations
   - Patient history analysis

3. **Step 3: Diagnosis (Diagnose)**
   - Evidence-based diagnosis
   - Confidence scoring
   - Differential diagnosis support

4. **Step 4: Treatment (Treat)**
   - Treatment recommendations
   - Medication suggestions
   - Care plan generation

### Semantic Web Integration
- **OWL Ontology:** Structured knowledge representation
- **RDF Format:** Machine-readable format for semantic queries
- **Knowledge-Based:** Decisions backed by clinical ontologies

## 📡 API Documentation

For detailed API documentation, see [backend/input_output.md](backend/input_output.md)

### Key Endpoints
The backend API serves the following main functions:
- Patient data processing
- Ontology querying
- Decision support inference
- Treatment recommendations

Check `backend/input_output.md` for complete API specifications.

## 🔧 Configuration

### CORS Settings
For CORS configuration issues, see [backend/CORS_FIX.md](backend/CORS_FIX.md)

### Environment Variables
Create a `.env` file in the backend directory if needed (check `main.py` for required variables)

## 📦 Build for Production

### Frontend Build
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

### Docker Production Build
```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up
```

## 🐛 Troubleshooting

### Port Already in Use
- Frontend (5173): `npm run dev -- --port 3000`
- Backend (5000): Modify `main.py` or set `FLASK_PORT=5001`

### CORS Issues
See [backend/CORS_FIX.md](backend/CORS_FIX.md)

### Dependencies Issues
```bash
# Reinstall all dependencies
cd backend && pip install --upgrade -r requirements.txt
cd frontend && npm install
```

## 📝 File Descriptions

- **ad-decision-support-system.owl** - OWL ontology defining AD knowledge
- **ad-decision-support-system.ttl** - RDF Turtle format of the ontology
- **ad-decision-support-system.properties** - Configuration properties
- **main.py** - Backend Flask/FastAPI application
- **api.js** - Frontend API client for backend communication

## 📄 License

This project is developed for educational purposes as a course assignment at Universitas Sebelas Maret (UNS), submitted in the Semantic Web course (2025).

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📧 Support

For issues or questions:
1. Check existing documentation in `backend/input_output.md` and `backend/CORS_FIX.md`
2. Review the code comments
3. Check Docker logs: `docker-compose logs`

---

**Happy coding!** 🎉
