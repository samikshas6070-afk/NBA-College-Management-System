import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Curriculum.css";
import {
  FaBell,
  FaBook,
  FaGraduationCap,
  FaFlask,
  FaCloudUploadAlt,
  FaEdit,
  FaTrash,
  FaSave,
  FaSyncAlt
} from "react-icons/fa";
import { FaDownload, FaPrint, FaEye } from "react-icons/fa";

function Curriculum({ onNext, onPrevious }) {
  const navigate = useNavigate();

const [syllabusPdf, setSyllabusPdf] = useState(null);
const [pdfName, setPdfName] = useState("");
const [activityName, setActivityName] = useState("");
const [facultyName, setFacultyName] = useState("");
const [teachingLearningProcess, setTeachingLearningProcess] = useState("");

const [attachmentName, setAttachmentName] = useState(null);
const [deptFile, setDeptFile] = useState(null);
const [scienceFile, setScienceFile] = useState(null);
const [mdmFile, setMdmFile] = useState(null);
const [contentFile, setContentFile] = useState(null);
const [proofFile, setProofFile] = useState(null);
const handleSave = async () => {
console.log(document.getElementById("tlpAttachment"));
console.log(document.getElementById("tlpAttachment")?.files);

console.log(document.getElementById("syllabusFile"));
console.log(document.getElementById("syllabusFile")?.files);
  try {

    const formData = new FormData();

    formData.append(
      "teachingLearningProcess",
      teachingLearningProcess
    );

    formData.append(
      "activityName",
      activityName
    );

    formData.append(
      "facultyName",
      facultyName
    );

    formData.append(
      "tlpAttachment",
      document.getElementById("tlpAttachment").files[0]
    );

    formData.append(
      "syllabusFile",
      document.getElementById("syllabusFile").files[0]
    );

    formData.append(
      "departmentSubjectsFile",
      document.getElementById("departmentSubjectsFile").files[0]
    );

    formData.append(
      "generalScienceFile",
      document.getElementById("generalScienceFile").files[0]
    );

    formData.append(
      "mdmElectiveFile",
      document.getElementById("mdmElectiveFile").files[0]
    );

    formData.append(
      "curriculumGapFile",
      document.getElementById("curriculumGapFile").files[0]
    );

    formData.append(
      "activityFile",
      document.getElementById("activityFile").files[0]
    );
for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
    const response = await fetch(
      "http://localhost:5000/save-curriculum",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    alert(data.message);

  } catch (error) {

    console.log(error);
    alert(error.message);

  }

};
const handleView = (file) => {

  if (!file) {
    alert("Please upload file first.");
    return;
  }

  const extension = file.name.split(".").pop().toLowerCase();

  if (extension === "pdf") {

    window.open(
      `http://localhost:5000/uploads/${file.name}`,
      "_blank"
    );

  } else {

    window.open(
      `http://localhost:5000/download/${file.name}`,
      "_blank"
    );

  }

};
const handleFileDownload = (file) => {

  if (!file) {
    alert("Please upload file first.");
    return;
  }

  window.open(
    `http://localhost:5000/download/${file.name}`,
    "_blank"
  );

};

const handleNext = () => {
  navigate("/po-pso");
};
const handleFilePrint = (file) => {

  if (!file) {
    alert("Please upload file first.");
    return;
  }

  const extension = file.name.split(".").pop().toLowerCase();

  if (extension === "pdf") {

    const win = window.open(
      `http://localhost:5000/uploads/${file.name}`,
      "_blank"
    );

    if (win) {
      win.onload = () => {
        win.focus();
        win.print();
      };
    }

  } else {

    window.open(
      `http://localhost:5000/download/${file.name}`,
      "_blank"
    );

    alert(
      "Open the downloaded file and print it."
    );

  }

};
const handlePdfUpload = (e) => {

  const file = e.target.files[0];

  if(file){
    setSyllabusPdf(file);
    setPdfName(file.name);
  }
};

const handleAttachmentUpload = (e) => {
  const file = e.target.files[0];

  if(file){
    setAttachmentName(file.name);
  }
};

const handleDeptUpload = (e) => {
  if (e.target.files[0]) {
    setDeptFile(e.target.files[0].name);
  }
};

const handleScienceUpload = (e) => {
  if (e.target.files[0]) {
    setScienceFile(e.target.files[0].name);
  }
};

const handleMdmUpload = (e) => {
  if (e.target.files[0]) {
    setMdmFile(e.target.files[0].name);
  }
};
const handleProofUpload = (e) => {
  if (e.target.files[0]) {
    setProofFile(e.target.files[0].name);
  }
};
const handleContentUpload = (e) => {
  if (e.target.files[0]) {
    setContentFile(e.target.files[0].name);
  }
};
const handleViewPdf = () => {
  if (syllabusPdf) {
    window.open(URL.createObjectURL(syllabusPdf));
  } else {
    alert("Please upload PDF first");
  }
};


const handleUpdate = () => {
  alert("Data Updated Successfully");
};

const handleDelete = () => {
  alert("Data Deleted Successfully");
};
const handleEdit = () => {
  alert("Edit Clicked");
};

const handleDeleteRow = () => {
  alert("Delete Clicked");
};
const handlePrevious = () => {
  onPrevious();
};
  return (
    <div className="curriculum-page">

   
      {/* 1.2.1 */}
      <div className="section purple-section">
        <h2>1.2.1 Curriculum Program Structure</h2>

        <div className="grid-2">

          <div className="card">
            <h3>
              <FaGraduationCap /> Teaching Learning Process
            </h3>

            <textarea
  placeholder="Enter teaching learning process..."
  value={teachingLearningProcess}
  onChange={(e) =>
    setTeachingLearningProcess(e.target.value)
  }
/>

            <label>Attachment</label>
<div className="upload-box">

  <FaCloudUploadAlt />

  <p>
    {attachmentName || "Upload Attachment"}
  </p>

  <input
    id="tlpAttachment"
    type="file"
    accept=".pdf"
    onChange={handleAttachmentUpload}
  />

</div>
<div className="document-actions">

  <button
    className="view-btn"
    onClick={() => handleView(deptFile)}
  >
    <FaEye />
    View
  </button>

  <button
    className="download-btn-upload"
    onClick={() => handleFileDownload(deptFile)}
  >
    <FaDownload />
    Download
  </button>

  <button
    className="print-btn-upload"
    onClick={() => handleFilePrint(deptFile)}
  >
    <FaPrint />
    Print
  </button>

</div></div>

          <div className="card">
            <h3>
              <FaBook /> Course Syllabus
            </h3>

            <div className="file-view">
              <span>
  {pdfName || "No PDF Uploaded"}
</span>
              <button onClick={handleViewPdf}>
  View
</button>
            </div>

            <label>Upload New Syllabus</label>
<div className="upload-box">

  <FaCloudUploadAlt />

  <p>
    {pdfName || "Upload PDF"}
  </p>

  <input
    id="syllabusFile"
    type="file"
    accept=".pdf"
    onChange={handlePdfUpload}
  />

</div>
<div className="document-actions">

  <button
    className="view-btn"
    onClick={() => handleView(deptFile)}
  >
    <FaEye />
    View
  </button>

  <button
    className="download-btn-upload"
    onClick={() => handleFileDownload(deptFile)}
  >
    <FaDownload />
    Download
  </button>

  <button
    className="print-btn-upload"
    onClick={() => handleFilePrint(deptFile)}
  >
    <FaPrint />
    Print
  </button>

</div>
          </div>

        </div>
      </div>

      {/* 1.2.2 */}
      <div className="section blue-section">

        <h2>1.2.2 Components of Program Curriculum</h2>

        <div className="grid-3">

          <div className="mini-card">
            <FaBook />
            <h4>Department Subjects</h4>

           <div className="upload-box">

  <p>{deptFile || "Upload Attachment"}</p>

  <input
    id="departmentSubjectsFile"
    type="file"
    onChange={handleDeptUpload}
  />

</div>
<div className="document-actions">

  <button
    className="view-btn"
    onClick={() => handleView(deptFile)}
  >
    <FaEye />
    View
  </button>

  <button
    className="download-btn-upload"
    onClick={() => handleFileDownload(deptFile)}
  >
    <FaDownload />
    Download
  </button>

  <button
    className="print-btn-upload"
    onClick={() => handleFilePrint(deptFile)}
  >
    <FaPrint />
    Print
  </button>

</div>
          </div>

          <div className="mini-card">
            <FaFlask />
<div className="upload-box">

  <p>{scienceFile || "Upload Attachment"}</p>

  <input
    id="generalScienceFile"
    type="file"
    onChange={handleScienceUpload}
  />

</div>
<div className="document-actions">

  <button
    className="view-btn"
    onClick={() => handleView(deptFile)}
  >
    <FaEye />
    View
  </button>

  <button
    className="download-btn-upload"
    onClick={() => handleFileDownload(deptFile)}
  >
    <FaDownload />
    Download
  </button>

  <button
    className="print-btn-upload"
    onClick={() => handleFilePrint(deptFile)}
  >
    <FaPrint />
    Print
  </button>

</div>
          </div>

          <div className="mini-card">
            <FaGraduationCap />
            <h4>MDM Elective Subject</h4>
<div className="upload-box">

  <p>{mdmFile || "Upload Attachment"}</p>

  <input
    id="mdmElectiveFile"
    type="file"
    onChange={handleMdmUpload}
  />

</div>
<div className="document-actions">

  <button
    className="view-btn"
    onClick={() => handleView(deptFile)}
  >
    <FaEye />
    View
  </button>

  <button
    className="download-btn-upload"
    onClick={() => handleFileDownload(deptFile)}
  >
    <FaDownload />
    Download
  </button>

  <button
    className="print-btn-upload"
    onClick={() => handleFilePrint(deptFile)}
  >
    <FaPrint />
    Print
  </button>

</div> </div>

        </div>
      </div>

      {/* Bottom Section */}

      <div className="bottom-grid">

        {/* Gap Analysis */}
        <div className="section green-section">

          <h2>1.2.3 Curriculum Gap Analysis</h2>

  <div className="upload-box">

  <p>{proofFile || "Upload Proof"}</p>

  <input
    id="curriculumGapFile"
    type="file"
    onChange={handleProofUpload}
  />

</div>
<div className="document-actions">

  <button
    className="view-btn"
    onClick={() => handleView(deptFile)}
  >
    <FaEye />
    View
  </button>

  <button
    className="download-btn-upload"
    onClick={() => handleFileDownload(deptFile)}
  >
    <FaDownload />
    Download
  </button>

  <button
    className="print-btn-upload"
    onClick={() => handleFilePrint(deptFile)}
  >
    <FaPrint />
    Print
  </button>

</div>

        </div>

        {/* Content Beyond Syllabus */}

        <div className="section orange-section">

          <h2>1.2.4 Content Beyond Syllabus</h2>
          <div className="input-row">

  <input
    type="text"
    placeholder="Activity Name"
    value={activityName}
    onChange={(e) => setActivityName(e.target.value)}
  />

  <button
    className="edit-btn"
    onClick={handleEdit}
  >
    <FaEdit />
  </button>

  <button
    className="delete-btn"
    onClick={handleDeleteRow}
  >
    <FaTrash />
  </button>

</div>
<div className="input-row">

  <input
    type="text"
    placeholder="Faculty Name"
    value={facultyName}
    onChange={(e) => setFacultyName(e.target.value)}
  />

  <button
    className="edit-btn"
    onClick={handleEdit}
  >
    <FaEdit />
  </button>

  <button
    className="delete-btn"
    onClick={handleDeleteRow}
  >
    <FaTrash />
  </button>

</div>
        <div className="upload-box">

  <p>{contentFile || "Upload File"}</p>

  <input
    id="activityFile"
    type="file"
    onChange={handleContentUpload}
  />

</div>
<div className="document-actions">

  <button
    className="view-btn"
    onClick={() => handleView(deptFile)}
  >
    <FaEye />
    View
  </button>

  <button
    className="download-btn-upload"
    onClick={() => handleFileDownload(deptFile)}
  >
    <FaDownload />
    Download
  </button>

  <button
    className="print-btn-upload"
    onClick={() => handleFilePrint(deptFile)}
  >
    <FaPrint />
    Print
  </button>

</div>

          <table>
            <thead>
              
            </thead>

            <tbody>

              <tr>
               

                <td>
                 
                </td>
              </tr>

            </tbody>
          </table>

        <div className="btn-group">
 <button
  className="previous-page-btn"
  onClick={handlePrevious}
>
  ← Previous
</button>
  <button
  className="save-btn"
  onClick={handleSave}
>
  Save
</button>

  <button
    className="update-btn"
    onClick={handleUpdate}
  >
    Update
  </button>

  <button
    className="delete-main-btn"
    onClick={handleDelete}
  >
    Delete
  </button>

  <button
  className="next-page-btn"
  onClick={() => navigate("/po-pso")}
>
  Next →
</button>
</div>

        </div>

      </div>

    </div>
  );
}

export default Curriculum;