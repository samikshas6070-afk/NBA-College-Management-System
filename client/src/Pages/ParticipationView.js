import React from "react";
import { useNavigate } from "react-router-dom";
import "./ParticipationView.css";

function ParticipationView() {

  const navigate = useNavigate();

  return (

    <div className="participation-view">

      <div className="view-header">

        <h2>
          Faculty Members Participation in STTPs / FDPs
        </h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/participation/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="participation-table">

        <thead>

          <tr>

            <th>Sr No</th>

            <th>Faculty Name</th>

            <th>Programme Name</th>

            <th>Organization</th>

            <th>Venue</th>

            <th>Duration</th>

            <th>Academic Year</th>

            <th>Document</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td colSpan="9">

              No Records Found

            </td>

          </tr>

        </tbody>

      </table>

      <div className="bottom-buttons">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/criteria6/faculty-development")
          }
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default ParticipationView;