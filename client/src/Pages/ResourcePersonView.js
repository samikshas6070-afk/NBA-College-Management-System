import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ResourcePersonView.css";

function ResourcePersonView() {

  const navigate = useNavigate();
const [records, setRecords] = useState([]);
useEffect(() => {
  loadRecords();
}, []);

const loadRecords = async () => {

  const res = await axios.get(
    "http://localhost:5000/api/resource-persons"
  );

  setRecords(res.data);

};
const handleDelete = async (id) => {

  if (!window.confirm("Delete this record?")) return;

  await axios.delete(
    `http://localhost:5000/api/resource-persons/${id}`
  );

  loadRecords();

};
  return (

    <div className="resource-view">

      <div className="view-header">

        <h2>
          Faculty as Resource Persons
        </h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/resource-person/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="resource-table">

        <thead>

          <tr>

            <th>Sr No</th>

            <th>Faculty Name</th>

            <th>Event Name</th>

            <th>Organization</th>

            <th>Venue</th>

            <th>Date</th>

            <th>Role</th>

            <th>Document</th>

            <th>Action</th>

          </tr>

        </thead>
<tbody>

{records.length === 0 ? (

<tr>
<td colSpan="8">No Records Found</td>
</tr>

) : (

records.map((item, index) => (

<tr key={item.id}>

<td>{index + 1}</td>

<td>{item.faculty_name}</td>

<td>{item.event_name}</td>

<td>{item.organization_name}</td>

<td>{item.topic}</td>

<td>{item.event_date?.substring(0,10)}</td>

<td>{item.academic_year}</td>


<td>
  {item.document}
</td>

<td>
  <button
    className="action-btn delete-btn"
    onClick={() => handleDelete(item.id)}
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

export default ResourcePersonView;