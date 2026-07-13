import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {

  const navigate = useNavigate();

  return (
    <div className="home-container">

      <h1>NBA College Management System</h1>

      <div className="card-container">

        {/* Department Master */}

        <div
          className="module-card"
          onClick={() => navigate("/department-master")}
        >
          <div className="icon">🏢</div>

          <h2>Department Master</h2>

          <p>Manage Department Information</p>
        </div>

        {/* Course Master */}

        <div
          className="module-card"
          onClick={() => navigate("/course-master")}
        >
          <div className="icon">🎓</div>

          <h2>Course Master</h2>

          <p>Manage Course Information</p>
        </div>

        {/* Criteria 2 */}

        <div
          className="module-card"
          onClick={() =>
            navigate("/criteria/2.1-quality-teaching-learning")
          }
        >
          <div className="icon">📚</div>

          <h2>Criteria 2</h2>

          <p>
            Outcome Based Teaching Learning Process
          </p>
        </div>

        {/* Criteria 3 */}

        <div
          className="module-card"
          onClick={() =>
            navigate("/criteria/3.1")
          }
        >
          <div className="icon">🧪</div>

          <h2>Criteria 3</h2>

          <p>
            Research, Innovations and Extension
          </p>
        </div>

      </div>

    </div>
  );
}

export default Home;