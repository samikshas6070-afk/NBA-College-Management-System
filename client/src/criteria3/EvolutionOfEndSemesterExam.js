import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

import "./EvolutionOfEndSemesterExam.css";

function EvolutionOfEndSemesterExam() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});

  const documents = [
  {
    id: 1,
    documentName: "Question Paper",
    description: "University end semester question papers of all courses.",
  },
  {
    id: 2,
    documentName: "University Result",
    description: "Semester-wise university examination result sheets.",
  },
  {
    id: 3,
    documentName: "Student Assessment",
    description: "Student assessment reports and evaluation records.",
  },
  {
    id: 4,
    documentName: "Assignment Marks",
    description: "Assignment marks of students for each subject.",
  },
  {
    id: 5,
    documentName: "Lab Manual Marks",
    description: "Laboratory manual evaluation and marks records.",
  },
  {
    id: 6,
    documentName: "Internal Marks",
    description: "Internal assessment marks of all students.",
  },
  {
    id: 7,
    documentName: "External Marks",
    description: "External examination marks awarded by the university.",
  },
  {
    id: 8,
    documentName: "Micro Project (SLA)",
    description: "Micro project reports and SLA evaluation documents.",
  },
  {
    id: 9,
    documentName: "Mega Project",
    description: "Major/Mega project reports and final evaluation records.",
  },
];

const handleView = async (row) => {

  try {

    const res = await axios.get(
      "http://localhost:5000/criteria3/files/3.2"
    );

    const file = res.data.files.find(
      (f) => f.document_name === row.documentName
    );

    if (!file) {

      alert("No File Found");

      return;

    }

    window.open(
      `http://localhost:5000/${file.file_path.replace(/\\/g,"/")}`,
      "_blank"
    );

  } catch (err) {

    console.log(err);

    alert("Unable to View File");

  }

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

 const handleDownload = async (row) => {

  try {

    const res = await axios.get(
      "http://localhost:5000/criteria3/files/3.2"
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
      `http://localhost:5000/${file.file_path.replace(/\\/g,"/")}`;

    link.download = file.file_name;

    link.click();

  } catch (err) {

    console.log(err);

    alert("Download Failed");

  }

};

// ===========================
// Delete
// ===========================

const handleDelete = async () => {

  try {

    await axios.delete(
      "http://localhost:5000/criteria3/deleteAll/3.2"
    );

    setFiles({});

    alert("Deleted Successfully");

  } catch (err) {

    console.log(err);

    alert("Delete Failed");

  }

};

// ===========================
// Save
// ===========================

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

      formData.append(
        "criteriaNo",
        "3.2"
      );

      formData.append(
        "documentName",
        row.documentName
      );

      await axios.post(
        "http://localhost:5000/criteria3/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
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



// ===========================
// Submit
// ===========================

const handleSubmit = async () => {

  try {

    await axios.post(
      "http://localhost:5000/criteria3/submit",
      {
        criteriaNo: "3.2",
      }
    );

    alert("Submitted Successfully");

  } catch (err) {

    console.log(err);

    alert("Submission Failed");

  }

};

// ===========================
// Print
// ===========================

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




return (
  <div className="ese-container">

    {/* Header */}
    <div className="ese-header">
      <div className="ese-title-section">

        <div className="ese-badge">
          3.2
        </div>

        <div className="ese-title-text">
          <h2>Evolution of End Semester Exam</h2>
          <p>
            Upload and manage end semester examination related documents.
          </p>
        </div>

      </div>
    </div>

    {/* White Card */}
    <div className="ese-card">

      <div className="ese-table-wrapper">

        <table className="ese-table">

          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Document Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((item) => (
              <tr key={item.id}>

                <td className="sr-no">{item.id}</td>

                <td>{item.documentName}</td>

                <td>
                  <textarea
                    className="description-box"
                    value={item.description}
                    readOnly
                  />
                </td>

                <td className="attachment-cell">

                 <input
  type="file"
  className="file-input"
  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
  onChange={(e) => handleUpload(e, item)}
/>

                  <div className="action-buttons">

                   <button
  className="view-btn"
  onClick={() => handleView(item)}
>
  <FaEye /> View
</button>

<button
  className="download-btn"
  onClick={() => handleDownload(item)}
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

    </div>

    {/* Bottom Buttons - Card च्या बाहेर */}
    <div className="ese-bottom-buttons">

     <button
  className="previous-btn"
  onClick={() => navigate("/criteria/3.1")}
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
  <FaSave />
  Save
</button>

      <button
  className="delete-btn"
  onClick={handleDelete}
>
  <FaTrash />
  Delete
</button>

     <button
  className="submit-btn"
  onClick={handleSubmit}
>
  <FaPaperPlane />
  Submit
</button>

     <button
  className="print-btn"
  onClick={handlePrint}
>
  <FaPrint />
  Print
</button>
      <button
        className="next-btn"
        onClick={() => navigate("/criteria/3.3")}
      >
        Next <FaArrowRight />
      </button>

    </div>

  </div>
);
}

export default EvolutionOfEndSemesterExam;