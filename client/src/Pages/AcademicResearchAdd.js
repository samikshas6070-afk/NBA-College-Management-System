import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AcademicResearchAdd.css";

function AcademicResearchAdd() {

  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [journalPapers, setJournalPapers] = useState("");
  const [conferencePapers, setConferencePapers] = useState("");
  const [booksPublished, setBooksPublished] = useState("");
  const [academicYear, setAcademicYear] = useState("");
 const [selectedFile, setSelectedFile] = useState(null);
const handleView = () => {

  if (!selectedFile) {
    alert("Please choose a file first.");
    return;
  }

  const url = URL.createObjectURL(selectedFile);
  window.open(url, "_blank");

};

const handleDownload = () => {

  if (!selectedFile) {
    alert("Please choose a file first.");
    return;
  }

  const url = URL.createObjectURL(selectedFile);

  const link = window.document.createElement("a");
  link.href = url;
  link.download = selectedFile.name;
  link.click();

  URL.revokeObjectURL(url);

};

const handlePrint = () => {

  if (!selectedFile) {
    alert("Please choose a file first.");
    return;
  }

  const url = URL.createObjectURL(selectedFile);

  const printWindow = window.open(url);

  if (printWindow) {
    printWindow.onload = () => printWindow.print();
  }

};

const handleSave = () => {
  alert("Consultancy Record Saved Successfully");
};
  return (

    <div className="resource-container">

      <h2>6.2.1 Academic Research</h2>

      <div className="resource-card">

        <div className="form-group">
          <label>Faculty Name</label>
          <input
            type="text"
            value={facultyName}
            onChange={(e)=>setFacultyName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>No. of Journal Papers</label>
          <input
            type="number"
            value={journalPapers}
            onChange={(e)=>setJournalPapers(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>No. of Conference Papers</label>
          <input
            type="number"
            value={conferencePapers}
            onChange={(e)=>setConferencePapers(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>No. of Books / Book Chapters</label>
          <input
            type="number"
            value={booksPublished}
            onChange={(e)=>setBooksPublished(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Academic Year</label>
          <input
            type="text"
            placeholder="2025-26"
            value={academicYear}
            onChange={(e)=>setAcademicYear(e.target.value)}
          />
        </div>

        <div className="form-group">

          <label>Supporting Document</label>

          <label className="choose-file-btn">

            Choose File

             <input
  id="consultancyFile"
  type="file"
  hidden
  accept=".pdf,.doc,.docx"
  onChange={(e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }}
/>

          </label>
{selectedFile && <p>{selectedFile.name}</p>}

          <div className="document-actions">

            
           <button
type="button"
className="view-btn"
onClick={handleView}
>
👁 View
</button>

<button
type="button"
className="download-btn-upload"
onClick={handleDownload}
>
Download
</button>

<button
type="button"
className="print-btn-upload"
onClick={handlePrint}
>
Print
</button>

<button
type="button"
className="save-btn"
onClick={handleSave}
>
Save
</button>

          </div>

        </div>

        <div className="bottom-buttons">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/criteria6/research")
            }
          >
            ← Back
          </button>

          
        </div>

      </div>

    </div>

  );

}

export default AcademicResearchAdd;