import React from "react";
import { useNavigate } from "react-router-dom";
import "./AcademicResearchView.css";

function AcademicResearchView() {

  const navigate = useNavigate();

  return (

    <div className="research-view">

      <div className="view-header">

        <h2>Academic Research</h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/academic-research/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="research-table">

        <thead>

          <tr>

            <th>Sr No</th>

            <th>Faculty Name</th>

            <th>Research Title</th>

            <th>Journal / Conference</th>

            <th>Publication Year</th>

            <th>Document</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td colSpan="7">

              No Records Found

            </td>

          </tr>

        </tbody>

      </table>

      <div className="bottom-buttons">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/criteria6/research")
          }
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default AcademicResearchView;