import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

import "./CapstoneProject.css";

function CapstoneProject() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});

  const rows = [
    {
      id: 1,
      documentName: "Capstone Project Attachment",
      description:
        "Final year capstone project report and related documents",
    },
    {
      id: 2,
      documentName: "CO Mapping Attachment",
      description: "Course Outcomes mapping document",
    },
    {
      id: 3,
      documentName: "PO's Mapping Attachment",
      description: "Program Outcomes mapping and attainment document",
    },
  ];

  // Upload
  const handleUpload = (e, item) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [item.id]: file,
    }));

    alert(`${file.name} uploaded successfully`);
  };

  // VIEW FILE
  const handleView = (item) => {
    const file = files[item.id];
    if (!file) return alert("No file uploaded");

    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  // DOWNLOAD FILE
  const handleDownload = (item) => {
    const file = files[item.id];
    if (!file) return alert("No file uploaded");

    const url = URL.createObjectURL(file);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();

    URL.revokeObjectURL(url);
  };

  // SAVE
 const handleSave = async () => {
  try {
    const uploadedDocs = Object.keys(files);

    if (uploadedDocs.length === 0) {
      alert("Please upload file first");
      return;
    }

    // Recently uploaded files
    let recentFiles =
      JSON.parse(localStorage.getItem("recentUploadedFiles")) || [];

    for (const key of uploadedDocs) {

      const file = files[key];

      const row = rows.find(
        (r) => r.id === parseInt(key)
      );

      const formData = new FormData();

      formData.append("file", file);
      formData.append("criteriaNo", "2.2");
      formData.append("documentName", row.documentName);

      const res = await axios.post(
        "http://localhost:5000/criteria/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Save uploaded file name for Print
      recentFiles.push({
        criteriaNo: "2.2",
        file_name: res.data.data.file_name,
      });
    }

    localStorage.setItem(
      "recentUploadedFiles",
      JSON.stringify(recentFiles)
    );

    alert("Files Saved Successfully");

  } catch (err) {
    console.log(err);
    alert("Error while saving");
  }
};
  // DELETE
 const handleDelete = async () => {

  try {

    await axios.delete(
      "http://localhost:5000/criteria/deleteAll/2.2"
    );

    setFiles({});

    alert("Deleted Successfully");

  } catch (err) {

    console.log(err);
    alert("Error while deleting");
  }
};

  // SUBMIT
  const handleSubmit = async () => {

  try {

    await axios.post(
      "http://localhost:5000/criteria/submit",
      {
        criteriaNo: "2.2"
      }
    );

    alert("Submitted Successfully");

  } catch (err) {

    console.log(err);
    alert("Submission Failed");
  }
};

  // PRINT
  const handlePrint = () => {
    const uploadedFiles = Object.values(files);

    if (uploadedFiles.length === 0) {
      alert("No file uploaded");
      return;
    }

    uploadedFiles.forEach((file) => {
      const fileURL = URL.createObjectURL(file);

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.src = fileURL;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          } catch (err) {
            alert(
              "Print not supported for this file type. Please use PDF."
            );
          }
        }, 1000);
      };
    });

    uploadedFiles.forEach((file) => {
      const fileURL = URL.createObjectURL(file);
      const printWindow = window.open(fileURL, "_blank");

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    });
  };

  return (
    <div className="capstone-container">

      {/* Header */}
      <div className="capstone-header">
        <div className="capstone-title-section">
          <span className="capstone-badge">2.2</span>
          <div>
            <h2>Capstone Project</h2>
            <p>Upload and manage Capstone Project related documents.</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="capstone-card">
        <table className="capstone-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
<th>Document Name</th>
<th>Description</th>
<th>Attachment</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
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
    accept=".pdf"
    className="file-input"
    onChange={(e) => handleUpload(e, item)}
  />

  

  <div className="action-buttons">

    <button
      type="button"
      className="capstone-view-btn"
      onClick={() => handleView(item)}
    >
      <FaEye /> View
    </button>

    <button
      type="button"
      className="capstone-download-btn"
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

      {/* Bottom Buttons */}

      
      <div className="capstone-bottom-buttons">
<button
  className="previous-btn"
  onClick={() =>
    navigate("/criteria/2.1-quality-teaching-learning")
  }
>
  <FaArrowLeft /> Previous
</button>

<button
  className="back-btn"
  onClick={() =>
    navigate("/criteria/2.1-quality-teaching-learning")
  }
>
  <FaArrowLeft /> Back
</button>

        <button
          className="capstone-save-btn"
          onClick={handleSave}
        >
          <FaSave /> Save
        </button>

        <button
          className="capstone-delete-btn"
          onClick={handleDelete}
        >
          <FaTrash /> Delete
        </button>

        <button
          className="capstone-submit-btn"
          onClick={handleSubmit}
        >
          <FaPaperPlane /> Submit
        </button>

        <button
          className="capstone-print-btn"
          onClick={handlePrint}
        >
          <FaPrint /> Print
        </button>

        <button
          className="capstone-next-btn"
          onClick={() => navigate("/internship")}
        >
          Next <FaArrowRight />
        </button>

      </div>
    </div>
  );
}

export default CapstoneProject;