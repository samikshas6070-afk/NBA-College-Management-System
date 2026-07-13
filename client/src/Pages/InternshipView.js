import React from "react";
import { useNavigate } from "react-router-dom";
import "./InternshipView.css";

function InternshipView() {

  const navigate = useNavigate();

  return (

    <div className="internship-view">

      <div className="view-header">

        <h2>
          Faculty Internship / Training / Collaboration with Industry
        </h2>

        <button
          className="add-btn"
          onClick={() => navigate("/criteria6/internship/add")}
        >
          + Add New
        </button>

      </div>

      <table className="internship-table">

        <thead>

          <tr>

            <th>Sr No</th>

            <th>Faculty Name</th>

            <th>Organization</th>

            <th>Training Title</th>

            <th>Duration</th>

            <th>Academic Year</th>

            <th>Document</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td colSpan="8">

              No Records Found

            </td>

          </tr>

        </tbody>

      </table>

      <div className="bottom-buttons">

        <button
          className="back-btn"
          onClick={() => navigate("/criteria6/faculty-activities")}
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default InternshipView;