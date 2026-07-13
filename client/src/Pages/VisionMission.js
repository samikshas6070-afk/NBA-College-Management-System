import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VisionMission.css";
import { MdDelete } from "react-icons/md";
import { FaDownload, FaPrint } from "react-icons/fa";
function VisionMission({ onNext }) {
  const navigate = useNavigate();
const [vision, setVision] = useState(
"To be a premier institute recognized for excellence in technical education, research and innovation for the betterment of society."
);
const [mission, setMission] = useState(
`• To provide quality education.
• To encourage research and innovation.
• To develop industry oriented skills.
• To contribute to society.`
);
const [peo1, setPeo1] = useState(
"Graduates will apply technical knowledge and skills in their profession."
);
const [peo2, setPeo2] = useState(
"Graduates will pursue higher studies and lifelong learning."
);
const [peo3, setPeo3] = useState(
"Graduates will demonstrate professional ethics, leadership and teamwork."
);
const handleDraft = () => {
    
alert("Draft Saved Successfully");
};
const [visionFile, setVisionFile] = useState(null);
const [missionFile, setMissionFile] = useState(null);
const [peoFile1, setPeoFile1] = useState(null);
const [peoFile2, setPeoFile2] = useState(null);
const [peoFile3, setPeoFile3] = useState(null);
const handleSave = async () => {

  try {
const formData = new FormData();

formData.append("vision", vision);
formData.append("mission", mission);
formData.append("peo1", peo1);
formData.append("peo2", peo2);
formData.append("peo3", peo3);
if (visionFile) formData.append("visionFile", visionFile);
if (missionFile) formData.append("missionFile", missionFile);
if (peoFile1) formData.append("peoFile1", peoFile1);
if (peoFile2) formData.append("peoFile2", peoFile2);
if (peoFile3) formData.append("peoFile3", peoFile3);
const response = await fetch(
  "http://localhost:5000/save-vision",
  {
    method: "POST",
    body: formData
  }
);

const data = await response.json();

alert(data.message);

  } catch (error) {
    console.log(error);
    alert("Save Error");
  }

};
const handleFileDownload = (file) => {

  if (!file) {
    alert("Please upload file first.");
    return;
  }

  const handleNext = () => {
  navigate("/curriculum");
};

  window.open(
    `http://localhost:5000/download/${file.name}`,
    "_blank"
  );

};
const handleView = (file) => {

  if (!file) {
    alert("Please upload file first.");
    return;
  }

  const fileName = file.name;
  const extension = fileName.split(".").pop().toLowerCase();

  if (extension === "pdf") {

    window.open(
      `http://localhost:5000/uploads/${fileName}`,
      "_blank"
    );

  } else {

    window.open(
      `http://localhost:5000/download/${fileName}`,
      "_blank"
    );

  }

};
const handlePrint = (file) => {

  if (!file) {
    alert("Please upload file first.");
    return;
  }

  const extension = file.name.split(".").pop().toLowerCase();

  if (extension === "pdf") {

    const win = window.open(
      `http://localhost:5000/uploads/${file.name}`,
      "_blank"
    );

    if (win) {
      win.onload = () => {
        win.focus();
        win.print();
      };
    }

  } else {

    window.open(
      `http://localhost:5000/download/${file.name}`,
      "_blank"
    );

    alert(
      "Open the downloaded file in Microsoft Word/Excel and press Ctrl + P."
    );

  }

};
const handleReset = () => {
  window.location.reload();
};

const handleSubmit = () => {
  alert("Submitted Successfully");
};
  return (
    <div className="vision-container">

      <h2>Vission And Mission</h2>

      <h3>1.1 Vision, Mission </h3>


      {/* Vision */}
      <h3 className="section-heading">1. Institute Vision</h3>

      <table className="nba-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Particulars</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Institute Vision</td>
            <td>
              <textarea
  value={vision}
  onChange={(e) => setVision(e.target.value)}
/>
            </td>

           <td>

<div className="file-upload-row">

<label className="choose-file-btn">

Choose File
<input
  id="visionFile"
  type="file"
  hidden
  accept=".pdf"
  onChange={(e) => {
    if (e.target.files.length > 0) {
      setVisionFile(e.target.files[0]);
      
    }
  }}
/>

</label>
{visionFile && (
  <span
    style={{
      color: "#16a34a",
      fontWeight: "600",
      fontSize: "13px"
    }}
  >
    {visionFile && (
  <div className="pdf-name">
    {visionFile.name}
  </div>
)}
  </span>
)}
<div className="document-actions">

  <button
    type="button"
    className="view-btn"
    onClick={() => handleView(visionFile)}
  >
    👁 View
  </button>

  <button
    type="button"
    className="download-btn-upload"
    onClick={() => handleFileDownload(visionFile)}
  >
    <FaDownload />
    Download
  </button>

  <button
    type="button"
    className="print-btn-upload"
    onClick={() => handlePrint(visionFile)}
  >
    <FaPrint />
    Print
  </button>

</div>

</div>

</td>
          </tr>
        </tbody>
      </table>

      {/* Mission */}
      <h3 className="section-heading">2. Institute Mission</h3>

      <table className="nba-table">
        <tbody>
          <tr>
            <td>1</td>
            <td>Institute Mission</td>

            <td>
             <textarea
  value={mission}
  onChange={(e) => setMission(e.target.value)}
/>
            </td>

            <td>

<div className="file-upload-row">

<label className="choose-file-btn">

Choose File
<input
  id="missionFile"
  type="file"
  hidden
  accept=".pdf"
  onChange={(e) => {
    if (e.target.files.length > 0) {
      setMissionFile(e.target.files[0]);
    }
  }}
/>
</label>
{missionFile && (
  <span
    style={{
      color:"#16a34a",
      fontWeight:"600",
      fontSize:"13px"
    }}
  >
    {missionFile && (
  <div className="pdf-name">
    {missionFile.name}
  </div>
)}
  </span>
)}
<div className="document-actions">

  <button
    type="button"
    className="view-btn"
    onClick={() => handleView(missionFile)}
  >
    👁 View
  </button>

  <button
    type="button"
    className="download-btn-upload"
    onClick={() => handleFileDownload(missionFile)}
  >
    <FaDownload />
    Download
  </button>

  <button
    type="button"
    className="print-btn-upload"
    onClick={() => handlePrint(missionFile)}
  >
    <FaPrint />
    Print
  </button>

</div>

</div>

</td>
          </tr>
        </tbody>
      </table>

      {/* PEO */}
      <h3 className="section-heading">
        3. Program Educational Objectives (PEO's)
      </h3>

      <table className="nba-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>PEO No.</th>
            <th>Program Educational Objectives</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>PEO 1</td>
            <td>
             <input
  type="text"
  value={peo1}
onChange={(e) => setPeo1(e.target.value)}
/>
            </td>
          <td>

<div className="file-upload-row">

<label className="choose-file-btn">

Choose File
<input
  id="peoFile1"
  type="file"
  hidden
  accept=".pdf"
  onChange={(e) => {
    if (e.target.files.length > 0) {
      setPeoFile1(e.target.files[0]);
    }
  }}
/>
</label>
{peoFile1 && (
  <span
    style={{
      color:"#16a34a",
      fontWeight:"600",
      fontSize:"13px"
    }}
  >
   {peoFile1 && (
  <div className="pdf-name">
    {peoFile1.name}
  </div>
)}
  </span>
)}
<div className="document-actions">

  <button
    type="button"
    className="view-btn"
    onClick={() => handleView(peoFile1)}
  >
    👁 View
  </button>

  <button
    type="button"
    className="download-btn-upload"
    onClick={() => handleFileDownload(peoFile1)}
  >
    <FaDownload />
    Download
  </button>

  <button
    type="button"
    className="print-btn-upload"
    onClick={() => handlePrint(peoFile1)}
  >
    <FaPrint />
    Print
  </button>

</div>

</div>

</td>
          </tr>

          <tr>
  <td>2</td>

  <td>PEO 2</td>

  <td>
    <input
      type="text"
      value={peo2}
onChange={(e) => setPeo2(e.target.value)}
    />
  </td>
<td>

<div className="file-upload-row">

<label className="choose-file-btn">

Choose File
<input
  id="peoFile2"
  type="file"
  hidden
  accept=".pdf"
  onChange={(e) => {
    if (e.target.files.length > 0) {
     setPeoFile2(e.target.files[0]);
    }
  }}
/>
</label>
{peoFile2 && (
  <span
    style={{
      color:"#16a34a",
      fontWeight:"600",
      fontSize:"13px"
    }}
  >
    {peoFile2 && (
  <div className="pdf-name">
    {peoFile2.name}
  </div>
)}
  </span>
)}
<div className="document-actions">

  <button
    type="button"
    className="view-btn"
    onClick={() => handleView(peoFile2)}
  >
    👁 View
  </button>

  <button
    type="button"
    className="download-btn-upload"
    onClick={() => handleFileDownload(peoFile2)}
  >
    <FaDownload />
    Download
  </button>

  <button
    type="button"
    className="print-btn-upload"
    onClick={() => handlePrint(peoFile2)}
  >
    <FaPrint />
    Print
  </button>

</div>

</div>

</td>
</tr>

          <tr>
            <td>3</td>
            <td>PEO 3</td>
           
             <td>
  <input
    type="text"
    value={peo3}
onChange={(e) => setPeo3(e.target.value)}
  />
</td>
<td>

<div className="file-upload-row">

<label className="choose-file-btn">

Choose File
<input
  id="peoFile3"
  type="file"
  hidden
  accept=".pdf"
  onChange={(e) => {
    if (e.target.files.length > 0) {
      setPeoFile3(e.target.files[0]);
    }
  }}
/>
</label>
{peoFile3 && (
  <span
    style={{
      color:"#16a34a",
      fontWeight:"600",
      fontSize:"13px"
    }}
  >
    {peoFile3 && (
  <div className="pdf-name">
    {peoFile3.name}
  </div>
)}
  </span>
)}
<div className="document-actions">

  <button
    type="button"
    className="view-btn"
    onClick={() => handleView(peoFile3)}
  >
    👁 View
  </button>

  <button
    type="button"
    className="download-btn-upload"
    onClick={() => handleFileDownload(peoFile3)}
  >
    <FaDownload />
    Download
  </button>

  <button
    type="button"
    className="print-btn-upload"
    onClick={() => handlePrint(peoFile3)}
  >
    <FaPrint />
    Print
  </button>

</div>

</div>

</td>
          </tr>
        </tbody>
      </table>

      
<div className="btn-row">

 
<button
  className="save-btn"
  onClick={handleSave}
>
  Save
</button>

  <button
    className="reset-btn"
    onClick={handleReset}
  >
    Reset
  </button>

  <button
    className="submit-btn"
    onClick={handleSubmit}
  >
    Submit
  </button>
  <div className="bottom-buttons">


</div>
  <button
  className="next-page-btn"
  onClick={() => navigate("/curriculum")}
>
  Next →
</button>

</div>
    </div>
  );
}

export default VisionMission;