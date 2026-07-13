import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Criteria5SFR.css";
import {
  FaDownload,
  FaSave,
  FaUpload,
  FaFileAlt,
  FaCalendarAlt,
  FaUniversity,
  FaGraduationCap
} from "react-icons/fa";

function Criteria5SFR() {
  const navigate = useNavigate();
const handleNext = () => {
  navigate("/criteria/5.2");
};
  const [year, setYear] = useState("2024-25");
  const [department, setDepartment] = useState("Computer Engineering");
  const [program, setProgram] = useState("B.E. Computer Engineering");

  const [teachers, setTeachers] = useState(26);
  const [students, setStudents] = useState(520);

  const ratio =
    teachers > 0
      ? (students / teachers).toFixed(2)
      : "0.00";

  const handleDownload = () => {
    alert("Download Report");
  };

  const handleSave = () => {
    alert("Draft Saved");
  };

  const handleView = () => {
    alert("Student Faculty Ratio : " + ratio + " : 1");
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];

    if(file){
      alert(file.name + " Uploaded Successfully");
    }
  };


  return (

<div className="criteria5">
 <div className="main-card">

<div className="page-heading">

<h1>CRITERION 5</h1>

<h2>
FACULTY INFORMATION & STUDENT FACULTY RATIO
</h2>

</div>

<div className="filter-card">

<div className="filter-item">

<label>Academic Year</label>

<div className="input-box">

<FaCalendarAlt/>

<select
  value={year}
  onChange={(e) => setYear(e.target.value)}
>
  <option>2026-27</option>
  <option>2025-26</option>
  <option>2024-25</option>
  <option>2023-24</option>
  <option>2022-23</option>
  <option>2021-22</option>
</select>

</div>

</div>

<div className="filter-item">

<label>Department</label>

<div className="input-box">

<FaUniversity/>

<select
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
>
  <option>Computer Engineering</option>
  <option>Information Technology</option>
  <option>Electronics Engineering</option>
  <option>Electrical Engineering</option>
  <option>Mechanical Engineering</option>
  <option>Civil Engineering</option>
  <option>Chemical Engineering</option>
</select>

</div>

</div>

<div className="filter-item">

<label>Program</label>

<div className="input-box">

<FaGraduationCap/>

<select
  value={program}
  onChange={(e) => setProgram(e.target.value)}
>
  <option>B.E. Computer Engineering</option>
  <option>B.E. Information Technology</option>
  <option>B.E. Electronics Engineering</option>
  <option>B.E. Electrical Engineering</option>
  <option>B.E. Mechanical Engineering</option>
  <option>B.E. Civil Engineering</option>
  <option>B.Tech</option>
  <option>M.E.</option>
</select>
</div>

</div>


</div>
{/* ================= SFR CARD ================= */}

<div className="sfr-card">

  <div className="sfr-header">

    <div className="circle">
      5.1
    </div>

    <h3>Student Faculty Ratio (SFR)</h3>

  </div>

  <table className="sfr-table">

    <thead>

      <tr>

        <th>Academic Year</th>

        <th>No. of Full Time Teachers (F)</th>

        <th>No. of Students (S)</th>

        <th>Student Faculty Ratio (S/F)</th>

        <th>Benchmark</th>

        <th>Action</th>

      </tr>

    </thead>

    <tbody>

      <tr>

        <td>{year}</td>

        <td>

          <input
            type="number"
            value={teachers}
            onChange={(e)=>setTeachers(Number(e.target.value))}
          />

        </td>

        <td>

          <input
            type="number"
            value={students}
            onChange={(e)=>setStudents(Number(e.target.value))}
          />

        </td>

        <td>

          <input
            type="text"
            value={ratio + " : 1"}
            readOnly
          />

        </td>

        <td>

          <input
            type="text"
            value="1 : 20"
            readOnly
          />

        </td>

        <td>

          <button
            className="view-btn"
            onClick={handleView}
          >

            <FaFileAlt />

            View Report

          </button>

        </td>

      </tr>

    </tbody>

  </table>

  <div className="upload-area">

    <label className="upload-btn">

      <FaUpload />

      Upload Supporting Document

      <input
        type="file"
        hidden
        onChange={handleUpload}
      />

    </label>

  </div>
 
 
 

</div>

 <div className="note-box">
  <div className="note-title-row">
    <span className="note-icon">ℹ️</span>
    <span className="note-title">Note:</span>
  </div>

  <div className="note-body">
    If the number of students admitted at different levels (UG and PG) and in
    different programs is as such that SFR varies widely, then SFR as
    calculated above may not be the most appropriate (as per the NBA Manual).
  </div>
</div>
{/* ================= ACTION BUTTONS ================= */}

<div className="action-buttons">

  
  <button className="btn save" onClick={handleSave}>
    Save
  </button>

  <button className="btn update">
    Update
  </button>

  <button className="btn delete">
    Delete
  </button>

  <button className="btn print">
    Print
  </button>

  <button
  className="btn next"
  onClick={handleNext}
>
  Next
</button>

</div>
<div>
      </div>
   

</div>
</div>  



);
}

export default Criteria5SFR;