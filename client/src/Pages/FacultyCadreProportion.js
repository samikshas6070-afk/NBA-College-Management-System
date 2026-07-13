import React, { useState } from "react";
import "./FacultyCadreProportion.css";
import {
  FaArrowLeft,
  FaSave,
  FaPaperPlane,
  FaFileAlt,
  FaUpload,
} from "react-icons/fa";

const FacultyCadreProportion = () => {
  const [formData, setFormData] = useState({
    af1: 2,
    af2: 6,
    af3: 18,
    students: 520,
    remarks: "",
  });
  const [fileName, setFileName] = useState("No file chosen");

  // ================= Calculations =================

  const students = Number(formData.students) || 0;
  const af1 = Number(formData.af1) || 0;
  const af2 = Number(formData.af2) || 0;
  const af3 = Number(formData.af3) || 0;

  const rf = students / 20;
  const rf1 = rf / 9;
  const rf2 = (rf * 2) / 9;
  const rf3 = (rf * 6) / 9;

  const professorRatio = rf1 > 0 ? af1 / rf1 : 0;
  const associateRatio = rf2 > 0 ? (af2 / rf2) * 0.6 : 0;
  const assistantRatio = rf3 > 0 ? (af3 / rf3) * 0.4 : 0;

  const totalScore =
    professorRatio +
    associateRatio +
    assistantRatio;

  const finalMarks = Math.min(
    totalScore * 12.5,
    25
  );
  const handleViewReport = () => {

alert(`
Faculty Cadre Report

Actual Professors : ${af1}

Associate Professors : ${af2}

Assistant Professors : ${af3}

Students : ${students}

Required Faculty : ${rf.toFixed(2)}

RF1 : ${rf1.toFixed(2)}

RF2 : ${rf2.toFixed(2)}

RF3 : ${rf3.toFixed(2)}

Final Marks : ${finalMarks.toFixed(2)} /25

`);

};
const handlePrevious = () => {
  window.history.back();
};

const handleSave = () => {
  localStorage.setItem(
    "FacultyCadre",
    JSON.stringify(formData)
  );
  alert("Draft Saved Successfully");
};

const handleSubmit = () => {
  alert("Submitted Successfully");
  console.log({
    ...formData,
    rf,
    rf1,
    rf2,
    rf3,
    totalScore,
    finalMarks,
  });
};

  return (
    <div className="fcp-page">
     <div className="main-card"> 

      {/* ================= HEADER ================= */}
 
      <div className="fcp-header">

        <div className="circle53">
          5.3
        </div>

        <div className="header-content">
          <h2>Faculty Cadre Proportion</h2>
          
        </div>

      </div>
      {/* ================= DETAILS CARD ================= */}

      <div className="details-card">

        <div className="table-heading">
          <div className="left-title">
            Actual Faculty and Student Details
          </div>

          <div className="right-title">
            Required Faculty
          </div>
        </div>

        <div className="faculty-grid">

          {/* AF1 */}

          <div className="field">
            <label>
              Actual Professors
              <br />
              (AF1)
            </label>

            <input
              type="number"
              value={formData.af1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  af1: e.target.value,
                })
              }
            />
          </div>

          {/* AF2 */}

          <div className="field">
            <label>
              Actual Associate Professors
              <br />
              (AF2)
            </label>

            <input
              type="number"
              value={formData.af2}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  af2: e.target.value,
                })
              }
            />
          </div>

          {/* AF3 */}

          <div className="field">
            <label>
              Actual Assistant Professors
              <br />
              (AF3)
            </label>

            <input
              type="number"
              value={formData.af3}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  af3: e.target.value,
                })
              }
            />
          </div>

          {/* Students */}

          <div className="field">
            <label>
              Total No. of Students
              <br />
              in the Program (S)
            </label>

            <input
              type="number"
              value={formData.students}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  students: e.target.value,
                })
              }
            />
          </div>

          {/* RF */}

          <div className="field">
            <label>
              Required Faculty
              <br />
              (RF = S / 20)
            </label>

            <input
              type="text"
              value={rf.toFixed(2)}
              readOnly
            />
          </div>

          {/* RF1 */}

          <div className="field">
            <label>
              Required Professors
              <br />
              (RF1 = RF / 9)
            </label>

            <input
              type="text"
              value={rf1.toFixed(2)}
              readOnly
            />
          </div>

          {/* RF2 */}

          <div className="field">
            <label>
              Required Associate Professors
              <br />
              (RF2 = 2 × RF / 9)
            </label>

            <input
              type="text"
              value={rf2.toFixed(2)}
              readOnly
            />
          </div>

          {/* RF3 */}

          <div className="field">
            <label>
              Required Assistant Professors
              <br />
              (RF3 = 6 × RF / 9)
            </label>

            <input
              type="text"
              value={rf3.toFixed(2)}
              readOnly
            />
          </div>

        </div>

      </div>
      {/* ================= MARKS SECTION ================= */}

      <div className="marks-card">

        <div className="marks-row">

          <div className="marks-title">
            Faculty Cadre Proportion Marks
          </div>

          <div className="formula-box">
            Marks = (AF1/RF1) + (AF2/RF2 × 0.6) + (AF3/RF3 × 0.4) × 12.5
          </div>

          <div className="marks-result">
            {finalMarks.toFixed(2)} / 25
          </div>

        </div>

      </div>

      {/* ================= CALCULATION TABLE ================= */}

      <div className="calculation-card">

        <table className="calculation-table">

          <thead>
            <tr>
              <th>Component</th>
              <th>Formula</th>
              <th>Calculation</th>
              <th>Value</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Professors</td>
              <td>AF1 / RF1</td>
              <td>{af1} / {rf1.toFixed(2)}</td>
              <td>{professorRatio.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Associate Professors (×0.6)</td>
              <td>(AF2 / RF2) × 0.6</td>
              <td>({af2} / {rf2.toFixed(2)}) × 0.6</td>
              <td>{associateRatio.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Assistant Professors (×0.4)</td>
              <td>(AF3 / RF3) × 0.4</td>
              <td>({af3} / {rf3.toFixed(2)}) × 0.4</td>
              <td>{assistantRatio.toFixed(2)}</td>
            </tr>

            <tr className="total-row">
              <td colSpan="3">
                Total Score (Before × 12.5)
              </td>

              <td>
                {totalScore.toFixed(2)}
              </td>
            </tr>

            <tr className="final-row">
              <td colSpan="3">
                Final Marks (×12.5)
              </td>

              <td>
                {finalMarks.toFixed(2)} / 25
              </td>
            </tr>

          </tbody>

        </table>

      </div>
      {/* ================= REPORT SECTION ================= */}

      <div className="report-card">

        <div className="report-header">
          Supporting Documents
        </div>

        <div className="report-body">

          {/* Report */}

          <div className="report-row">

            <div className="report-title">
              <FaFileAlt className="report-icon" />
              Cadre Proportion Calculation Report
            </div>

            <button
  className="view-btn"
  onClick={handleViewReport}
>
  View Report
</button>
          </div>

          {/* Upload */}

          <div className="report-row">

            <div className="report-title">
              <FaUpload className="report-icon" />
              Upload Supporting Document
            </div>

            <div className="upload-box">

              <input
  type="file"
  id="supportDoc"
  hidden
  onChange={(e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  }}
/>

              <label
                htmlFor="supportDoc"
                className="upload-btn"
              >
                Choose File
              </label>

              <span className="file-name">
  {fileName}
</span>
            </div>

          </div>

          {/* Remarks */}

          <div className="remarks-section">

            <label>Remarks</label>

            <textarea
              rows="4"
              placeholder="Enter remarks..."
              value={formData.remarks}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  remarks: e.target.value,
                })
              }
            />

          </div>

        </div>

      </div>

      {/* ================= ACTION BUTTONS ================= */}

      <div className="action-buttons">

        <button
  className="previous-btn"
  onClick={handlePrevious}
>
  <FaArrowLeft />
  <span>Previous</span>
</button>
        <button
  className="save-btn"
  onClick={handleSave}
>
  <FaSave />
  <span>Save Draft</span>
</button>
        <button
  className="submit-btn"
  onClick={handleSubmit}
>
  <FaPaperPlane />
  <span>Submit for Review</span>
</button>

      </div>

    </div>
     </div>
  );
};

export default FacultyCadreProportion;