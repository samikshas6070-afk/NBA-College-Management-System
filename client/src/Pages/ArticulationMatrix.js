import React, { useState, useEffect } from "react";
import "./ArticulationMatrix.css";
import { FaTable, FaEdit, FaTrash, FaSave } from "react-icons/fa";

function ArticulationMatrix({
  onNext,
  onPrevious
})  {
const [department, setDepartment] = useState("");
const [courses, setCourses] = useState([]);
const [editId, setEditId] = useState(null);
 const loadCourses = async () => {
console.log(courses);
  if (!department) return;

  const res = await fetch(
    `http://localhost:5000/get-course-master/${department}`
  );

  const data = await res.json();

  console.log("Courses =", data);

  setCourses(
    data.map((row) => ({
      ...row,
      po1: "",
      po2: "",
      po3: "",
      po4: "",
      po5: "",
      po6: "",
      po7: "",
      po8: "",
      po9: "",
      po10: "",
      pso1: "",
      pso2: "",
      pso3:""
    }))
  );

};
useEffect(() => {

  if (department) {
    loadCourses();
  }

}, [department]);

const handleSave = async () => {

  try {

    for (const row of courses) {

      await fetch(
        "http://localhost:5000/save-all-courses-matrix",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            department,

            courseCode: row.course_code,
            courseName: row.course_name,

            po1: row.po1,
            po2: row.po2,
            po3: row.po3,
            po4: row.po4,
            po5: row.po5,
            po6: row.po6,
            po7: row.po7,
            po8: row.po8,
            po9: row.po9,
            po10: row.po10,

            pso1: row.pso1,
            pso2: row.pso2,
          pso3: row.pso3

          })

        }
      );

    }

    alert("All Courses Saved Successfully");

  } catch (error) {

    console.log(error);

    alert("Save Error");

  }

};
const handlePrevious = () => {
  onPrevious();
};
const handleUpdate=async()=>{

for(const row of courses){

await fetch(

`http://localhost:5000/update-all-courses-matrix/${row.id}`,

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

department,

courseCode:row.course_code,
courseName:row.course_name,

po1:row.po1,
po2:row.po2,
po3:row.po3,
po4:row.po4,
po5:row.po5,
po6:row.po6,
po7:row.po7,
po8:row.po8,
po9:row.po9,
po10:row.po10,

pso1:row.pso1,
pso2:row.pso2,
pso3:row.pso3

})

}

);

}

alert("Updated Successfully");

};
const handleDelete = () => {

  alert("Select a row and delete.");

};
const handleRowDelete=async(id)=>{

if(!window.confirm("Delete Record?"))
return;

await fetch(

`http://localhost:5000/delete-all-courses-matrix/${id}`,

{
method:"DELETE"
}

);

setCourses(

courses.filter((row)=>row.id!==id)

);

};
const handleRowEdit=(row)=>{

setEditId(row.id);

}
;

  return (
    <div className="matrix-page">

      <div className="matrix-card">

        <div className="matrix-header">
          <FaTable />
          <h2>1.5 All Courses Articulation Matrix</h2>
        </div>

       <div className="dept-section">
          <label>Department</label>

          <select
    value={department}
    onChange={(e) => setDepartment(e.target.value)}
>

<option value="">Select Department</option>

<option value="Computer Science Engineering">
Computer Science Engineering
</option>

<option value="Information Technology">
Information Technology
</option>

<option value="MCA">
MCA
</option>

</select>
        </div>
<div className="table-wrapper"></div>
     <table className="all-course-table">

          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>PO1</th>
              <th>PO2</th>
              <th>PO3</th>
              <th>PO4</th>
              <th>PO5</th>
              <th>PO6</th>
              <th>PO7</th>
              <th>PO8</th>
              <th>PO9</th>
              <th>PO10</th>
              <th>PSO1</th>
              <th>PSO2</th>
               <th>PSO3</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

{courses.map((row, index) => (

<tr key={index}>

<td>{row.course_code}</td>

<td className="course-name">
  {row.course_name}
</td>

<td>
  <input
    type="number"
    value={row.po1}
    onChange={(e) => {
      const temp = [...courses];
      temp[index].po1 = e.target.value;
      setCourses(temp);
    }}
  />
</td>
<td>
<input
type="number"
value={row.po2}
onChange={(e)=>{

const temp=[...courses];

temp[index].po2=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po3}
onChange={(e)=>{

const temp=[...courses];

temp[index].po3=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po4}
onChange={(e)=>{

const temp=[...courses];

temp[index].po4=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po5}
onChange={(e)=>{

const temp=[...courses];

temp[index].po5=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po6}
onChange={(e)=>{

const temp=[...courses];

temp[index].po6=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po7}
onChange={(e)=>{

const temp=[...courses];

temp[index].po7=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po8}
onChange={(e)=>{

const temp=[...courses];

temp[index].po8=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po9}
onChange={(e)=>{

const temp=[...courses];

temp[index].po9=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po10}
onChange={(e)=>{

const temp=[...courses];

temp[index].po10=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.pso1}
onChange={(e)=>{

const temp=[...courses];

temp[index].pso1=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.pso2}
onChange={(e)=>{

const temp=[...courses];

temp[index].pso2=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.pso3}
onChange={(e)=>{

const temp=[...courses];

temp[index].pso3=e.target.value;

setCourses(temp);

}}
/>
</td>

                <td className="action-cell">
<button
className="edit-btn"
onClick={()=>handleRowEdit(row)}
>
<FaEdit/>
</button>
  <button
className="delete-btn"
onClick={()=>handleRowDelete(row.id)}
>
<FaTrash/>
</button>

</td>

              </tr>
            ))}

          </tbody>

        </table>

       <div className="matrix-buttons">
        <button
  className="previous-page-btn"
  onClick={handlePrevious}
>
  ← Previous
</button>

  <button
    className="save-btn"
    onClick={handleSave}
  >
    <FaSave /> Save
  </button>

  <button
    className="update-btn"
    onClick={handleUpdate}
  >
    <FaEdit /> Update
  </button>

  <button
    className="delete-main-btn"
    onClick={handleDelete}
  >
    <FaTrash /> Delete
  </button>
<button
  className="next-page-btn"
  onClick={onNext}
>
  Next →
</button>
</div>

      </div>

    </div>
  );
}

export default ArticulationMatrix;