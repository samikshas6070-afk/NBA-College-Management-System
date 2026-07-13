import React from "react";
import { useNavigate } from "react-router-dom";
import "./MoocsView.css";

function MoocsView() {

  const navigate = useNavigate();

  return (

    <div className="moocs-view">

      <div className="view-header">

        <h2>
          Faculty Certification of MOOCs through SWAYAM
        </h2>

        <button
          className="add-btn"
          onClick={() => navigate("/criteria6/moocs/add")}
        >
          + Add New
        </button>

      </div>

      <table className="moocs-table">

        <thead>

          <tr>

            <th>Sr No</th>

            <th>Faculty Name</th>

            <th>Course Name</th>

            <th>Platform</th>

            <th>Duration</th>

            <th>Academic Year</th>

            <th>Certificate</th>

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
          onClick={() => navigate("/criteria6/faculty-development")}
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default MoocsView;