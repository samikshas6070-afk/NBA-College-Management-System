import React from "react";
import { useNavigate } from "react-router-dom";
import "./ConsultancyView.css";

function ConsultancyView() {

  const navigate = useNavigate();

  return (

    <div className="consultancy-view">

      <div className="view-header">

        <h2>Consultancy Work</h2>

        <button
          className="add-btn"
          onClick={() => navigate("/criteria6/consultancy/add")}
        >
          + Add New
        </button>

      </div>

      <table className="consultancy-table">

        <thead>

          <tr>

            <th>Sr No</th>
            <th>Faculty Name</th>
            <th>Consultancy Title</th>
            <th>Organization</th>
            <th>Amount</th>
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
          onClick={() => navigate("/criteria6/research")}
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default ConsultancyView;