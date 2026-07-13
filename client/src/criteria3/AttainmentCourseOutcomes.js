import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaDownload,
  FaPrint,
  FaArrowLeft,
  FaSave,
  FaTrash,
  FaPaperPlane,
  FaArrowRight,
} from "react-icons/fa";

import "./AttainmentCourseOutcomes.css";

function AttainmentCourseOutcomes() {

  const navigate = useNavigate();
  const [files, setFiles] = useState({});

  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentName: "Attainment given by Faculty",
      description: "Faculty-wise attainment calculation report",
      file: null,
    },
    {
      id: 2,
      documentName: "Course Outcome Attachment",
      description: "CO attainment supporting documents",
      file: null,
    },
    {
      id: 3,
      documentName: "Theory Attainment",
      description: "Theory attainment report",
      file: null,
    },
    {
      id: 4,
      documentName: "Practical Attainment",
      description: "Practical attainment report",
      file: null,
    },
  ]);

  const handleView = async (row) => {
  try {

    const res = await axios.get(
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria3/files/3.7"
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
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria3/files/3.7"
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
      formData.append("criteriaNo", "3.7");
      formData.append("documentName", row.documentName);

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
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria3/deleteAll/3.7"
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
        criteriaNo: "3.7",
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
  <div className="attainment-page">
    <div className="course-container">

      {/* ===========================
          PAGE HEADER
      =========================== */}

      <div className="page-header">
        <div className="header-left">

          <div className="criteria-circle">
            3.7
          </div>

          <div className="header-content">
            <h2>Attainment of Course Outcomes</h2>

            <p>
              Upload and manage attainment of course outcomes related documents.
            </p>
          </div>

        </div>
      </div>

      {/* ===========================
          TABLE CARD
      =========================== */}

      <div className="course-card">

        <table className="course-table">

          <thead>
            <tr>
              <th style={{ width: "8%" }}>Sr. No.</th>
              <th style={{ width: "25%" }}>Particulars</th>
              <th style={{ width: "32%" }}>Description</th>
              <th style={{ width: "35%" }}>Action</th>
            </tr>
          </thead>

          <tbody>

            {documents.map((doc, index) => (

              <tr key={doc.id}>

                <td>{doc.id}</td>

                <td>{doc.documentName}</td>

                <td>
                  <div className="description-box">
                    {doc.description}
                  </div>
                </td>

                <td>

                  <div className="attachment-box">

<input
  type="file"
  className="file-input"
  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
  onChange={(e) => handleUpload(e, doc)}
/>

                    <div className="attachment-buttons">

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

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
            {/* ===========================
          BOTTOM BUTTONS
      =========================== */}

      <div className="bottom-buttons">

<button
  className="previous-btn"
  onClick={() => navigate("/criteria/3.6")}
>
  <FaArrowLeft /> Previous
</button>

       <button
  className="back-btn"
  onClick={() => navigate("/criteria/3.1")}
>
  <FaArrowLeft /> Back
</button>

        <div className="right-buttons">

         
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
          <button
            className="next-btn"
            onClick={() => navigate("/criteria/3.8")}
          >
            Next
            <FaArrowRight />
          </button>

        </div>

      </div>

    </div>
  </div>
);
}

export default AttainmentCourseOutcomes;