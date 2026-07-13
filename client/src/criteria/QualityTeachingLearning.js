import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaDownload,
  FaSave,
  FaTrash,
  FaPaperPlane,
  FaArrowRight,
  FaArrowLeft,
  FaPrint,
} from "react-icons/fa";

import "./QualityTeachingLearning.css";

function QualityTeachingLearning() {
  const navigate = useNavigate();

  const [files, setFiles] = useState({});
  

  const documents = [
    {
      id: 1,
      name: "Academic Calendar",
      description: "Academic year planning and schedule",
    },
    {
      id: 2,
      name: "Lab Time Table",
      description: "Laboratory practical schedule",
    },
    {
      id: 3,
      name: "Class Time Table",
      description: "Regular classroom timetable",
    },
  ];

  

  // Add this here 👇
  useEffect(() => {

    axios
      .get("http://localhost:5000/criteria/2.1")
      .then((res) => {

        

  
      })
      .catch((err) => console.log(err));

  }, []);

  

  // Upload
  const handleFileChange = (e, doc) => {
    const file = e.target.files[0];

    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [doc.id]: file,
    }));

    alert(`${file.name} uploaded successfully`);
  };

  // View
 const handleView = (doc) => {
  const file = files[doc.id];

  if (!file) {
    alert("Please upload file first");
    return;
  }

  const fileURL = URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = fileURL;
  a.target = "_blank";   // open in new tab
  a.rel = "noopener noreferrer";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

  // Download
 const handleDownload = (doc) => {

  const file = files[doc.id];

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

      const row = documents.find(
  (r) => r.id === parseInt(key)
);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("criteriaNo", "2.1");
      formData.append("documentName", row.name);
formData.append("description", row.description);

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
        criteriaNo: "2.1",
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

  if (!window.confirm("Delete uploaded files?")) return;

  try {

    const uploadedDocs = Object.keys(files);

    if (uploadedDocs.length === 0) {
      alert("No files to delete");
      return;
    }

    setFiles({});

    document.querySelectorAll(".file-input").forEach((input) => {
      input.value = "";
    });

    

    alert("Files Deleted Successfully");

  } catch (error) {

    console.log(error);
    alert("Error while deleting files");
  }
};

  // Submit
const handleSubmit = async () => {

  try {

    const response = await axios.post(
      "http://localhost:5000/criteria/submit",
      {
        criteriaNo: "2.1"
      }
    );

    console.log(response.data);

    alert("Submitted Successfully");

  } catch (error) {

    console.log(error.response);
    console.log(error.message);

    alert("Submission Failed");
  }
};
  // Print
  const handlePrint = async () => {

  const uploadedFiles = Object.values(files);

  if (uploadedFiles.length === 0) {
    alert("Please upload file first");
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
      alert("Please allow popups");
      return;
    }

    printWindow.onload = () => {
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
      }, 1000);
    };

  });

};
  // Next
  const handleNext = () => {
    navigate("/criteria/2.2-capstone-project");
  };

  return (
    <div className="industry-container">

      {/* Header */}
      <div className="industry-header">

        <div className="industry-title-section">

          <span className="industry-badge">2.1</span>

          <div>
            <h2>Quality of Teaching & Learning</h2>
            <p>
              Upload and manage teaching-learning related documents.
            </p>
          
          </div>

        </div>

      </div>

      {/* Table */}
      <div className="industry-card">
  <table className="industry-table">

    <thead>
      <tr>
        <th>Sr. No.</th>
        <th>Document Name</th>
        <th>Description</th>
        <th>Attachment</th>
        
      </tr>
    </thead>

    <tbody>
  {documents.map((doc) => (
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
        <div className="attachment-box">

          <input
            type="file"
            className="file-input"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.mp4,.mp3,.wav,.zip"
            onChange={(e) => handleFileChange(e, doc)}
          />

          <div className="attachment-buttons">

            <button
              className="view-btn"
              onClick={() => handleView(doc)}
            >
              <FaEye /> View
            </button>

            <button
              className="download-btn"
              onClick={() => handleDownload(doc)}
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
    onClick={() => navigate(-1)}
  >
    <FaArrowLeft /> Previous
  </button>

  <button
    className="back-btn"
    onClick={() => navigate("/dashboard")}
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
    onClick={handleNext}
  >
    Next <FaArrowRight />
  </button>

</div>

      </div>

  );
}

export default QualityTeachingLearning;