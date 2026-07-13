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

import "./Internship.css";

function Internship() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});

  const rows = [
    {
      id: 1,
      documentName: "PO - PO's",
      description: "Program Outcomes Mapping Document",
    },
    {
      id: 2,
      documentName: "Internship Detail",
      description: "Internship Reports and Supporting Documents",
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
      alert("No file uploaded");
      return;
    }

    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  // Download
  const handleDownload = (item) => {
    const file = files[item.id];

    if (!file) {
      alert("No file uploaded");
      return;
    }

    const url = URL.createObjectURL(file);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();

    URL.revokeObjectURL(url);
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
      formData.append("criteriaNo", "2.3");
      formData.append("documentName", row.documentName);

      const res = await axios.post(
        "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Save uploaded file name for Print
      recentFiles.push({
        criteriaNo: "2.3",
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
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria/deleteAll/2.3"
    );

    setFiles({});

    alert("Deleted Successfully");

  } catch (err) {

    console.log(err);
    alert("Error while deleting");
  }
};

  // Submit
 const handleSubmit = async () => {

  try {

    await axios.post(
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria/submit",
      {
        criteriaNo: "2.3"
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
      alert("No file uploaded");
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
    <div className="internship-container">

      {/* Header */}

      <div className="internship-header">
        <div className="internship-title-section">
          <span className="internship-badge">2.3</span>

          <div>
            <h2>Internship</h2>
            <p>
              Upload and manage Internship related documents.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}

     <div className="internship-card">
  <table className="internship-table">
    <thead>
      <tr>
        <th>Sr. No.</th>
        <th>Particulars</th>
        <th>Description</th>
        <th>Attachment </th>
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

          <td>
            <div className="attachment-box">

              <input
    type="file"
    className="file-input"
    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.mp4,.mp3,.wav,.zip"
    onChange={(e) => handleUpload(e, item)}
  />
              <div className="attachment-buttons">

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
  onClick={() =>
    navigate("/criteria/2.2-capstone-project")
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
          onClick={() =>
            navigate("/seminar-mini-project")
          }
        >
          Next <FaArrowRight />
        </button>

      </div>
    </div>
  );
}

export default Internship;