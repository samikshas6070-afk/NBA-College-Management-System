import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

import "./LaboratoryWorkshop.css";

function LaboratoryWorkshop() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});

  const documents = [
  {
    id: 1,
    documentName: "Rubrics Attachment",
    description: "Rubrics used for laboratory work and workshop evaluation.",
  },
  {
    id: 2,
    documentName: "Evidences",
    description: "Photos, reports and other evidences of laboratory work and workshops.",
  },
];
const handleView = async (row) => {
  try {

    const res = await axios.get(
      "http://localhost:5000/criteria3/files/3.3"
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
      "http://localhost:5000/criteria3/files/3.3"
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
      formData.append("criteriaNo", "3.3");
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
      "http://localhost:5000/criteria3/deleteAll/3.3"
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
        criteriaNo: "3.3",
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
  <div className="lab-wrapper">

    {/* Header Card */}
    <div className="lab-header-card">

      <div className="lab-title">

        <div className="lab-number">
          3.3
        </div>

        <div className="lab-title-text">
          <h2>Laboratory Work & Workshop</h2>
          <p>
            Upload and manage laboratory work and workshop related documents.
          </p>
        </div>

      </div>

    </div>

    {/* Table Card */}
    <div className="lab-card">

      <div className="lab-table-wrapper">

        <table className="lab-table">

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

                <td className="lab-sr">
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
                  <div className="lab-actions">


<button onClick={() => handleView(item)}>
  <FaEye /> View
</button>

<button onClick={() => handleDownload(item)}>
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

    <div className="lab-bottom-buttons">

     <button
  className="previous-btn"
  onClick={() => navigate("/criteria/3.2")}
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
  onClick={() => navigate("/criteria/3.4")}
>
  Next
  <FaArrowRight />
</button>
    </div>

  </div>
);
}
export default LaboratoryWorkshop;