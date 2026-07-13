import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FdpAdd.css";

function FdpAdd() {

  const navigate = useNavigate();

  const [programName, setProgramName] = useState("");
  const [coordinator, setCoordinator] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [participants, setParticipants] = useState("");
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
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

const handleSave = () => {
  alert("FDP/STTP record saved successfully.");
};
  return (

    <div className="resource-container">

      <h2>6.1.4 FDP / STTP Organized by Department</h2>

      <div className="resource-card">

        <div className="form-group">
          <label>Program Name</label>
          <input
            type="text"
            value={programName}
            onChange={(e)=>setProgramName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Coordinator Name</label>
          <input
            type="text"
            value={coordinator}
            onChange={(e)=>setCoordinator(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e)=>setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e)=>setEndDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>No. of Participants</label>
          <input
            type="number"
            value={participants}
            onChange={(e)=>setParticipants(e.target.value)}
          />
        </div>

        <div className="form-group">

          <label>Supporting Document</label>

          <label className="choose-file-btn">

            Choose File

            <input
  id="fdpFile"
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
              navigate("/criteria6/faculty-activities")
            }
          >
            ← Back
          </button>


        </div>

      </div>

    </div>

  );

}

export default FdpAdd;