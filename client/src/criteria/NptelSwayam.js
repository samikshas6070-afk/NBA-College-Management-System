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

import "./NptelSwayam.css";

function NptelSwayam() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});

  const rows = [
    {
      id: 1,
      documentName: "Student Detail",
      description:
        "Details of students enrolled and completed NPTEL/SWAYAM courses.",
    },
    {
      id: 2,
      documentName: "Certificate",
      description:
        "Certificates obtained by students through NPTEL/SWAYAM courses.",
    },
    {
      id: 3,
      documentName: "PO & PO's",
      description:
        "Program Outcome and Program Specific Outcome mapping.",
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

  // View
  const handleView = (item) => {
    const file = files[item.id];

    if (!file) {
      alert("Please upload file first");
      return;
    }

    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  // Download
  const handleDownload = (item) => {
    const file = files[item.id];

    if (!file) {
      alert("Please upload file first");
      return;
    }

    const fileURL = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = file.name;
    link.click();
  };

  // Save
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
      formData.append("criteriaNo", "2.8");
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
        criteriaNo: "2.8",
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

  // Delete
 const handleDelete = async () => {

  try {

    await axios.delete(
      "http://localhost:5000/criteria/deleteAll/2.6"
    );

    setFiles({});

    document.querySelectorAll(".file-input")
      .forEach((input) => {
        input.value = "";
      });

    alert("Deleted Successfully");

  } catch (err) {

    console.log(err);
    alert("Delete Failed");
  }
};

  // Submit
 const handleSubmit = async () => {

  try {

    await axios.post(
      "http://localhost:5000/criteria/submit",
      {
        criteriaNo: "2.6"
      }
    );

    alert("Submitted Successfully");

  } catch (err) {

    console.log(err);
    alert("Submission Failed");
  }
};

  // Print
  const handlePrint = () => {
    const uploadedFiles = Object.values(files);

    if (uploadedFiles.length === 0) {
      alert("Please upload file first");
      return;
    }

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
    <div className="nptel-container">

      {/* Header */}
      <div className="nptel-header">
        <div className="nptel-title-section">

          <span className="nptel-badge">2.6</span>

          <div>
            <h2>NPTEL & SWAYAM</h2>
            <p>Upload and manage NPTEL & SWAYAM documents.</p>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="nptel-card">

        <table className="nptel-table">

          <thead>
            <tr>
             <th>Sr.No.</th>
    <th>Document Name</th>
    <th>Description</th>
    <th>Action</th>
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
    className="file-input"
    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.mp4,.mp3,.wav,.zip"
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

      {/* Bottom Buttons */}
      <div className="bottom-buttons">

<button
  className="previous-btn"
  onClick={() => navigate("/case-study")}
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
          onClick={() => navigate("/complex-problems")}
        >
          Next <FaArrowRight />
        </button>

      </div>

    </div>
  );
}

export default NptelSwayam;