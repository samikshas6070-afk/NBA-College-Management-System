import React from "react";
import { Link } from "react-router-dom";
import "./SARContents.css";

function SARContents() {
  return (
    <div className="sar-page">

      <div className="sar-header">
        <h3>NATIONAL BOARD OF ACCREDITATION</h3>
      </div>

      <h1 className="sar-title">SAR CONTENTS</h1>

      <table className="sar-table">

        <thead>

          <tr>

            <th>Sr.No.</th>

            <th>Item</th>

            <th>Page No.</th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td>PART A</td>

            <td>Institutional Information</td>

            <td>03-07</td>

          </tr>

          <tr>

            <td>PART B</td>

            <td>Criteria Summary</td>

            <td>08-08</td>

          </tr>

          <tr className="heading">

            <td colSpan="3">
              PROGRAM LEVEL CRITERIA
            </td>

          </tr>

          <tr>

            <td>
              <Link to="/criteria/2.1-quality-teaching-learning">
                Criteria 2.1
              </Link>
            </td>

            <td>Quality Teaching Learning</td>

            <td>09-13</td>

          </tr>

          <tr>

            <td>
              <Link to="/criteria/2.2-capstone-project">
                Criteria 2.2
              </Link>
            </td>

            <td>Capstone Project</td>

            <td>14-14</td>

          </tr>

          <tr>

            <td>
              <Link to="/internship">
                Criteria 2.3
              </Link>
            </td>

            <td>Internship</td>

            <td>15-17</td>

          </tr>

          <tr>

            <td>
              <Link to="/seminar-mini-project">
                Criteria 2.4
              </Link>
            </td>

            <td>Seminar / Mini Project</td>

            <td>18-20</td>

          </tr>

          <tr>

            <td>
              <Link to="/case-study">
                Criteria 2.5
              </Link>
            </td>

            <td>Case Study</td>

            <td>21-23</td>

          </tr>

          <tr>

            <td>
              <Link to="/nptel">
                Criteria 2.6
              </Link>
            </td>

            <td>NPTEL / SWAYAM</td>

            <td>24-26</td>

          </tr>

          <tr>

            <td>
              <Link to="/complex-problems">
                Criteria 2.7
              </Link>
            </td>

            <td>Solving Complex Problems</td>

            <td>27-29</td>

          </tr>

          <tr>

            <td>
              <Link to="/industry-partnership">
                Criteria 2.8
              </Link>
            </td>

            <td>Industry Institute Partnership</td>

            <td>30-32</td>

          </tr>

        </tbody>

      </table>

    </div>
  );
}

export default SARContents;