import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

/* =========================================================
   HOME & MASTER PAGES
========================================================= */

import NBAContent from "./Pages/NBAContent";
import DepartmentMaster from "./Pages/DepartmentMaster";
import CourseMaster from "./Pages/CourseMaster";
import Reports from "./Pages/Reports";

/* =========================================================
   CRITERIA 1
========================================================= */

import VisionMission from "./Pages/VisionMission";
import Curriculum from "./Pages/Curriculum";
import PoPso from "./Pages/PoPso";
import CourseMatrix from "./Pages/CourseMatrix";
import ArticulationMatrix from "./Pages/ArticulationMatrix";

/* =========================================================
   CRITERIA 2
========================================================= */

import QualityTeachingLearning from "./criteria/QualityTeachingLearning";
import CapstoneProject from "./criteria/CapstoneProject";
import Internship from "./criteria/Internship";
import SeminarMiniProject from "./criteria/SeminarMiniProject";
import CaseStudy from "./criteria/CaseStudy";
import NptelSwayam from "./criteria/NptelSwayam";
import SolvingComplexProblems from "./criteria/SolvingComplexProblems";
import IndustryInstitutePartnership from "./criteria/IndustryInstitutePartnership";

/* =========================================================
   CRITERIA 3
========================================================= */

import EvolutionAssessment from "./criteria3/EvolutionAssessment";
import EvolutionOfEndSemesterExam from "./criteria3/EvolutionOfEndSemesterExam";
import LaboratoryWorkshop from "./criteria3/LaboratoryWorkshop";
import IndustrialTrainingInternship from "./criteria3/IndustrialTrainingInternship";
import EvolutionOfProject from "./criteria3/EvolutionOfProject";
import SustainableDevelopmentGoals from "./criteria3/SustainableDevelopmentGoals";
import AttainmentCourseOutcomes from "./criteria3/AttainmentCourseOutcomes";
import CourseOutcomeAttainment from "./criteria3/CourseOutcomeAttainment";
import AttainmentPOPSO from "./criteria3/AttainmentPOPSO";



import Courses from "./courses module/courses";
import CourseSyllabus from "./courses module/coursesyllabus";



function App() {
  return (
    <Router>

      <Routes>

        {/* =====================================================
            HOME
        ===================================================== */}

        <Route
          path="/"
          element={<NBAContent />}
        />

        {/* =====================================================
            MASTER / REPORTS
        ===================================================== */}

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/department-master"
          element={<DepartmentMaster />}
        />

        <Route
          path="/course-master"
          element={<CourseMaster />}
        />

        {/* =====================================================
            CRITERIA 1
        ===================================================== */}

        <Route
          path="/criteria/vision-mission"
          element={<VisionMission />}
        />

        <Route
          path="/criteria/curriculum"
          element={<Curriculum />}
        />

        <Route
          path="/criteria/po-pso"
          element={<PoPso />}
        />

        <Route
          path="/criteria/course-matrix"
          element={<CourseMatrix />}
        />

        <Route
          path="/criteria/articulation-matrix"
          element={<ArticulationMatrix />}
        />

        {/* =====================================================
            CRITERIA 2
        ===================================================== */}

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

        {/* =====================================================
            CRITERIA 3
        ===================================================== */}

        {/* 3.1 - Evaluation of Continuous Assessment */}

        <Route
          path="/criteria/3.1"
          element={<EvolutionAssessment />}
        />

        {/* 3.2 - Evaluation of End Semester Examination */}

        <Route
          path="/criteria/3.2"
          element={<EvolutionOfEndSemesterExam />}
        />

        {/* 3.3 - Laboratory / Workshop */}

        <Route
          path="/criteria/3.3"
          element={<LaboratoryWorkshop />}
        />

        {/* 3.4 - Industrial Training / Internship */}

        <Route
          path="/criteria/3.4"
          element={<IndustrialTrainingInternship />}
        />

        {/* 3.5 - Evaluation of Project */}

        <Route
          path="/criteria/3.5"
          element={<EvolutionOfProject />}
        />

        {/* 3.6 - Sustainable Development Goals */}

        <Route
          path="/criteria/3.6"
          element={<SustainableDevelopmentGoals />}
        />

        {/* 3.7.1 - Attainment of Course Outcomes */}

        <Route
          path="/criteria/3.7"
          element={<AttainmentCourseOutcomes />}
        />

        {/* 3.7.2 - Course Outcome Attainment */}

        <Route
          path="/criteria/3.7.2"
          element={<CourseOutcomeAttainment />}
        />

        {/* 3.8 - Attainment of PO / PSO */}

        <Route
          path="/criteria/3.8"
          element={<AttainmentPOPSO />}
        />
        <Route
  path="/courses"
  element={<Courses />}
/>

<Route
  path="/course-syllabus"
  element={<CourseSyllabus />}
/>
      </Routes>

    </Router>
  );
}

export default App;