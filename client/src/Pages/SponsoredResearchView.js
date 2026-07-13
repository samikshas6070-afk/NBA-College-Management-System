import React from "react";
import { useNavigate } from "react-router-dom";
import "./SponsoredResearchView.css";

function SponsoredResearchView() {

  const navigate = useNavigate();

  return (

    <div className="sponsored-view">

      <div className="view-header">

        <h2>Sponsored Research Projects</h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/sponsored-research/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="sponsored-table">

        <thead>

          <tr>

            <th>Sr No</th>
            <th>Faculty Name</th>
            <th>Project Title</th>
            <th>Funding Agency</th>
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

export default SponsoredResearchView;