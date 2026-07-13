import React from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyActivities.css";

function FacultyActivities() {

  const navigate = useNavigate();

  const sections = [
    {
      no: "6.1.4",
      title: "FDP / STTP Organized by the Department",
      route: "/criteria6/fdp"
    },
    {
      no: "6.1.5",
      title: "Faculty Support in Student Innovative Projects",
      route: "/criteria6/student-project"
    },
    {
      no: "6.1.6",
      title: "Faculty Internship / Training / Collaboration with Industry",
      route: "/criteria6/internship"
    }
  ];

  return (

    <div className="faculty-activity-container">

      <div className="activity-title">

        <h2>Faculty Activities</h2>

        <p>
          Criterion 6.1 Faculty Activities
        </p>

      </div>

      {sections.map((item,index)=>(

        <div
          className="activity-card"
          key={index}
        >

          <div>

            <h3>

              {item.no} {item.title}

            </h3>

            <p>

              Upload and manage faculty activity records.

            </p>

          </div>

          <div className="activity-buttons">

            <button
              className="view-btn"
              onClick={()=>
              navigate(item.route+"/view")
              }
            >
              View
            </button>

            <button
              className="add-btn"
              onClick={()=>
              navigate(item.route+"/add")
              }
            >
              Add
            </button>

          </div>

        </div>

      ))}
<div className="module-navigation">

  <button
    className="module-prev"
    onClick={() => navigate("/criteria6/faculty-development")}
  >
    ← Previous
  </button>

  <button
    className="module-next"
    onClick={() => navigate("/criteria6/research")}
  >
    Next →
  </button>

</div>
    </div>

  );

}

export default FacultyActivities;