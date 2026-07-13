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

import "./IndustrialTrainingInternship.css";

function IndustrialTrainingInternship() {

  const navigate = useNavigate();
  const [files, setFiles] = useState({});

  const documents = [
    {
      id: 1,
      documentName: "Rubrics",
      description:
        "Rubrics used for industrial training and internship evaluation.",
    },
    {
      id: 2,
      documentName: "Evidences",
      description:
        "Internship reports, completion certificates, photographs and other supporting evidences.",
    },
  ];

  const handleView = async (row) => {
    try {
  
      const res = await axios.get(
        "http://localhost:5000/criteria3/files/3.4"
      );
  
      const file = res.data.files.find(
        (f) => f.document_name === row.documentName
      );
  
      if (!file) {
        alert("No File Found");
        return;
      }
  
      window.open(
        `http://localhost:5000/${file.file_path.replace(/\\/g, "/")}`,
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
        "http://localhost:5000/criteria3/files/3.4"
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
        `http://localhost:5000/${file.file_path.replace(/\\/g, "/")}`;
  
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
        formData.append("criteriaNo", "3.4");
        formData.append("documentName", row.documentName);
  
        await axios.post(
          "http://localhost:5000/criteria3/upload",
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
        "http://localhost:5000/criteria3/deleteAll/3.4"
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
        "http://localhost:5000/criteria3/submit",
        {
          criteriaNo: "3.4",
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
    <div className="intern-wrapper">

      {/* Header */}

      <div className="intern-header-card">

        <div className="intern-title">

          <div className="intern-number">
            3.4
          </div>

          <div className="intern-title-text">

            <h2>
              Industrial Training / Internship
            </h2>

            <p>
              Upload and manage industrial training and internship related
              documents.
            </p>

          </div>

        </div>

      </div>

      {/* White Card */}

      <div className="intern-card">

        <div className="intern-table-wrapper">

          <table className="intern-table">

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

                  <td className="intern-sr">
                    {item.id}
                  </td>

                  <td>
                    {item.documentName}
                  </td>

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

                    <div className="intern-actions">
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

      {/* Bottom Buttons */}

      <div className="intern-bottom-buttons">

      <button
  className="previous-btn"
  onClick={() => navigate("/criteria/3.3")}
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

       <button
  className="next-btn"
  onClick={() => navigate("/criteria/3.5")}
>
  Next <FaArrowRight />
</button>
              </div>

    </div>

  );
}

export default IndustrialTrainingInternship;