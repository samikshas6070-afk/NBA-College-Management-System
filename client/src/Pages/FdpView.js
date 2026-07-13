import React from "react";
import { useNavigate } from "react-router-dom";
import "./FdpView.css";

function FdpView() {

  const navigate = useNavigate();

  return (

    <div className="fdp-view">

      <div className="view-header">

        <h2>FDP / STTP Organized by the Department</h2>

        <button
          className="add-btn"
          onClick={() => navigate("/criteria6/fdp/add")}
        >
          + Add New
        </button>

      </div>

      <table className="fdp-table">

        <thead>

          <tr>
            <th>Sr No</th>
            <th>Programme Name</th>
            <th>Coordinator</th>
            <th>Duration</th>
            <th>Participants</th>
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

export default FdpView;