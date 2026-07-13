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

import "./IndustryInstitutePartnership.css";

function IndustryInstitutePartnership() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});

  const rows = [
    {
      id: 1,
      documentName: "MoU's Attachment",
      description:
        "Copies of Memorandum of Understanding (MoU) signed with industries.",
    },
    {
      id: 2,
      documentName: "Lab Supported (Sponsored Lab)",
      description:
        "Documents related to industry-sponsored laboratories and facilities.",
    },
    {
      id: 3,
      documentName: "Supported Company Lab Event",
      description:
        "Reports and evidences of events conducted with industry-supported laboratories.",
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
      "http://localhost:5000/criteria/deleteAll/2.8"
    );

    setFiles({});

    document.querySelectorAll(".file-input")
      .forEach((input) => {
        input.value = "";
      });

    alert("Files Deleted Successfully");

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
        criteriaNo: "2.8"
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

  const recentFiles =
    JSON.parse(localStorage.getItem("recentUploadedFiles")) || [];

  if (recentFiles.length === 0) {
    alert("No recently uploaded files found");
    return;
  }

  recentFiles.forEach((file) => {

    const fileUrl =
      `http://localhost:5000/uploads/${file.file_name}`;

    const win = window.open(fileUrl, "_blank");

    if (win) {
      win.onload = () => {
        win.focus();
        win.print();
      };
    }

  });

};

  return (
    <div className="industry-container">

      {/* Header */}
      <div className="industry-header">
        <div className="industry-title-section">

          <span className="industry-badge">2.8</span>

          <div>
            <h2>
              Steps Taken for Enhancing Industry Institute Partnership
            </h2>
            <p>
              Upload and manage industry institute partnership documents.
            </p>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="industry-card">

        <table className="industry-table">

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
      type="button"
      className="view-btn"
      onClick={() => handleView(item)}
    >
      <FaEye /> View
    </button>

    <button
      type="button"
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
  onClick={() => navigate("/complex-problems")}
>
  <FaArrowLeft /> Previous
</button>

{/* Back Button - Goes to Criteria 2.1 */}

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
          onClick={() => navigate("/")}
        >
          Next <FaArrowRight />
        </button>

      </div>

    </div>
  );
}

export default IndustryInstitutePartnership;