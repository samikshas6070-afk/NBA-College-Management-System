import React from "react";
import { useNavigate } from "react-router-dom";
import "./DevelopmentActivityView.css";

function DevelopmentActivityView() {

  const navigate = useNavigate();

  return (

    <div className="development-view">

      <div className="view-header">

        <h2>
          Development Activities
        </h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/development-activities/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="development-table">

        <thead>

          <tr>

            <th>Sr No</th>

            <th>Faculty Name</th>

            <th>Activity Type</th>

            <th>Title</th>

            <th>Status</th>

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
            navigate("/criteria6/research")
          }
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default DevelopmentActivityView;