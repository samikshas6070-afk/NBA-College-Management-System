import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SponsoredResearchAdd.css";

function SponsoredResearchAdd() {

  const navigate = useNavigate();

  const [projectTitle, setProjectTitle] = useState("");
  const [piName, setPiName] = useState("");
  const [coPiName, setCoPiName] = useState("");
  const [department, setDepartment] = useState("");
  const [fundingAgency, setFundingAgency] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [sanctionYear, setSanctionYear] = useState("");
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

  alert("Sponsored Research Record Saved Successfully");

};
  return (

    <div className="resource-container">

      <h2>6.2.3 Sponsored Research Project</h2>

      <div className="resource-card">

        <div className="form-group">
          <label>Project Title</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e)=>setProjectTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Principal Investigator (PI)</label>
          <input
            type="text"
            value={piName}
            onChange={(e)=>setPiName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Co-PI Name</label>
          <input
            type="text"
            value={coPiName}
            onChange={(e)=>setCoPiName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            value={department}
            onChange={(e)=>setDepartment(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Funding Agency</label>
          <input
            type="text"
            value={fundingAgency}
            onChange={(e)=>setFundingAgency(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Sanction Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            placeholder="2 Years"
            value={duration}
            onChange={(e)=>setDuration(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Sanction Year</label>
          <input
            type="text"
            value={sanctionYear}
            onChange={(e)=>setSanctionYear(e.target.value)}
          />
        </div>

        <div className="form-group">

          <label>Supporting Document</label>

          <label className="choose-file-btn">

            Choose File

           <input
  id="sponsoredResearchFile"
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

        </div>

        <div className="bottom-buttons">

          <button
            className="back-btn"
            onClick={() => navigate("/criteria6/research")}
          >
            ← Back
          </button>

         

        </div>

      </div>

    </div>

  );

}

export default SponsoredResearchAdd;