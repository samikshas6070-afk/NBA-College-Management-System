import React from "react";
import { useNavigate } from "react-router-dom";
import "./SeedMoneyView.css";

function SeedMoneyView() {

  const navigate = useNavigate();

  return (

    <div className="seedmoney-view">

      <div className="view-header">

        <h2>Institution Seed Money / Internal Research Grant</h2>

        <button
          className="add-btn"
          onClick={() => navigate("/criteria6/seed-money/add")}
        >
          + Add New
        </button>

      </div>

      <table className="seedmoney-table">

        <thead>

          <tr>

            <th>Sr No</th>
            <th>Faculty Name</th>
            <th>Research Title</th>
            <th>Grant Amount</th>
            <th>Funding Year</th>
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
          onClick={() => navigate("/criteria6/research")}
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default SeedMoneyView;