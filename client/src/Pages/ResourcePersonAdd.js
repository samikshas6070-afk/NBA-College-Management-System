import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResourcePersonAdd.css";
import axios from "axios";
function ResourcePersonAdd() {

  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [eventName, setEventName] = useState("");
  const [organization, setOrganization] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [role, setRole] = useState("");
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
    alert("Please choose a PDF first.");
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
const handleSave = async () => {

  try {

    if (
      !facultyName ||
      !eventName ||
      !organization ||
      !venue ||
      !date ||
      !role
    ) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();

    formData.append("faculty_name", facultyName);
    formData.append("event_name", eventName);
    formData.append("organization_name", organization);
    formData.append("topic", venue);
    formData.append("event_date", date);
    formData.append("academic_year", role);

    if (selectedFile) {
      formData.append("document", selectedFile);
    }

    const res = await axios.post(
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/api/resource-persons",
      formData
    );

    alert(res.data.message);

    navigate("/criteria6/resource-person/view");

  } catch (error) {

    console.log(error);

    alert(error.response?.data?.message || "Save Failed");

  }

};
  return (

    <div className="resource-container">

      <h2>6.1.2.1 Faculty as Resource Person</h2>

      <div className="resource-card">

        <div className="form-group">
          <label>Faculty Name</label>
          <input
            type="text"
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Event / FDP / STTP Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Organization</label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Venue</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Supporting Document</label>

          <label className="choose-file-btn">
            Choose File

           <input
  id="resourceFile"
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
              navigate("/criteria6/faculty-development")
            }
          >
            ← Back
          </button>


        </div>

      </div>

    </div>

  );

}

export default ResourcePersonAdd;