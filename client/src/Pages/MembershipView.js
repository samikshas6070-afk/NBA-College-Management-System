
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MembershipView.css";
function MembershipView() {
const navigate = useNavigate();
const [records, setRecords] = useState([]);
useEffect(() => {
  loadMemberships();
}, []);
const loadMemberships = async () => {
  try {
    const res = await axios.get(
      "http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/api/memberships"
    );

    setRecords(res.data);

  } catch (error) {
    console.log(error);
  }
};
const handleDelete = async (id) => {

  if (!window.confirm("Delete this record?")) return;

  try {

    await axios.delete(
      `http://localhost:axios.get("https://nba-college-management-system-1.onrender.com/...");/api/memberships/${id}`
    );

    loadMemberships();

    alert("Record Deleted Successfully");

  } catch (error) {

    console.log(error);

    alert("Delete Failed");

  }

};
  return (

  <div className="membership-view">

    <div className="view-header">

      <h2>Membership Records</h2>

      <button
        className="add-btn"
        onClick={() =>
          navigate("/criteria6/membership/add")
        }
      >
        + Add New
      </button>

    </div>

    <table className="membership-table">

      <thead>

        <tr>

          <th>Sr No</th>

          <th>Faculty Name</th>

          <th>Membership</th>

          <th>Society</th>

          <th>Type</th>

          <th>From</th>

          <th>To</th>

          <th>Document</th>

          <th>Action</th>

        </tr>

      </thead>

      <tbody>

{records.length === 0 ? (

<tr>
<td colSpan="9">
No Records Found
</td>
</tr>

) : (

records.map((item, index) => (

<tr key={item.id}>

<td>{index + 1}</td>

<td>{item.faculty_name}</td>

<td>{item.membership_name}</td>

<td>{item.professional_society}</td>

<td>{item.membership_type}</td>

<td>{item.from_date?.substring(0,10)}</td>

<td>{item.to_date?.substring(0,10)}</td>

<td>{item.document}</td>
<td>

<button
className="action-btn delete-btn"
onClick={() => handleDelete(item.id)}
title="Delete"
>
🗑
</button>

</td>

</tr>

))

)}

</tbody>

    </table>

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

);

}

export default MembershipView;