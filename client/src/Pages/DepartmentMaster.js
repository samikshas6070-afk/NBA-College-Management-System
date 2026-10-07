import React, { useState } from "react";
import "./DepartmentMaster.css";

function DepartmentMaster() {

const [department, setDepartment] = useState({
departmentCode: "",
departmentType: "",
hodName: "",
reportingTo: "",
establishedDate: "",
status: "",
building: "",
floor: "",
campus: ""
});

const [errors, setErrors] = useState({});

const validateForm = () => {
let newErrors = {};


if (!department.departmentCode.trim())
  newErrors.departmentCode = "Department Code is required";

if (!department.departmentType)
  newErrors.departmentType = "Department Type is required";

if (!department.hodName.trim())
  newErrors.hodName = "HOD Name is required";

if (!department.reportingTo)
  newErrors.reportingTo = "Reporting To is required";

if (!department.establishedDate)
  newErrors.establishedDate = "Established Date is required";

if (!department.status)
  newErrors.status = "Status is required";

if (!department.building.trim())
  newErrors.building = "Building / Block is required";

if (!department.floor.trim())
  newErrors.floor = "Floor / Room No. is required";

if (!department.campus)
  newErrors.campus = "Campus is required";

setErrors(newErrors);

return Object.keys(newErrors).length === 0;


};

const handleSave = async () => {


if (!validateForm()) {
  alert("Please fill all required fields");
  return;
}

try {
  const response = await fetch(
    "http://localhost:5000/department",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(department)
    }
  );

  const data = await response.json();

  alert(data.message);

} catch (error) {
  console.log(error);
  alert("Save Failed");
}


};

const handleUpdate = () => {


if (!validateForm()) {
  alert("Please fill all required fields");
  return;
}

localStorage.setItem(
  "departmentData",
  JSON.stringify(department)
);

alert("Department Updated Successfully");


};
const handleDelete = () => {


localStorage.removeItem("departmentData");

setDepartment({
  departmentCode: "",
  departmentType: "",
  hodName: "",
  reportingTo: "",
  establishedDate: "",
  status: "",
  building: "",
  floor: "",
  campus: ""
});

setErrors({});

alert("Department Deleted Successfully");


};

const handleClear = () => {


setDepartment({
  departmentCode: "",
  departmentType: "",
  hodName: "",
  reportingTo: "",
  establishedDate: "",
  status: "",
  building: "",
  floor: "",
  campus: ""
});

setErrors({});


};

