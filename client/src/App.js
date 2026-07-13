import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import "./App.css";

/* =========================
   HOME & MASTER PAGES
========================= */

import Home from "./Pages/Home";
import DepartmentMaster from "./Pages/DepartmentMaster";
import CourseMaster from "./Pages/CourseMaster";

/* =========================
   CRITERIA 1
========================= */

import VisionMission from "./Pages/VisionMission";
import Curriculum from "./Pages/Curriculum";
import PoPso from "./Pages/PoPso";
import CourseMatrix from "./Pages/CourseMatrix";
import ArticulationMatrix from "./Pages/ArticulationMatrix";

/* =========================
   CRITERIA 2
========================= */

import QualityTeachingLearning from "./criteria/QualityTeachingLearning";
import CapstoneProject from "./criteria/CapstoneProject";
import Internship from "./criteria/Internship";
import SeminarMiniProject from "./criteria/SeminarMiniProject";
import CaseStudy from "./criteria/CaseStudy";
import NptelSwayam from "./criteria/NptelSwayam";
import SolvingComplexProblems from "./criteria/SolvingComplexProblems";
import IndustryInstitutePartnership from "./criteria/IndustryInstitutePartnership";

/* =========================
   CRITERIA 3
========================= */

import EvolutionAssessment from "./criteria3/EvolutionAssessment";
import EvolutionOfEndSemesterExam from "./criteria3/EvolutionOfEndSemesterExam";
import LaboratoryWorkshop from "./criteria3/LaboratoryWorkshop";
import IndustrialTrainingInternship from "./criteria3/IndustrialTrainingInternship";
import EvolutionOfProject from "./criteria3/EvolutionOfProject";
import AttainmentCourseOutcomes from "./criteria3/AttainmentCourseOutcomes";
import SustainableDevelopmentGoals from "./criteria3/SustainableDevelopmentGoals";
import ProgramAttainment from "./criteria3/ProgramAttainment";


/* =========================
   CRITERIA 5
========================= */

import Criteria5SFR from "./Pages/Criteria5SFR";
import Criteria5Qual from "./Pages/Criteria5Qual";
import FacultyCadreProportion from "./Pages/FacultyCadreProportion";




/* =========================
   CRITERIA 6
========================= */






