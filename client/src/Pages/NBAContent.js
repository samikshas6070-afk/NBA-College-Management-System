import React from "react";
import "./NBAContent.css";
import { FaBook } from "react-icons/fa";
import {
  FaBell,
  FaHome,
  FaUniversity,
  FaUserTie,
  FaUserGraduate,
  FaFileAlt,
  FaCog,
  FaChevronRight
} from "react-icons/fa";
import { Link } from "react-router-dom";

function NBAContent() {

 const rows = [
  { code: "PART A", item: "Institutional Information", path: "/part-a" },
  { code: "PART B", item: "Criteria Summary", path: "/part-b" },

  { section: "PROGRAM LEVEL CRITERIA" },

  {
    code: "Criterion 1",
    item: "Outcome-Based Curriculum",
    path: "/vision"
  },

  {
    code: "Criterion 2",
    item: "Outcome-Based Teaching Learning",
    path: "/criteria/2.1-quality-teaching-learning"
  },

  {
    code: "Criterion 3",
    item: "Outcome-Based Assessment",
    path: "/criteria/3.1"
  },

  {
    code: "Criterion 4",
    item: "Students' Performance",
    path: "/criteria/4.1"   // Route तयार असल्यास
  },

  {
    code: "Criterion 5",
    item: "Faculty Information",
    path: "/criteria5/sfr"
  },

  {
    code: "Criterion 6",
    item: "Faculty Contributions",
    path: "/criteria/6.1"   // Route तयार असल्यास
  },

  {
    code: "Criterion 7",
    item: "Facilities and Technical Support",
    path: "/criteria/7.1"
  },

  {
    code: "Criterion 8",
    item: "Continuous Improvement",
    path: "/criteria/8.1"
  },

  { section: "INSTITUTE LEVEL CRITERIA" },

  {
    code: "Criterion 9",
    item: "Student Support and Governance",
    path: "/criteria/9.1"
  }
];
  return (

    <div className="layout">

      {/* Sidebar */}

      <div className="sidebar">

        <div className="logo-box">

          <div className="logo-circle">
            NBA
          </div>

          <h2>NBA CMS</h2>

          <p>Accreditation System</p>

        </div>

        <ul>

          <li className="active">
            <Link to="/dashboard">
              <FaHome /> Dashboard
            </Link>
          </li>
<li>
  <Link to="/courses">
    <FaBook /> Courses
  </Link>
</li>

          <li>
            <Link to="/department">
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

       
        <div className="bottom-menu">

          <Link to="/reports">
            <FaFileAlt /> Reports
          </Link>

          <Link to="/settings">
            <FaCog /> Settings
          </Link>

        </div>

      </div>

      {/* Main */}

      <div className="main-content">

        <div className="topbar">

          <div></div>

          <div className="admin">

            <FaBell className="bell"/>

            <div className="avatar">
              NBA
            </div>

            <span>NBA Admin</span>

          </div>

        </div>

        {/* Banner */}

        <div className="banner">

          <div className="banner-left">

            <h1>NBA CONTENT</h1>

            <h3>National Board of Accreditation</h3>

          </div>

          <div className="banner-right">

            <div className="nba-logo">
              NBA
            </div>

          </div>

        </div>

        {/* Table */}

        <div className="table-card">

          <table>

            <thead>

              <tr>

                <th>Serial Code & Link to Item</th>

                <th>Item</th>

                <th>Go To Section</th>

              </tr>

            </thead>

            <tbody>

              {rows.map((row,index)=>

                row.section ?

                <tr key={index} className="section">

                  <td colSpan="3">

                    {row.section}

                  </td>

                </tr>

                :

                <tr key={index}>

                  <td><b>{row.code}</b></td>

                  <td>{row.item}</td>

                  

                   <td>
  <Link to={row.path}>
    <button className="go-btn">
      Go to Section <FaChevronRight />
    </button>
  </Link>
</td>
                  

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="footer">

          <h3>

            Promoting Quality and Excellence in Technical Education

          </h3>

          <p>

            © 2025 National Board of Accreditation. All Rights Reserved.

          </p>

        </div>

      </div>

    </div>

  );
}

export default NBAContent;