return ( <div className="department-container">

  <div className="department-card">

    <div className="page-header">
      <div>
        <h1>Department Master</h1>
      </div>
    </div>

    {/* Department Information */}

    <div className="section">

      <div className="section-title">
        <h2>Department Information</h2>
      </div>

      <div className="grid-3">

        <div>
          <label>Department Code *</label>

          <input
            type="text"
            placeholder="Enter Department Code"
            className={errors.departmentCode ? "error-field" : ""}
            value={department.departmentCode}
            onChange={(e) =>
              setDepartment({
                ...department,
                departmentCode: e.target.value
              })
            }
          />

          {errors.departmentCode && (
            <span className="error-message">
              {errors.departmentCode}
            </span>
          )}
        </div>

        <div>

          <label>Department Type *</label>

          <select
            className={errors.departmentType ? "error-field" : ""}
            value={department.departmentType}
            onChange={(e) =>
              setDepartment({
                ...department,
                departmentType: e.target.value
              })
            }
          >
            <option value="">Select Department Type</option>
            <option>Computer Science & Engineering</option>
            <option>Information Technology</option>
            <option>Artificial Intelligence & Data Science</option>
            <option>Electronics & Telecommunication</option>
            <option>Electrical Engineering</option>
            <option>Mechanical Engineering</option>
            <option>Civil Engineering</option>
            <option>MBA</option>
            <option>MCA</option>
            <option>BCA</option>
            <option>BBA</option>
            <option>Science</option>
            <option>Commerce</option>
            <option>Arts</option>
          </select>

          {errors.departmentType && (
            <span className="error-message">
              {errors.departmentType}
            </span>
          )}

        </div>
        
        <div>

          <label>HOD / Incharge Name *</label>

          <input
            type="text"
            placeholder="Enter HOD Name"
            className={errors.hodName ? "error-field" : ""}
            value={department.hodName}
            onChange={(e) =>
              setDepartment({
                ...department,
                hodName: e.target.value
              })
            }
          />

          {errors.hodName && (
            <span className="error-message">
              {errors.hodName}
            </span>
          )}

        </div>

        <div>

          <label>Reporting To *</label>

          <select
            className={errors.reportingTo ? "error-field" : ""}
            value={department.reportingTo}
            onChange={(e) =>
              setDepartment({
                ...department,
                reportingTo: e.target.value
              })
            }
          >
            <option value="">Select Reporting To</option>
            <option>Principal</option>
            <option>Vice Principal</option>
            <option>Dean Academics</option>
            <option>Dean Administration</option>
            <option>Director</option>
            <option>Management Committee</option>
          </select>

          {errors.reportingTo && (
            <span className="error-message">
              {errors.reportingTo}
            </span>
          )}

        </div>

        <div>

          <label>Established Date *</label>

          <input
            type="date"
            className={errors.establishedDate ? "error-field" : ""}
            value={department.establishedDate}
            onChange={(e) =>
              setDepartment({
                ...department,
                establishedDate: e.target.value
              })
            }
          />

          {errors.establishedDate && (
            <span className="error-message">
              {errors.establishedDate}
            </span>
          )}

        </div>

        <div>

          <label>Status *</label>

          <select
            className={errors.status ? "error-field" : ""}
            value={department.status}
            onChange={(e) =>
              setDepartment({
                ...department,
                status: e.target.value
              })
            }
          >
            <option value="">Select Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Under Review</option>
            <option>Suspended</option>
          </select>

          {errors.status && (
            <span className="error-message">
              {errors.status}
            </span>
          )}

        </div>

      </div>

    </div>

    {/* Address Information */}

    <div className="section">

      <div className="section-title">
        <h2>Address Information</h2>
      </div>

      <div className="grid-4">

        <div>

          <label>Building / Block *</label>

          <input
            type="text"
            placeholder="Enter Building / Block"
            className={errors.building ? "error-field" : ""}
            value={department.building}
            onChange={(e) =>
              setDepartment({
                ...department,
                building: e.target.value
              })
            }
          />

          {errors.building && (
            <span className="error-message">
              {errors.building}
            </span>
          )}

        </div>

        <div>

          <label>Floor / Room No. *</label>

          <input
            type="text"
            placeholder="Enter Floor / Room No."
            className={errors.floor ? "error-field" : ""}
            value={department.floor}
            onChange={(e) =>
              setDepartment({
                ...department,
                floor: e.target.value
              })
            }
          />

          {errors.floor && (
            <span className="error-message">
              {errors.floor}
            </span>
          )}

        </div>

        <div>

          <label>Campus *</label>

          <select
            className={errors.campus ? "error-field" : ""}
            value={department.campus}
            onChange={(e) =>
              setDepartment({
                ...department,
                campus: e.target.value
              })
            }
          >
            <option value="">Select Campus</option>
            <option>Main Campus</option>
            <option>North Campus</option>
            <option>South Campus</option>
            <option>Engineering Campus</option>
            <option>Management Campus</option>
          </select>

          {errors.campus && (
            <span className="error-message">
              {errors.campus}
            </span>
          )}

        </div>

      </div>

    </div>

    {/* Buttons */}

    <div className="button-group">

      <button
        className="save-btn"
        onClick={handleSave}
      >
        💾 Save
      </button>

      <button
        className="update-btn"
        onClick={handleUpdate}
      >
        ✏ Update
      </button>

      <button
        className="delete-btn"
        onClick={handleDelete}
      >
        🗑 Delete
      </button>

      <button
        className="clear-btn"
        onClick={handleClear}
      >
        🔄 Clear
      </button>

    </div>

  </div>

</div>


);
}

export default DepartmentMaster;