function App() {
  const [openCriteria1, setOpenCriteria1] = useState(false);
  const [openCriteria2, setOpenCriteria2] = useState(false);
  const [openCriteria3, setOpenCriteria3] = useState(false);
  const [openCriteria5, setOpenCriteria5] = useState(false);

  return (
    <Router>
      <div className="main-container">

        {/* =========================
             SIDEBAR
        ========================= */}

        <div className="sidebar">

          <div className="logo-section">
            <img
              src="/nba-logo.png"
              alt="NBA Logo"
              className="logo-img"
            />

            <div className="logo-text">
              <h2>NBA</h2>
              <p>Accreditation</p>
              <p>Management System</p>
            </div>
          </div>

          <ul className="menu">

            <li className="criteria-header">
              Criteria Management
            </li>

            <li
              className="criteria-title"
              onClick={() =>
                setOpenCriteria1(!openCriteria1)
              }
            >
              {openCriteria1 ? "▼" : "▶"} Criteria 1
            </li>
                      {openCriteria1 && (
            <>
              {/* 1.1 Vision */}
              <li>
                <NavLink
                  to="/vision"
                  className={({ isActive }) =>
                    isActive
                      ? "submenu-active"
                      : "submenu-item"
                  }
                >
                  1.1 Vision, Mission & PEO's
                </NavLink>
              </li>

              {/* 1.2 Curriculum */}
              <li>
                <NavLink
                  to="/curriculum"
                  className={({ isActive }) =>
                    isActive
                      ? "submenu-active"
                      : "submenu-item"
                  }
                >
                  1.2 Curriculum Management
                </NavLink>
              </li>

              {/* 1.3 PO PSO */}
              <li>
                <NavLink
                  to="/po-pso"
                  className={({ isActive }) =>
                    isActive
                      ? "submenu-active"
                      : "submenu-item"
                  }
                >
                  1.3 PO, PSO & Mapping
                </NavLink>
              </li>

              {/* 1.4 Course Matrix */}
              <li>
                <NavLink
                  to="/course-matrix"
                  className={({ isActive }) =>
                    isActive
                      ? "submenu-active"
                      : "submenu-item"
                  }
                >
                  1.4 Course Outcomes & Matrix
                </NavLink>
              </li>

              {/* 1.5 Articulation Matrix */}
              <li>
                <NavLink
                  to="/articulation-matrix"
                  className={({ isActive }) =>
                    isActive
                      ? "submenu-active"
                      : "submenu-item"
                  }
                >
                  1.5 All Courses Articulation Matrix
                </NavLink>
              </li>

            </>
          )}

          <li
  className="criteria-title"
  onClick={() => setOpenCriteria2(!openCriteria2)}
>
  {openCriteria2 ? "▼" : "▶"} Criteria 2
</li>

{openCriteria2 && (
  <>

    <li>
      <NavLink
        to="/criteria/2.1-quality-teaching-learning"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        2.1 Quality Teaching Learning
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/criteria/2.2-capstone-project"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        2.2 Capstone Project
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/internship"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        2.3 Internship
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/seminar-mini-project"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        2.4 Seminar / Mini Project
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/case-study"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        2.5 Case Study
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/nptel"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        2.6 NPTEL / SWAYAM
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/complex-problems"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        2.7 Solving Complex Problems
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/industry-partnership"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        2.8 Industry Institute Partnership
      </NavLink>
    </li>

  </>
)}
    <li
  className="criteria-title"
  onClick={() => setOpenCriteria3(!openCriteria3)}
>
  {openCriteria3 ? "▼" : "▶"} Criteria 3
</li>

{openCriteria3 && (
  <>

    <li>
      <NavLink
        to="/criteria/3.1"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        3.1 Evolution Assessment
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/criteria/3.2"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        3.2 Evolution Of End Semester Exam
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/criteria/3.3"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        3.3 Laboratory Workshop
      </NavLink>
    </li>

   <li>
  <NavLink
    to="/criteria/3.4"
    className={({ isActive }) =>
      isActive ? "submenu-active" : "submenu-item"
    }
  >
    3.4 Industrial Training / Internship
  </NavLink>
</li>

    <li>
      <NavLink
        to="/criteria/3.5"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        3.5 Evolution Of Project 
      </NavLink>
    </li>

   <li>
  <NavLink
    to="/criteria/3.6"
    className={({ isActive }) =>
      isActive ? "submenu-active" : "submenu-item"
    }
  >
    3.6 Sustainable Development Goals
  </NavLink>
</li>

    <li>
      <NavLink
        to="/criteria/3.7"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        3.7 Attainment of Course Outcomes
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/criteria/3.8"
        className={({ isActive }) =>
          isActive ? "submenu-active" : "submenu-item"
        }
      >
        3.8 Program Attainment
      </NavLink>
    </li>

  </>
)}
          <li>▶ Criteria 4</li>
        {/* =========================
        CRITERIA 5
========================= */}

<li
  className="criteria-title"
  onClick={() => setOpenCriteria5(!openCriteria5)}
>
  {openCriteria5 ? "▼" : "▶"} Criteria 5
</li>

{openCriteria5 && (
  <>
 <li>
                  <NavLink to="/criteria5/sfr">
                    5.1 Student Faculty Ratio
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/criteria5/qualification">
                    5.2 Faculty Qualifications
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/criteria5/cadre">
                    5.3 Faculty Cadre Proportion
                  </NavLink>
                </li>

  </>
)}
        
          <li>▶ Criteria 7</li>
          <li>▶ Criteria 8</li>
          <li>▶ Criteria 9</li>

          <li>📄 Reports</li>
          <li>⚙ Settings</li>

        </ul>
      </div>

      {/* =========================
            CONTENT
      ========================= */}

      <div className="content">

        <div className="topbar">
          <h2>NBA Accreditation Management System</h2>
        </div>

        <Routes>

          {/* =========================
               HOME
          ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/department-master"
            element={<DepartmentMaster />}
          />

          <Route
            path="/course-master"
            element={<CourseMaster />}
          />
                    {/* =========================
                CRITERIA 1
          ========================= */}

          <Route
            path="/vision"
            element={<VisionMission />}
          />

          <Route
            path="/curriculum"
            element={<Curriculum />}
          />

          <Route
            path="/po-pso"
            element={<PoPso />}
          />

          <Route
            path="/course-matrix"
            element={<CourseMatrix />}
          />

          <Route
            path="/articulation-matrix"
            element={<ArticulationMatrix />}
          />

          {/* =========================
                CRITERIA 2
          ========================= */}

          <Route
            path="/criteria/2.1-quality-teaching-learning"
            element={<QualityTeachingLearning />}
          />

          <Route
            path="/criteria/2.2-capstone-project"
            element={<CapstoneProject />}
          />

          <Route
            path="/internship"
            element={<Internship />}
          />

          <Route
            path="/seminar-mini-project"
            element={<SeminarMiniProject />}
          />

          <Route
            path="/case-study"
            element={<CaseStudy />}
          />

          <Route
            path="/nptel"
            element={<NptelSwayam />}
          />

          <Route
            path="/complex-problems"
            element={<SolvingComplexProblems />}
          />

          <Route
            path="/industry-partnership"
            element={<IndustryInstitutePartnership />}
          />
                    {/* =========================
                CRITERIA 3
          ========================= */}

          <Route
            path="/criteria/3.1"
            element={<EvolutionAssessment />}
          />

          <Route
            path="/criteria/3.2"
            element={<EvolutionOfEndSemesterExam />}
          />

          <Route
            path="/criteria/3.3"
            element={<LaboratoryWorkshop />}
          />

          <Route
  path="/criteria/3.4"
  element={<IndustrialTrainingInternship />}
/>


 <Route 
          path="/criteria/3.5" 
          element={<EvolutionOfProject />} 
        />
<Route
  path="/criteria/3.6"
  element={<SustainableDevelopmentGoals />}
/>
        <Route
  path="/criteria/3.7"
  element={<AttainmentCourseOutcomes />}
/>


 <Route
  path="/criteria/3.8"
  element={<ProgramAttainment />}
/>

     <Route
              path="/criteria5/sfr"
              element={<Criteria5SFR />}
            />

            <Route
              path="/criteria5/qualification"
              element={<Criteria5Qual />}
            />

            <Route
              path="/criteria5/cadre"
              element={<FacultyCadreProportion />}
            />

 
        </Routes>


      </div>

    </div>

    </Router>
  );
}

export default App;