import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaDownload,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTrash,
  FaPaperPlane,
  FaPrint,
} from "react-icons/fa";

import "./ProgramAttainment.css";

function ProgramAttainment() {
  const navigate = useNavigate();
   const [files, setFiles] = useState({});

 const [documents] = useState([
    {
      id: 1,
      name: "Final Attainment",
      description:
        "Upload the final Program Attainment report for the department.",
      file: null,
    },
   
  ]);

 const handleView = async (row) => {
  try {

    const res = await axios.get(
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria3/files/3.8"
    );

    const file = res.data.files.find(
      (f) => f.document_name === row.documentName
    );

    if (!file) {
      alert("No File Found");
      return;
    }

    window.open(
      `http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/${file.file_path.replace(/\\/g, "/")}`,
      "_blank"
    );

  } catch (err) {

    console.log(err);
    alert("Unable to View File");

  }
};
  
const handleDownload = async (row) => {

  try {

    const res = await axios.get(
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria3/files/3.8"
    );

    const file = res.data.files.find(
      (f) => f.document_name === row.documentName
    );

    if (!file) {
      alert("No File Found");
      return;
    }

    const link = document.createElement("a");

    link.href =
      `http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/${file.file_path.replace(/\\/g, "/")}`;

    link.download = file.file_name;

    link.click();

  } catch (err) {

    console.log(err);
    alert("Download Failed");

  }

};

const handleSave = async () => {

  try {

    const uploadedDocs = Object.keys(files);

    if (uploadedDocs.length === 0) {
      alert("Please Upload File First");
      return;
    }

    for (const key of uploadedDocs) {

      const file = files[key];

      const row = documents.find(
        (r) => r.id === parseInt(key)
      );

      const formData = new FormData();

formData.append("file", file);
formData.append("criteriaNo", "3.8");
formData.append("documentName", row.name);
formData.append("description", row.description);

      await axios.post(
        "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria3/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

    }

    alert("Files Saved Successfully");

  } catch (err) {

    console.log(err);
    alert("Save Failed");

  }

};

const handleDelete = async () => {

  try {

    await axios.delete(
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria3/deleteAll/3.8"
    );

    setFiles({});

    alert("Deleted Successfully");

  } catch (err) {

    console.log(err);
    alert("Delete Failed");

  }

};

const handleSubmit = async () => {

  try {

    await axios.post(
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria3/submit",
      {
        criteriaNo: "3.8",
      }
    );

    alert("Submitted Successfully");

  } catch (err) {

    console.log(err);
    alert("Submission Failed");

  }

};

const handlePrint = () => {

  const uploadedFiles = Object.values(files);

  if (uploadedFiles.length === 0) {
    alert("Please Upload File First");
    return;
  }

  uploadedFiles.forEach((file) => {

    const fileURL = URL.createObjectURL(file);

    const printWindow = window.open(
      fileURL,
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      alert("Popup Blocked");
      return;
    }

    printWindow.onload = () => {

      printWindow.focus();
      printWindow.print();

    };

  });

};



const handleUpload = (e, row) => {
  const file = e.target.files[0];

  if (!file) return;

  setFiles((prev) => ({
    ...prev,
    [row.id]: file,
  }));

  alert(file.name + " Uploaded Successfully");
};

    return (
    <div className="program-attainment-container">

      {/* ================= Header ================= */}

      <div className="program-attainment-header">

        <div className="header-left">

          <div className="criteria-badge">
            3.8
          </div>

          <div>
            <h2>Program Attainment</h2>
            <p>
              Upload, View and Download Program Attainment Documents
            </p>
          </div>

        </div>

      </div>

      {/* ================= Table Card ================= */}

      <div className="program-attainment-card">

        <table className="program-attainment-table">

          <thead>

            <tr>
              <th>Sr. No.</th>
              <th>Document Name</th>
              <th>Description</th>
              <th>Upload / Action</th>
            </tr>

          </thead>

          <tbody>

            {documents.map((doc, index) => (

              <tr key={doc.id}>

                <td>{doc.id}</td>

                <td>{doc.name}</td>

               <td>
  <textarea
    className="description-box"
    value={doc.description}
    readOnly
  />
</td>

        <td>
  <div className="action-buttons-row">
   
<input
  type="file"
  className="file-input"
  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
  onChange={(e) => handleUpload(e, doc)}
/>
    <button
      className="view-btn"
      onClick={() => handleView(doc.file)}
    >
      <FaEye /> View
    </button>

    <button
      className="download-btn"
      onClick={() => handleDownload(doc.file)}
    >
      <FaDownload /> Download
    </button>
  </div>
</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
            {/* ================= Bottom Buttons ================= */}

      <div className="program-attainment-footer">

        <button
  className="previous-btn"
  onClick={() => navigate("/criteria/3.7")}
>
  <FaArrowLeft /> Previous
</button>
<button
  className="back-btn"
  onClick={() => navigate("/criteria/3.1")}
>
  <FaArrowLeft /> Back
</button>
       
            <button
         className="save-btn"
         onClick={handleSave}
       >
         <FaSave /> Save
       </button>
       
       <button
         className="delete-btn"
         onClick={handleDelete}
       >
         <FaTrash /> Delete
       </button>
       
       <button
         className="submit-btn"
         onClick={handleSubmit}
       >
         <FaPaperPlane /> Submit
       </button>
       
       <button
         className="print-btn"
         onClick={handlePrint}
       >
         <FaPrint /> Print
       </button>
 
      </div>

    </div>
  );
}

export default ProgramAttainment;