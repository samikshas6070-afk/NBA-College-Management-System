import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentProjectView.css";

function StudentProjectView() {

  const navigate = useNavigate();

  return (

    <div className="student-view">

      <div className="view-header">

        <h2>
          Faculty Support in Student Innovative Projects
        </h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/student-project/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="student-table">

        <thead>

          <tr>

            <th>Sr No</th>
            <th>Faculty Name</th>
            <th>Student Name</th>
            <th>Project Title</th>
            <th>Competition/Event</th>
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
          onClick={() =>
            navigate("/criteria6/faculty-activities")
          }
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default StudentProjectView;