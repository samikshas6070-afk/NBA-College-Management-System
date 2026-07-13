import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PoPso.css";
import {
  FaFileAlt,
  FaSave,
  FaEdit,
  FaTrash
} from "react-icons/fa";

function PoPso({ onNext, onPrevious }) {
  const navigate = useNavigate();
const [poPsoFile, setPoPsoFile] = useState(null);
const [mappingFile, setMappingFile] = useState(null);
const [justificationFile, setJustificationFile] = useState(null);
const handleSave = async () => {

  try {

    const formData = new FormData();
if (poPsoFile) {
  formData.append("poPsoFile", poPsoFile);
}
   if (mappingFile) {
  formData.append("mappingFile", mappingFile);
}

   if (justificationFile) {
  formData.append("justificationFile", justificationFile);
}
    const response = await fetch(
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/save-popso",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    alert(data.message);

  } catch (error) {

    console.log(error);

    alert("Save Error");

  }

};
const handleView = (fileName) => {

  if (!fileName) {
    alert("Please upload file first.");
    return;
  }

  const extension = fileName.split(".").pop().toLowerCase();

  if (extension === "pdf") {

    window.open(
      `http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/uploads/${fileName}`,
      "_blank"
    );

  } else {

    window.open(
      `http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/download/${fileName}`,
      "_blank"
    );

  }

};
const handleDownload = (fileName) => {

  if (!fileName) {
    alert("Please upload file first.");
    return;
  }

  window.open(
    `http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/download/${fileName}`,
    "_blank"
  );

};
const handlePrint = (fileName) => {

  if (!fileName) {
    alert("Please upload file first.");
    return;
  }

  const extension = fileName.split(".").pop().toLowerCase();

  if (extension === "pdf") {

    const win = window.open(
      `http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/uploads/${fileName}`,
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
      `http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/download/${fileName}`,
      "_blank"
    );

    alert(
      "Open the downloaded file and print it."
    );

  }

};
  const handleUpdate = () => {
    alert("Data Updated Successfully");
  };

  const handleDelete = () => {
    alert("Data Deleted Successfully");
  };

  return (
    <div className="popso-page">

      <div className="popso-container">

        {/* 1.3.1 */}
        <div className="po-card">

          <div className="card-header">
            <h3>
              1.3 PO, PSO, & mapping with courses – Attachment.
            </h3>

            <FaFileAlt />
          </div>

          <div className="card-body">

            <h4>1.3.1 PO & PSO</h4>

           <input
  id="poPsoFile"
  type="file"
  onChange={(e) => {
  if (e.target.files.length > 0) {
    setPoPsoFile(e.target.files[0]);
  }
}}
/>

           <p className="file-name">
  {poPsoFile?.name}
</p>
<div className="popso-actions">

  <button
    className="popso-view-btn"
    onClick={() => handleView(poPsoFile?.name)}
  >
    👁 View
  </button>

  <button
    className="popso-download-btn"
    onClick={() => handleDownload(poPsoFile?.name)}
  >
    ⬇ Download
  </button>

  <button
    className="popso-print-btn"
    onClick={() => handlePrint(poPsoFile?.name)}
  >
    🖨 Print
  </button>

</div>   </div>

        </div>

        {/* 1.3.2 */}

        <div className="po-card">

          <div className="card-header">
            <h3>
              1.3 PO, PSO, & mapping with courses – Attachment.
            </h3>

            <FaFileAlt />
          </div>

          <div className="card-body">

            <h4>1.3.2 Mapping</h4>

           <input
  id="mappingFile"
  type="file"
 onChange={(e) => {
  if (e.target.files.length > 0) {
    setMappingFile(e.target.files[0]);
  }
}}
/>

           <p className="file-name">
  {mappingFile?.name}
</p>
<div className="popso-body">

  <div className="popso-file-box">

    <p className="file-name">
      {mappingFile?.name}
    </p>

  </div>

  <div className="popso-actions">

    <button
      className="popso-view-btn"
      onClick={() => handleView(mappingFile?.name)}
    >
      👁 View
    </button>

    <button
      className="popso-download-btn"
      onClick={() => handleDownload(mappingFile?.name)}
    >
      ⬇ Download
    </button>

    <button
      className="popso-print-btn"
      onClick={() => handlePrint(mappingFile?.name)}
    >
      🖨 Print
    </button>

  </div>

</div>
          </div>

        </div>

        {/* 1.3.3 */}

        <div className="po-card">

          <div className="card-header">
            <h3>
              1.3 PO, PSO, & mapping with courses – Attachment.
            </h3>

            <FaFileAlt />
          </div>

          <div className="card-body">

            <h4>
              1.3.3 Justification of Mapping
            </h4>

           <input
  id="justificationFile"
  type="file"
 onChange={(e) => {
  if (e.target.files.length > 0) {
    setJustificationFile(e.target.files[0]);
  }
}}
/>

           <p className="file-name">
  {justificationFile?.name}
</p>
<div className="popso-body">

  <div className="popso-file-box">


    <p className="file-name">
      {justificationFile?.name}
    </p>

  </div>

  <div className="popso-actions">

    <button
      className="popso-view-btn"
      onClick={() => handleView(justificationFile?.name)}
    >
      👁 View
    </button>

    <button
      className="popso-download-btn"
      onClick={() => handleDownload(justificationFile?.name)}
    >
      ⬇ Download
    </button>

    <button
      className="popso-print-btn"
      onClick={() => handlePrint(justificationFile?.name)}
    >
      🖨 Print
    </button>

  </div>

</div>
          </div>

        </div>

        <div className="btn-row">
<button
  className="previous-btn"
  onClick={() => navigate("/curriculum")}
>
  ← Previous
</button>
          <button
            className="save-btn"
            onClick={handleSave}
          >
            <FaSave /> Save
          </button>

          <button
            className="update-btn"
            onClick={handleUpdate}
          >
            <FaEdit /> Update
          </button>

           <button
           className="delete-main-btn"
           onClick={handleDelete}
         >
           <FaTrash /> Delete
         </button>
       
      <button
  className="next-page-btn"
  onClick={() => navigate("/CourseMatrix")}
>
  Next →
</button>
        </div>

      </div>

    </div>
  );
}

export default PoPso;