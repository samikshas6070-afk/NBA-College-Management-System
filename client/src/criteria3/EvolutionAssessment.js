import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaCalendarAlt,
  FaUniversity,
  FaGraduationCap,
  FaDownload,
  FaSave,
  FaChevronUp,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaTrash,
  FaPaperPlane,
  FaPrint,
} from "react-icons/fa";

import "./EvolutionAssessment.css";

function EvolutionAssessment() {

  const navigate = useNavigate();

  // ===========================
  // States
  // ===========================

  const [files, setFiles] = useState({});

  const [academicYear, setAcademicYear] = useState("2024-25");

  const [department, setDepartment] = useState(
    "Computer Engineering"
  );

  const [program, setProgram] = useState(
    "B.E. Computer Engineering"
  );

  // ===========================
  // Table Data
  // ===========================

  const rows = [
    {
      id: 1,
      documentName: "CO's & PO's Filled Marks Detail Attachment",
      description: "CO's & PO's Filled Marks Detail Attachment",
    },
    {
      id: 2,
      documentName: "Question Paper Attachment",
      description: "Question Paper Attachment",
    },
    {
      id: 3,
      documentName: "CA-I",
      description: "Continuous Assessment - I",
    },
    {
      id: 4,
      documentName: "CA-II",
      description: "Continuous Assessment - II",
    },
    {
      id: 5,
      documentName: "MSE",
      description: "Mid Semester Examination",
    },
  ];

  // ===========================
  // Upload
  // ===========================

  const handleUpload = (e, item) => {

    const file = e.target.files[0];

    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [item.id]: file,
    }));

    alert(file.name + " Uploaded Successfully");

  };

  // ===========================
  // View
  // ===========================

  const handleView = (item) => {

    const file = files[item.id];

    if (!file) {

      alert("No File Uploaded");

      return;

    }

    const url = URL.createObjectURL(file);

    window.open(url, "_blank");

  };

  // ===========================
  // Download
  // ===========================

  const handleDownload = (item) => {

    const file = files[item.id];

    if (!file) {

      alert("No File Uploaded");

      return;

    }

    const url = URL.createObjectURL(file);

    const a = document.createElement("a");

    a.href = url;

    a.download = file.name;

    a.click();

    URL.revokeObjectURL(url);

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

      let recentFiles =
        JSON.parse(localStorage.getItem("recentUploadedFiles")) || [];

      for (const key of uploadedDocs) {

        const file = files[key];

        const row = rows.find(
          (r) => r.id === parseInt(key)
        );

        const formData = new FormData();

        formData.append("file", file);

        formData.append("criteriaNo", "3.1");

        formData.append(
          "documentName",
          row.documentName
        );

        const res = await axios.post(
  "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria3/upload",
  formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        recentFiles.push({
          criteriaNo: "3.1",
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

      alert("Save Failed");

    }

  };
    // ===========================
  // Delete
  // ===========================

  const handleDelete = async () => {

    try {

     await axios.delete(
  "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria/deleteAll/3.1"
);

      setFiles({});

      alert("Deleted Successfully");

    } catch (err) {

      console.log(err);

      alert("Delete Failed");

    }

  };


  // ===========================
  // Submit
  // ===========================

  const handleSubmit = async () => {

    try {

     await axios.post(
  "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/criteria3/submit",
        {
          criteriaNo: "3.1",
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


  // ===========================
  // JSX Start
  // ===========================

  return (

    <div className="assessment-container">

      {/* ===========================
            Top Filter Section
      ============================ */}

      <div className="top-bar">

        <div className="filter-box">

          <label>Academic Year</label>

          <div className="select-box">

            <FaCalendarAlt className="icon" />

            <select
              value={academicYear}
              onChange={(e) =>
                setAcademicYear(e.target.value)
              }
            >
              <option>2024-25</option>
              <option>2023-24</option>
              <option>2022-23</option>
            </select>

          </div>

        </div>

        <div className="filter-box">

          <label>Department</label>

          <div className="select-box">

            <FaUniversity className="icon" />

            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
            >
              <option>
                Computer Engineering
              </option>

              <option>
                Mechanical Engineering
              </option>

              <option>
                Civil Engineering
              </option>

              <option>
                Electrical Engineering
              </option>

            </select>

          </div>

        </div>

        <div className="filter-box">

          <label>Program</label>

          <div className="select-box">

            <FaGraduationCap className="icon" />

            <select
              value={program}
              onChange={(e) =>
                setProgram(e.target.value)
              }
            >
              <option>
                B.E. Computer Engineering
              </option>

              <option>
                M.E. Computer Engineering
              </option>

            </select>

          </div>

        </div>

        <div className="top-buttons">

          <button className="report-btn">

            <FaDownload />

            Download Report

          </button>

         
        </div>

      </div>

      {/* ===========================
            Card Header
      ============================ */}

      <div className="assessment-card">

        <div className="card-header">

          <div className="left-title">

            <div className="badge">

              3.1

            </div>

            <h3>

              Evolution of Continuous Assessment

            </h3>

          </div>

          <FaChevronUp className="collapse-icon" />

        </div>
                {/* ===========================
                Table
        ============================ */}

        <div className="table-wrapper">

          <table className="assessment-table">

            <thead>

              <tr>

                <th className="sr-column">
                  Sr. No.
                </th>

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
       accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
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

      </div>

      {/* ===========================
              Bottom Buttons
      ============================ */}

      <div className="bottom-buttons">

       

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
          onClick={() =>
            navigate("/criteria/3.2")
          }
        >
          Next
          <FaArrowRight />
        </button>

      </div>

    </div>

  );

}

export default EvolutionAssessment;