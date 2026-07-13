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

import "./SeminarMiniProject.css";

function SeminarMiniProject() {
  const navigate = useNavigate();

  const [files, setFiles] = useState({});

  const rows = [
    {
      id: 1,
      documentName: "Process Describe",
      description: "Seminar and Mini Project process document",
    },
    {
      id: 2,
      documentName: "PO, POS",
      description:
        "Program Outcomes and Program Specific Outcomes Mapping",
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(fileURL);
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

//Delete
// Delete
const handleDelete = async () => {

  try {

    await axios.delete(
      "http://localhost:5000/criteria/deleteAll/2.4"
    );

    setFiles({});

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
        criteriaNo: "2.4"
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
    alert("Please upload a file first");
    return;
  }

  uploadedFiles.forEach((file) => {
    const fileURL = URL.createObjectURL(file);

    const printWindow = window.open(fileURL, "_blank");

    if (!printWindow) {
      alert("Popup blocked! Please allow popups.");
      return;
    }

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  });
};



  return (
    <div className="seminar-container">

      {/* Header */}

      <div className="seminar-header">
        <div className="seminar-title-section">
          <span className="seminar-badge">2.4</span>

          <div>
            <h2>Seminar, Mini Project</h2>
            <p>
              Upload and manage Seminar & Mini Project documents.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="seminar-card">
  <table className="seminar-table">

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
                accept=".pdf"
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
  onClick={() => navigate("/internship")}
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
          onClick={() => navigate("/case-study")}
        >
          Next <FaArrowRight />
        </button>

      </div>
    </div>
  );
}

export default SeminarMiniProject;