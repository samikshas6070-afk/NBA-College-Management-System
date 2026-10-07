import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";

import {
  FaHome,
  FaUniversity,
  FaUserTie,
  FaUserGraduate,
  FaFileAlt,
  FaCog,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

import "./NBASidebar.css";

function NBASidebar() {
  const [openMenu, setOpenMenu] = useState("");

  const toggleMenu = (menu) => {
    if (openMenu === menu) {
      setOpenMenu("");
    } else {
      setOpenMenu(menu);
    }
  };

  return (
    <div className="sidebar">

      {/* Logo */}

      <div className="logo-box">
        <div className="logo-circle">NBA</div>

        <h2>NBA CMS</h2>

        <p>Accreditation System</p>
      </div>

      {/* Dashboard */}

      <ul>

        <li>
          <Link to="/">
            <FaHome /> Dashboard
          </Link>
        </li>

       <li>
  <Link to="/courses">
    <FaBook /> Courses
  </Link>
</li>

        <li>
          <Link to="/department-master">
            <FaUniversity /> Department
          </Link>
        </li>


        <li>
          <Link to="/faculty">
            <FaUserTie /> Faculty
          </Link>
        </li>

        <li>
          <Link to="/student">
            <FaUserGraduate /> Students
          </Link>
        </li>

       

      </ul>

      <h4>CRITERIA MANAGEMENT</h4>

      {/* =====================
            Criterion 1
      ====================== */}

      <div
        className="criteria-title"
        onClick={() => toggleMenu("c1")}
      >
        <span>Criterion 1</span>

        {openMenu === "c1" ? (
          <FaChevronDown />
        ) : (
          <FaChevronRight />
        )}
      </div>

      {openMenu === "c1" && (
        <ul className="submenu">

          <li>
            <Link to="/vision">
              1.1 Vision & Mission
            </Link>
          </li>

          <li>
            <Link to="/curriculum">
              1.2 Curriculum
            </Link>
          </li>

          <li>
            <Link to="/po-pso">
              1.3 PO & PSO
            </Link>
          </li>

          <li>
            <Link to="/course-matrix">
              1.4 Course Matrix
            </Link>
          </li>

          <li>
            <Link to="/articulation-matrix">
              1.5 Articulation Matrix
            </Link>
          </li>

        </ul>
      )}

      {/* =====================
            Criterion 2
      ====================== */}

      <div
        className="criteria-title"
        onClick={() => toggleMenu("c2")}
      >
        <span>Criterion 2</span>

        {openMenu === "c2" ? (
          <FaChevronDown />
        ) : (
          <FaChevronRight />
        )}
      </div>

      {openMenu === "c2" && (
        <ul className="submenu">

          <li>
            <Link to="/criteria/2.1-quality-teaching-learning">
              2.1 Quality Teaching Learning
            </Link>
          </li>

          <li>
            <Link to="/criteria/2.2-capstone-project">
              2.2 Capstone Project
            </Link>
          </li>

          <li>
            <Link to="/internship">
              2.3 Internship
            </Link>
          </li>

          <li>
            <Link to="/seminar-mini-project">
              2.4 Seminar & Mini Project
            </Link>
          </li>

          <li>
            <Link to="/case-study">
              2.5 Case Study
            </Link>
          </li>

          <li>
            <Link to="/nptel">
              2.6 NPTEL & SWAYAM
            </Link>
          </li>

          <li>
            <Link to="/complex-problems">
              2.7 Solving Complex Problems
            </Link>
          </li>

          <li>
            <Link to="/industry-partnership">
              2.8 Industry Institute Partnership
            </Link>
          </li>

        </ul>
      )}
            {/* =====================
            Criterion 3
      ====================== */}

      <div
        className="criteria-title"
        onClick={() => toggleMenu("c3")}
      >
        <span>Criterion 3</span>

        {openMenu === "c3" ? (
          <FaChevronDown />
        ) : (
          <FaChevronRight />
        )}
      </div>

      {openMenu === "c3" && (
        <ul className="submenu">

          <li>
            <Link to="/criteria/3.1">
              3.1 Evolution Assessment
            </Link>
          </li>

          <li>
            <Link to="/criteria/3.2">
              3.2 End Semester Examination
            </Link>
          </li>

          <li>
            <Link to="/criteria/3.3">
              3.3 Laboratory / Workshop
            </Link>
          </li>

          <li>
            <Link to="/criteria/3.4">
              3.4 Industrial Training / Internship
            </Link>
          </li>

          <li>
            <Link to="/criteria/3.5">
              3.5 Evaluation of Project Work
            </Link>
          </li>

          <li>
            <Link to="/criteria/3.6">
              3.6 Sustainable Development Goals
            </Link>
          </li>

          <li>
            <Link to="/criteria/3.7">
              3.7 Attainment of Course Outcomes
            </Link>
          </li>


<li>
  <Link to="/criteria/3.7.2-course-outcome-attainment">
    3.7.2 Course Outcome Attainment
  </Link>
</li>

          <li>
            <Link to="/criteria/3.8">
              3.8 Program Attainment
            </Link>
          </li>

        </ul>
      )}

      {/* =====================
            Criterion 4
      ====================== */}

      <div
        className="criteria-title"
        onClick={() => toggleMenu("c4")}
      >
        <span>Criterion 4</span>

        {openMenu === "c4" ? (
          <FaChevronDown />
        ) : (
          <FaChevronRight />
        )}
      </div>

      {openMenu === "c4" && (
        <ul className="submenu">

          <li>
            <Link to="/criteria4/4.1">
              4.1 Students Performance
            </Link>
          </li>

        </ul>
      )}

      {/* =====================
            Criterion 5
      ====================== */}

      <div
        className="criteria-title"
        onClick={() => toggleMenu("c5")}
      >
        <span>Criterion 5</span>

        {openMenu === "c5" ? (
          <FaChevronDown />
        ) : (
          <FaChevronRight />
        )}
      </div>

      {openMenu === "c5" && (
        <ul className="submenu">

          <li>
            <Link to="/criteria5/sfr">
              5.1 Student Faculty Ratio
            </Link>
          </li>

          <li>
            <Link to="/criteria5/qualification">
              5.2 Faculty Qualification
            </Link>
          </li>

          <li>
            <Link to="/criteria5/cadre">
              5.3 Faculty Cadre
            </Link>
          </li>

        </ul>
      )}
            {/* =====================
            Criterion 6
      ====================== */}

      <div
        className="criteria-title"
        onClick={() => toggleMenu("c6")}
      >
        <span>Criterion 6</span>

        {openMenu === "c6" ? (
          <FaChevronDown />
        ) : (
          <FaChevronRight />
        )}
      </div>

      {openMenu === "c6" && (
        <ul className="submenu">

          <li>
            <Link to="/criteria6/6.1">
              6.1 Faculty Contributions
            </Link>
          </li>

        </ul>
      )}

      {/* =====================
            Criterion 7
      ====================== */}

      <div
        className="criteria-title"
        onClick={() => toggleMenu("c7")}
      >
        <span>Criterion 7</span>

        {openMenu === "c7" ? (
          <FaChevronDown />
        ) : (
          <FaChevronRight />
        )}
      </div>

      {openMenu === "c7" && (
        <ul className="submenu">

          <li>
            <Link to="/criteria7/7.1">
              7.1 Facilities & Technical Support
            </Link>
          </li>

        </ul>
      )}

      {/* =====================
            Criterion 8
      ====================== */}

      <div
        className="criteria-title"
        onClick={() => toggleMenu("c8")}
      >
        <span>Criterion 8</span>

        {openMenu === "c8" ? (
          <FaChevronDown />
        ) : (
          <FaChevronRight />
        )}
      </div>

      {openMenu === "c8" && (
        <ul className="submenu">

          <li>
            <Link to="/criteria8/8.1">
              8.1 Continuous Improvement
            </Link>
          </li>

        </ul>
      )}

      {/* =====================
            Criterion 9
      ====================== */}

      <div
        className="criteria-title"
        onClick={() => toggleMenu("c9")}
      >
        <span>Criterion 9</span>

        {openMenu === "c9" ? (
          <FaChevronDown />
        ) : (
          <FaChevronRight />
        )}
      </div>

      {openMenu === "c9" && (
        <ul className="submenu">

          <li>
            <Link to="/criteria9/9.1">
              9.1 Student Support & Governance
            </Link>
          </li>

        </ul>
      )}

      {/* Bottom Menu */}

      <div className="bottom-menu">

        <Link to="/reports">
          <FaFileAlt /> Reports
        </Link>

        <Link to="/settings">
          <FaCog /> Settings
        </Link>

      </div>

    </div>
  );
}

export default NBASidebar;