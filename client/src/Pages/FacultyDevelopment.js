import React from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyDevelopment.css";

function FacultyDevelopment() {
  const navigate = useNavigate();

  const sections = [
    {
      no: "6.1.1",
      title: "Memberships in Professional Societies at National / International Levels",
      route: "/criteria6/membership",
    },
    {
      no: "6.1.2.1",
      title: "Faculty as Resource Persons in STTPs / FDPs",
      route: "/criteria6/resource-person",
    },
    {
      no: "6.1.2.2",
      title: "Faculty Members Participation in STTPs / FDPs",
      route: "/criteria6/participation",
    },
    {
      no: "6.1.3",
      title: "Faculty Certification of MOOCs through SWAYAM",
      route: "/criteria6/moocs",
    },
  ];

  return (
    <div className="faculty-development">

      <div className="page-header">
        <h2>Faculty Development</h2>
        <p>Criterion 6.1 - Faculty Development Activities</p>
      </div>

      {sections.map((item, index) => (
        <div className="fd-card" key={index}>

          <div className="fd-left">

            <div className="fd-icon">
              📘
            </div>

            <div>
              <h3>
                {item.no} {item.title}
              </h3>

              <p>
                Maintain supporting documents and faculty records.
              </p>
            </div>

          </div>

          <div className="fd-buttons">

            <button
              className="view-btn"
              onClick={() => navigate(item.route + "/view")}
            >
              View
            </button>

          <button
  className="add-btn"
  onClick={() => navigate(item.route + "/add")}
>
  Add
</button>

          </div>

        </div>
      ))}
<div className="module-navigation">

  <button
    className="module-prev"
    onClick={() => navigate("/criteria5")}
  >
    ← Previous
  </button>

  <button
    className="module-next"
    onClick={() => navigate("/criteria6/faculty-activities")}
  >
    Next →
  </button>

</div>
    </div>
  );
}

export default FacultyDevelopment;