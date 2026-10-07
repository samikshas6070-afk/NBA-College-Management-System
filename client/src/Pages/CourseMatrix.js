import React,
{
  useState,
  useEffect
}
from "react";
import "./CourseMatrix.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUpload,
  FaDownload
} from "react-icons/fa";
import { FaPrint } from "react-icons/fa";

function CourseMatrix({ onNext, onPrevious }) {
  const [coFile, setCoFile] = useState(null);
const [matrixFile, setMatrixFile] = useState(null);
const [summaryFile, setSummaryFile] = useState("");

const [academicYear, setAcademicYear] = useState("");
const [department, setDepartment] = useState("");
const [program, setProgram] = useState("");
const [uploadedOutcomeFile, setUploadedOutcomeFile] = useState("");
const [uploadedMatrixFile, setUploadedMatrixFile] = useState("");
const [mappedPO, setMappedPO] = useState("");

const [po1, setPo1] = useState("");
const [po2, setPo2] = useState("");
const [po3, setPo3] = useState("");
const [po4, setPo4] = useState("");
const [po5, setPo5] = useState("");
const [matrixData, setMatrixData] = useState({
  CO1: { po1: "", po2: "", po3: "", po4: "", po5: "" },
  CO2: { po1: "", po2: "", po3: "", po4: "", po5: "" },
  CO3: { po1: "", po2: "", po3: "", po4: "", po5: "" }
});
const [editId, setEditId] = useState(null);
const [subjects, setSubjects] = useState([]);
const [pos, setPos] = useState([]);
const [selectedSubject, setSelectedSubject] = useState("");
const [matrixRows, setMatrixRows] = useState([]);
const [courseMatrix,setCourseMatrix]=useState([]);
const [coSubject, setCoSubject] = useState("");
const [matrixSubject, setMatrixSubject] = useState("");
const loadCourseMatrix = async () => {

  try {

    const res = await fetch(
      "http://localhost:5000/get-course-matrix"
    );

    const data = await res.json();

    if (Array.isArray(data)) {

      setCourseMatrix(data);

      // Latest Matrix File
      if (data.length > 0) {
        setUploadedMatrixFile(data[0].matrix_file || "");
      }

    } else {

      setCourseMatrix([]);

    }

  } catch (error) {

    console.log(error);

    setCourseMatrix([]);

  }

};

const [courseOutcome, setCourseOutcome] = useState("");
const loadCourseOutcomes = async () => {

  const res = await fetch(
    "http://localhost:5000/get-course-outcomes"
  );

  const data = await res.json();

  console.log("Course Outcomes =", data);

  if (Array.isArray(data)) {

    setCourseOutcomes(data);

    // Latest Outcome file load
    if (data.length > 0) {
      setUploadedOutcomeFile(data[0].outcome_file || "");
    }

  } else {

    setCourseOutcomes([]);

  }

};
const [courseSummary,setCourseSummary]=useState([]);


const [courseOutcomes, setCourseOutcomes] = useState([]);
useEffect(() => {

  loadCourseOutcomes();

  loadCourseMatrix();

  //loadCourseSummary();
  loadPOs();

}, []);

useEffect(() => {

  loadSubjects();

}, [department]);
useEffect(() => {

  loadMatrixRows();

}, [selectedSubject]);

const loadCourseSummary = async()=>{

const res=await fetch(
"http://localhost:5000/get-course-summary"
);

const data=await res.json();

setCourseSummary(data);

}


const loadSubjects = async () => {

  if (!department) return;

  const res = await fetch(
    `http://localhost:5000/get-subjects/${department}`
  );

  const data = await res.json();

  setSubjects(data);

};
const loadPOs = async () => {

  const res = await fetch(
    "http://localhost:5000/get-pos"
  );

  const data = await res.json();

  setPos(data);

};
const loadMatrixRows = async () => {

  if (!selectedSubject) return;

  const res = await fetch(
    `http://localhost:5000/get-subject-co/${selectedSubject}`
  );

  const data = await res.json();

  setMatrixRows(data);

};
const handleAddCO = async () => {

  if (!selectedSubject) {
    alert("Please select Subject.");
    return;
  }

  if (!courseOutcome) {
    alert("Please enter Course Outcome.");
    return;
  }

  try {

    let url = "http://localhost:5000/save-course-outcome";
    let method = "POST";

    if (editId) {
      url = `http://localhost:5000/update-course-outcome/${editId}`;
      method = "PUT";
    }

    const formData = new FormData();

    formData.append("academicYear", academicYear);
    formData.append("department", department);
    formData.append("subjectCode", selectedSubject);
    formData.append("courseOutcome", courseOutcome);
    formData.append("mappedPO", mappedPO);

    if (!coFile) {
  alert("Please select Outcome File");
  return;
}

formData.append("outcomeFile", coFile);

console.log("coFile =", coFile);

for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

    const response = await fetch(url, {
      method,
      body: formData
    });

    const data = await response.json();

console.log("Backend Response =", data);

setUploadedOutcomeFile(data.fileName);

console.log("State File =", data.fileName);

alert(data.message);
    await loadCourseOutcomes();

  } catch (error) {

    console.log(error);
    alert("Save Error");

  }
  setCoFile(null);
document.getElementById("outcomeFile").value = "";
};
const handleSave = async () => {

  try {const formData = new FormData();

formData.append("academicYear", academicYear);
formData.append("department", department);
formData.append("program", program);
formData.append("courseOutcome", courseOutcome);
formData.append("mappedPO", mappedPO);
formData.append("subjectCode", selectedSubject);

if (matrixFile) {
  formData.append("matrixFile", matrixFile);
}

const response = await fetch(
  "http://localhost:5000/save-course-matrix",
  {
    method: "POST",
    body: formData
  }
);


    const data = await response.json();
    console.log("Uploaded File =", data.fileName);

    alert(data.message);

    await loadCourseOutcomes();
    await loadCourseMatrix();
    //await loadCourseSummary();

  } catch (error) {

    console.log(error);
    alert("Save Error");

  }

};
const courses = {

  "MCA": [
    { code: "MCA101", name: "Programming in C" },
    { code: "MCA102", name: "Data Structures" }
  ],

  "BCA": [
    { code: "BCA101", name: "Computer Fundamentals" },
    { code: "BCA102", name: "Web Technology" }
  ],

  "BBA": [
    { code: "BBA101", name: "Principles of Management" },
    { code: "BBA102", name: "Business Communication" }
  ],

  "Computer Science & Engineering": [
    { code: "CS201", name: "Data Structures" },
    { code: "CS202", name: "DBMS" }
  ]

};
  

const handleSubmit = () => {
  alert("Submitted Successfully");
};

const handleEdit = (row) => {

  setEditId(row.id);

  setCourseOutcome(row.course_outcome);

  setMappedPO(row.mapped_po);

};
const handleDelete = async (id) => {

  if (!window.confirm("Delete this record?")) return;

  try {

    const response = await fetch(
      `http://localhost:5000/delete-course-outcome/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    alert(data.message);

    await loadCourseOutcomes();

  } catch (error) {

    console.log(error);

    alert("Delete Error");

  }

};
const handleMatrixSave = async (coId) => {

  const row = document.getElementById(coId);
  const inputs = row.querySelectorAll("input");

  const formData = new FormData();

  formData.append("academicYear", academicYear);
  formData.append("department", department);
  formData.append("subjectCode", selectedSubject);
  formData.append("coId", coId);

  formData.append("po1", inputs[0].value);
  formData.append("po2", inputs[1].value);
  formData.append("po3", inputs[2].value);
  formData.append("po4", inputs[3].value);
  formData.append("po5", inputs[4].value);
console.log("matrixFile =", matrixFile);
  // File compulsory
  if (!matrixFile) {
    alert("Please select Matrix File");
    return;
  }

  formData.append("matrixFile", matrixFile);

  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const response = await fetch(
    "http://localhost:5000/save-course-matrix",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

console.log("Backend Response =", data);

setUploadedMatrixFile(data.fileName);

console.log("Matrix File =", data.fileName);

alert(data.message);
};
const handleDownload = () => {

  window.open(
    "http://localhost:5000/download-course-matrix",
    "_blank"
  );

};

const handleMatrixView = () => {

  if (!uploadedMatrixFile) {
    alert("Please upload Matrix file first.");
    return;
  }

  window.open(
    `http://localhost:5000/uploads/${uploadedMatrixFile}`,
    "_blank"
  );

};
const handleMatrixPrint = () => {

  if (!uploadedMatrixFile) {
    alert("Please upload Matrix file first.");
    return;
  }

  const extension = uploadedMatrixFile
    .split(".")
    .pop()
    .toLowerCase();

  if (extension === "pdf") {

    const win = window.open(
      `http://localhost:5000/uploads/${uploadedMatrixFile}`,
      "_blank"
    );

    if (win) {
      win.onload = () => {
        win.print();
      };
    }

  } else {

    window.open(
      `http://localhost:5000/download/${uploadedMatrixFile}`,
      "_blank"
    );

    alert("Open the downloaded file in Word/Excel and press Ctrl + P.");

  }

};
const handleMatrixDownload = () => {

  if (!uploadedMatrixFile) {
    alert("Please upload Matrix file first.");
    return;
  }

  window.open(
    `http://localhost:5000/download/${uploadedMatrixFile}`,
    "_blank"
  );

};
const handleOutcomeView = () => {

  console.log("uploadedOutcomeFile =", uploadedOutcomeFile);
  console.log("coFile =", coFile);

  const fileName = uploadedOutcomeFile;

  if (!fileName) {
    alert("No Outcome file found.");
    return;
  }

  window.open(
    `http://localhost:5000/uploads/${fileName}`,
    "_blank"
  );

};
const handleOutcomeDownload = () => {

  if (!uploadedOutcomeFile) {
    alert("Please upload file first.");
    return;
  }

  window.open(
    `http://localhost:5000/download/${uploadedOutcomeFile}`,
    "_blank"
  );

};
const handleOutcomePrint = () => {

  if (!uploadedOutcomeFile) {
    alert("Please upload Outcome file first.");
    return;
  }

  const extension = uploadedOutcomeFile
    .split(".")
    .pop()
    .toLowerCase();

  if (extension === "pdf") {

    const win = window.open(
      `http://localhost:5000/uploads/${uploadedOutcomeFile}`,
      "_blank"
    );

    if (win) {
      win.onload = () => {
        win.print();
      };
    }

  } else {

    window.open(
      `http://localhost:5000/download/${uploadedOutcomeFile}`,
      "_blank"
    );

    alert("Open the downloaded file in Word/Excel and press Ctrl + P.");

  }

};


const handlePrevious = () => {
  onPrevious();
};
  return (
    <div className="course-matrix-page">

      {/* Header */}

      <div className="page-title">
        <h1>
          Criteria 1.4 : Course Outcomes & Matrix
        </h1>
      </div>

      {/* Filters */}

      <div className="filter-card">

        <div className="filter-box">
          <label>Academic Year</label>
         <select
  value={academicYear}
  onChange={(e) => setAcademicYear(e.target.value)}
>
  <option value="">Select Academic Year</option>

  <option value="2011-12">2011-12</option>
  <option value="2012-13">2012-13</option>
  <option value="2013-14">2013-14</option>
  <option value="2014-15">2014-15</option>
  <option value="2015-16">2015-16</option>
  <option value="2016-17">2016-17</option>
  <option value="2017-18">2017-18</option>
  <option value="2018-19">2018-19</option>
  <option value="2019-20">2019-20</option>
  <option value="2020-21">2020-21</option>
  <option value="2021-22">2021-22</option>
  <option value="2022-23">2022-23</option>
  <option value="2023-24">2023-24</option>
  <option value="2024-25">2024-25</option>
  <option value="2025-26">2025-26</option>
  <option value="2026-27">2026-27</option>
</select>
        </div>

        <div className="filter-box">
  <label>Department</label>
<select
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
>
  <option value="">Select Department Type</option>

  <option value="Computer Science & Engineering">
    Computer Science & Engineering
  </option>

  <option value="Information Technology">
    Information Technology
  </option>

  <option value="Artificial Intelligence & Data Science">
    Artificial Intelligence & Data Science
  </option>

  <option value="Electronics & Telecommunication">
    Electronics & Telecommunication
  </option>

  <option value="Electrical Engineering">
    Electrical Engineering
  </option>

  <option value="Mechanical Engineering">
    Mechanical Engineering
  </option>

  <option value="Civil Engineering">
    Civil Engineering
  </option>

  <option value="MBA">
    MBA
  </option>

  <option value="MCA">
    MCA
  </option>

  <option value="BCA">
    BCA
  </option>

  <option value="BBA">
    BBA
  </option>
  
  <option value="Science">
  Science
  </option>
  <option value="Commerce">
Commerce
  </option>
  <option value="Arts">
Arts
  </option>


</select>
        </div>

   <button
  className="download-btn"
  onClick={handleDownload}
>
  <FaDownload />
  Download Report
</button>     


      </div>

      {/* 1.4.1 */}

      <div className="section-card">

        <div className="section-header">
          1.4.1 Course Outcomes
        </div>

        <div className="section-content">

          <div className="left-content">

            <div className="top-row">

              

<select
  value={mappedPO}
  onChange={(e) => setMappedPO(e.target.value)}
>
  <option value="">Select PO</option>
  <option value="PO1">PO1</option>
  <option value="PO2">PO2</option>
  <option value="PO3">PO3</option>
  <option value="PO4">PO4</option>
  <option value="PO5">PO5</option>
</select>
<div className="filter-box">

<label>Subject</label>

<select
  value={selectedSubject}
  onChange={(e) => setSelectedSubject(e.target.value)}
>

  <option value="">Select Subject</option>

  {subjects.map((subject) => (

    <option
      key={subject.course_code}
      value={subject.course_code}
    >
      {subject.course_name} ({subject.course_code})
    </option>

  ))}

</select>

</div>

<textarea
  placeholder="Enter Course Outcome"
  value={courseOutcome}
  onChange={(e) => setCourseOutcome(e.target.value)}
  className="co-textarea"
/>

<button
  className="add-btn"
  onClick={handleAddCO}
>
  <FaPlus />
{editId ? "Update Course Outcome" : "Add Course Outcome"}
</button>
            </div>

            <table>

              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Outcomes</th>
                  <th>Mapped PO</th>
                  <th>Action</th>
                </tr>
              </thead>
               <tbody>

{courseOutcomes.map((row, index) => (

<tr key={row.id}>

<td>{index + 1}</td>

<td>{row.course_outcome}</td>

<td>{row.mapped_po}</td>

<td>
<button onClick={() => handleEdit(row)}>
<FaEdit/>
</button>

<button onClick={() => handleDelete(row.id)}>
<FaTrash/>
</button>
</td>

</tr>

))}

</tbody>
            </table>

          </div>

          <label htmlFor="outcomeFile" className="upload-panel">

  <FaUpload className="upload-icon" />

  <h4>Upload Supporting Document</h4>

  <p>(Max. size 10MB)</p>
<div
  className="pdf-name"
  title={uploadedOutcomeFile || (coFile && coFile.name)}
>
  {uploadedOutcomeFile || (coFile && coFile.name)}
</div>
<div className="document-actions">

  <button
    type="button"
    className="view-btn"
    onClick={handleOutcomeView}
  >
    👁 View
  </button>

  <button
    type="button"
    className="download-btn-upload"
    onClick={handleOutcomeDownload}
  >
    <FaDownload />
    Download
  </button>

  <button
    type="button"
    className="print-btn-upload"
    onClick={handleOutcomePrint}
  >
    <FaPrint />
    Print
  </button>

</div>
  <input
  id="outcomeFile"
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  onChange={(e) => setCoFile(e.target.files[0])}
/>
</label>


        </div>
        

      </div>

      {/* 1.4.2 */}

      <div className="section-card">

        <div className="section-header">
          1.4.2 Course Articulation Matrix
        </div>

        <div className="section-content">

          <div className="left-content">

            <div className="top-row">
<select
  value={selectedSubject}
  onChange={(e) => setSelectedSubject(e.target.value)}
>

  <option value="">Select Subject</option>

  {subjects.map((subject) => (

    <option
      key={subject.course_code}
      value={subject.course_code}
    >
      {subject.course_name} ({subject.course_code})
    </option>

  ))}

</select>


            </div>

            <table>

             <thead>
<tr>
  <th>CO/PO</th>
  <th>PO1</th>
  <th>PO2</th>
  <th>PO3</th>
  <th>PO4</th>
  <th>PO5</th>
  <th>Action</th>
</tr>
</thead>

           <tbody>
<tr id="CO1">
<td>CO1</td>

<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>

<td>
<button
  className="matrix-save-btn"
  onClick={() => handleMatrixSave("CO1")}
>
  Save
</button>
</td>

</tr>
<tr id="CO2">

<td>CO2</td>

<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>

<td>
<button
  className="matrix-save-btn"
  onClick={() => handleMatrixSave("CO2")}
>
  Save
</button>
</td>

</tr>

<tr id="CO3">

<td>CO3</td>

<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>
<td><input type="number" min="0" max="100" /></td>

<td>
<button
  className="matrix-save-btn"
  onClick={() => handleMatrixSave("CO3")}
>
  Save
</button>
</td>

</tr>

</tbody>
            </table>

          </div>
<label htmlFor="matrixFile" className="upload-panel">

  <FaUpload className="upload-icon" />

  <h4>Upload Supporting Document</h4>

  <p>(Max. size 10MB)</p>

  <div
  className="pdf-name"
  title={uploadedMatrixFile || (matrixFile && matrixFile.name)}
>
  {uploadedMatrixFile || (matrixFile && matrixFile.name)}
</div>
 <div className="document-actions">

  <button
    type="button"
    className="view-btn"
    onClick={handleMatrixView}
  >
    👁 View
  </button>

  <button
    type="button"
    className="download-btn-upload"
    onClick={handleMatrixDownload}
  >
    <FaDownload />
    Download
  </button>

  <button
    type="button"
    className="print-btn-upload"
    onClick={handleMatrixPrint}
  >
    <FaPrint />
    Print
  </button>

</div>
  <input
    id="matrixFile"
    type="file"
    hidden
    accept=".pdf,.doc,.docx,.xls,.xlsx"
    onChange={(e) => {
      console.log("Selected Matrix File =", e.target.files[0]);
      setMatrixFile(e.target.files[0]);
    }}
  />

</label>
        </div>

      </div>


           

          
    <div className="footer-buttons">

<button
className="previous-btn"
onClick={handlePrevious}
>
Previous
</button>

<button
className="submit-btn"
onClick={handleSubmit}
>
Submit
</button>

<button
className="next-page-btn"
onClick={onNext}
>
Next →
</button>

</div>
      </div>
  );
}

export default CourseMatrix;