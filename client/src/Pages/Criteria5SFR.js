import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Criteria5SFR.css";
import {
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
  navigate("/criteria5/qualification");
};

 const [year, setYear] = useState("");
const [department, setDepartment] = useState("");
const [program, setProgram] = useState("");

const [teachers, setTeachers] = useState("");
const [students, setStudents] = useState("");

 const [documentName, setDocumentName] = useState("");
 const [sfrId, setSfrId] = useState(null);
 const [selectedFile, setSelectedFile] = useState(null);
  const ratio =
  teachers !== "" &&
  students !== "" &&
  Number(teachers) > 0
    ? (Number(students) / Number(teachers)).toFixed(2)
    : "";

  
const handleSave = async () => {
  try {

    const res = await axios.post(
      "http://localhost:5000/api/criteria5/sfr",
      {
        academic_year: year,
        department,
        program,
        teachers,
        students,
        ratio,
      }
    );

    console.log("SFR RESPONSE:", res.data);

    setSfrId(res.data.id);

    alert("Data Saved Successfully");

  } catch (err) {

    console.log(err);

    alert("Save Failed");

  }
};
 const handleUpload = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  if (!sfrId) {
    alert("Please click Save first.");
    return;
  }

  try {

    const formData = new FormData();

    formData.append("document", file);
    formData.append("id", sfrId);

    const res = await axios.post(
      "http://localhost:5000/api/criteria5/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // uploaded file name state मध्ये ठेव
    setDocumentName(res.data.data.document);

    alert("Document Uploaded Successfully");

  } catch (err) {

    console.log(err);

    alert("Upload Failed");

  }

};

const handleUpdate = async () => {

  if (!sfrId) {
    alert("Please Save Record First");
    return;
  }

  try {

    await axios.put(
      `http://localhost:5000/api/criteria5/sfr/${sfrId}`,
      {
        academic_year: year,
        department,
        program,
        teachers,
        students,
        ratio,
        document: documentName
      }
    );

    alert("Record Updated Successfully");

  } catch (err) {

    console.log(err);

    alert("Update Failed");

  }

};
const handleDelete = async () => {

  if (!sfrId) {

    alert("Please Save First");

    return;

  }

  if (!window.confirm("Delete this record?")) {

    return;

  }

  try {

    await axios.delete(

      `http://localhost:5000/api/criteria5/sfr/${sfrId}`

    );

    alert("Deleted Successfully");

    handleClear();

  } catch (err) {

    console.log(err);

    alert("Delete Failed");

  }

};

const handlePrint = () => {

  window.print();

};
const handleView = async () => {

  try {

    const res = await axios.get(
      "http://localhost:5000/api/criteria5/sfr"
    );

    console.log(res.data);

    if (res.data.length === 0) {
      alert("No Records Found");
      return;
    }

    const item = res.data[0];

    alert(
`Academic Year : ${item.academic_year}
Department : ${item.department}
Program : ${item.program}
Teachers : ${item.teachers}
Students : ${item.students}
Ratio : ${item.ratio} : 1
Document : ${item.document || "No Document Uploaded"}`
    );

  } catch (err) {

    console.log(err);

    alert("Unable to Load Report");

  }

};
const handleClear = () => {

  setYear("");
  setDepartment("");
  setProgram("");

  setTeachers("");
  setStudents("");

  setDocumentName("");
  setSfrId(null);

  // File input clear
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.value = "";
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

<p>
Dashboard &gt; Criteria Management &gt; Criteria 5
</p>

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
  <option value="">Select Academic Year</option>
  <option value="2026-27">2026-27</option>
  <option value="2025-26">2025-26</option>
  <option value="2024-25">2024-25</option>
  <option value="2023-24">2023-24</option>
  <option value="2022-23">2022-23</option>
  <option value="2021-22">2021-22</option>
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
  <option value="">Select Department</option>
  <option value="Computer Engineering">Computer Engineering</option>
  <option value="Information Technology">Information Technology</option>
  <option value="Electronics Engineering">Electronics Engineering</option>
  <option value="Electrical Engineering">Electrical Engineering</option>
  <option value="Mechanical Engineering">Mechanical Engineering</option>
  <option value="Civil Engineering">Civil Engineering</option>
  <option value="Chemical Engineering">Chemical Engineering</option>
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
  <option value="">Select Program</option>
  <option value="B.E. Computer Engineering">B.E. Computer Engineering</option>
  <option value="B.E. Information Technology">B.E. Information Technology</option>
  <option value="B.E. Electronics Engineering">B.E. Electronics Engineering</option>
  <option value="B.E. Electrical Engineering">B.E. Electrical Engineering</option>
  <option value="B.E. Mechanical Engineering">B.E. Mechanical Engineering</option>
  <option value="B.E. Civil Engineering">B.E. Civil Engineering</option>
  <option value="B.Tech">B.Tech</option>
  <option value="M.E.">M.E.</option>
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
  onChange={(e) => setTeachers(e.target.value)}
/>

        </td>

        <td>

         <input
  type="number"
  value={students}
  onChange={(e) => setStudents(e.target.value)}
/>

        </td>

        <td>
<input
  type="text"
 value={ratio ? `${ratio} : 1` : ""}
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
{documentName && (
  <p style={{ marginTop: "10px", color: "green" }}>
    📄 {documentName}
  </p>
)}
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

  <button className="btn prev">
    Previous
  </button>

  <button className="btn back">
    Back
  </button>

  <button className="btn save" onClick={handleSave}>
    Save
  </button>

  <button
  className="btn update"
  onClick={handleUpdate}
>
  Update
</button>

<button
  className="btn delete"
  onClick={handleDelete}
>
  Delete
</button>

<button
  className="btn print"
  onClick={handlePrint}
>
  Print
</button>
  <button
  className="btn clear"
  onClick={handleClear}
>
  Clear
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