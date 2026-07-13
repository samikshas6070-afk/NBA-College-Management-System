import React, { useState } from "react";
import "./MembershipAdd.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function MembershipAdd() {

const [facultyName,setFacultyName]=useState("");

const [membership,setMembership]=useState("");

const [society,setSociety]=useState("");

const [membershipType,setMembershipType]=useState("");

const [fromDate,setFromDate]=useState("");

const [toDate,setToDate]=useState("");

const [selectedFile, setSelectedFile] = useState(null);
const navigate = useNavigate();
const handleReset = () => {

setFacultyName("");

setMembership("");

setSociety("");

setMembershipType("");

setFromDate("");

setToDate("");

setSelectedFile(null);

window.document.getElementById("membershipFile").value = "";

};
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
  !membership ||
  !society ||
  !membershipType ||
  !fromDate ||
  !toDate
) {
  alert("Please fill all required fields.");
  return;
}
    const formData = new FormData();

    formData.append("faculty_name", facultyName);
    formData.append("membership_name", membership);
    formData.append("professional_society", society);
    formData.append("membership_type", membershipType);
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);

    if (selectedFile) {
      formData.append("document", selectedFile);
    }

    const res = await axios.post(
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/api/memberships",
      formData
    );

    alert(res.data.message);

    handleReset();

    navigate("/criteria6/membership/view");

  } catch (error) {

    console.log(error);

    alert("Save Failed");

  }

};
return(

<div className="membership-container">

<h2>

6.1.1 Memberships in Professional Societies

</h2>

<div className="membership-card">

<div className="form-group">

<label>

Faculty Name

</label>

<input
type="text"
value={facultyName}
onChange={(e)=>setFacultyName(e.target.value)}
/>

</div>

<div className="form-group">

<label>

Membership Name

</label>

<input
type="text"
value={membership}
onChange={(e)=>setMembership(e.target.value)}
/>

</div>

<div className="form-group">

<label>

Professional Society

</label>

<input
type="text"
value={society}
onChange={(e)=>setSociety(e.target.value)}
/>

</div>

<div className="form-group">

<label>

Membership Type

</label>

<select
value={membershipType}
onChange={(e)=>setMembershipType(e.target.value)}
>

<option value="">Select</option>

<option>National</option>

<option>International</option>

</select>

</div>

<div className="form-group">

<label>

From Date

</label>

<input
type="date"
value={fromDate}
onChange={(e)=>setFromDate(e.target.value)}
/>

</div>

<div className="form-group">

<label>

To Date

</label>

<input
type="date"
value={toDate}
onChange={(e)=>setToDate(e.target.value)}
/>

</div>
<div className="form-group">

  <label>Supporting Document (PDF)</label>

  <div className="file-upload-row">

    <label className="choose-file-btn">

      Choose File

      <input
  id="membershipFile"
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

    {selectedFile && (

  <div className="pdf-name">

    {selectedFile.name}

  </div>

)}
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

export default MembershipAdd;