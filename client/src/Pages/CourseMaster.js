import React, { useState, useEffect } from "react";
import "./CourseMaster.css";
import axios from "axios";

function CourseMaster() {
const [course, setCourse] = useState(() => {
  const savedData = localStorage.getItem("courseData");

  return savedData
    ? JSON.parse(savedData)
    : {
        courseCode: "",
        courseName: "",
        courseType: "",
        department: "",
        courseLevel: "",
        duration: "",
        totalSemesters: "",
        intakeCapacity: "",
        courseStatus: "",
        approvalStatus: "",
        startDate: "",
        endDate: "",
        coordinator: "",
        contactNumber: "",
        courseDescription: "",
        courseObjective: "",
        eligibilityCriteria: "",
        courseOutcome: "",
        tuitionFees: "",
        developmentFees: "",
        otherFees: "",
        totalFees: ""
      };
});

const [errors, setErrors] = useState({});

useEffect(() => {
  localStorage.setItem(
    "courseData",
    JSON.stringify(course)
  );
}, [course]);

const validateForm = () => {


let newErrors = {};

if (!course.courseCode.trim())
  newErrors.courseCode = "Course Code is required";

if (!course.courseName.trim())
  newErrors.courseName = "Course Name is required";

if (!course.courseType)
  newErrors.courseType = "Course Type is required";

if (!course.department)
  newErrors.department = "Department is required";

if (!course.courseLevel)
  newErrors.courseLevel = "Course Level is required";

if (!course.duration)
  newErrors.duration = "Duration is required";

if (!course.totalSemesters)
  newErrors.totalSemesters = "Total Semesters is required";

if (!course.intakeCapacity)
  newErrors.intakeCapacity = "Intake Capacity is required";

if (!course.courseStatus)
  newErrors.courseStatus = "Course Status is required";

if (!course.tuitionFees)
  newErrors.tuitionFees = "Tuition Fees is required";

if (!course.approvalStatus)
  newErrors.approvalStatus = "Approval Status is required";
if (
  course.startDate &&
  course.endDate &&
  new Date(course.endDate) <= new Date(course.startDate)
) {
  newErrors.endDate =
    "End Date must be greater than Start Date";
}

if (
  course.coordinator &&
  !/^[A-Za-z ]+$/.test(course.coordinator)
) {
  newErrors.coordinator =
    "Only alphabets allowed";
}

if (!course.contactNumber.trim()) {
  newErrors.contactNumber = "Contact Number is required";
}
else if (!/^\d{10}$/.test(course.contactNumber)) {
  newErrors.contactNumber = "Contact Number must be 10 digits";
}

if (!course.courseDescription.trim())
  newErrors.courseDescription = "Course Description is required";

if (!course.courseObjective.trim())
  newErrors.courseObjective = "Course Objective is required";

if (!course.eligibilityCriteria.trim())
  newErrors.eligibilityCriteria = "Eligibility Criteria is required";

if (!course.courseOutcome.trim())
  newErrors.courseOutcome = "Course Outcome is required";

if (!course.developmentFees)
  newErrors.developmentFees = "Development Fees is required";

if (!course.otherFees)
  newErrors.otherFees = "Other Fees is required";

if (!course.totalFees)
  newErrors.totalFees = "Total Fees is required";
setErrors(newErrors);

return Object.keys(newErrors).length === 0;


};
  const handleSave = () => {

  if (!validateForm()) {
    alert("Please fill all required fields");
    return;
  }

  localStorage.setItem(
    "courseData",
    JSON.stringify(course)
  );

  alert("Course Saved Successfully");
};

  const handleUpdate = () => {

    if (!validateForm()) {
      alert("Please fill all required fields");
      return;
    }

    alert("Course Updated Successfully");
  };
const handleDelete = () => {

  localStorage.removeItem("courseData");

  setCourse({
    courseCode: "",
    courseName: "",
    courseType: "",
    department: "",
    courseLevel: "",
    duration: "",
    totalSemesters: "",
    intakeCapacity: "",
    courseStatus: "",
    approvalStatus: "",
    startDate: "",
    endDate: "",
    coordinator: "",
    contactNumber: "",
    courseDescription: "",
    courseObjective: "",
    eligibilityCriteria: "",
    courseOutcome: "",
    tuitionFees: "",
    developmentFees: "",
    otherFees: "",
    totalFees: ""
  });

  setErrors({});

  alert("Course Deleted Successfully");
};const handleClear = () => {

  localStorage.removeItem("courseData");

  setCourse({
    courseCode: "",
    courseName: "",
    courseType: "",
    department: "",
    courseLevel: "",
    duration: "",
    totalSemesters: "",
    intakeCapacity: "",
    courseStatus: "",
    approvalStatus: "",
    startDate: "",
    endDate: "",
    coordinator: "",
    contactNumber: "",
    courseDescription: "",
    courseObjective: "",
    eligibilityCriteria: "",
    courseOutcome: "",
    tuitionFees: "",
    developmentFees: "",
    otherFees: "",
    totalFees: ""
  });

  setErrors({});
};

  return (
    <div className="course-container">

  <div className="course-card">

    {/* Header */}

    <div className="page-header">
      <div className="header-icon">🎓</div>

      <div>
        <h1>Course Master</h1>
        <p>Add, Update and Manage Course Information</p>
      </div>
    </div>

    {/* Course Information */}

    <div className="section">

      <div className="section-title">
        <span className="section-icon">📖</span>
        <h2>Course Information</h2>
      </div>

      <div className="grid-4">

        <div>
          <label>Course Code *</label>

          <input
            type="text"
            placeholder="Enter Course Code"
            className={errors.courseCode ? "error-field" : ""}
            value={course.courseCode}
            onChange={(e) =>
              setCourse({
                ...course,
                courseCode: e.target.value
              })
            }
          />

          {errors.courseCode && (
            <span className="error-message">
              {errors.courseCode}
            </span>
          )}
        </div>

        <div>
          <label>Course Name *</label>

          <input
            type="text"
            placeholder="Enter Course Name"
            className={errors.courseName ? "error-field" : ""}
            value={course.courseName}
            onChange={(e) =>
              setCourse({
                ...course,
                courseName: e.target.value
              })
            }
          />

          {errors.courseName && (
            <span className="error-message">
              {errors.courseName}
            </span>
          )}
        </div>

        <div>
          <label>Course Type *</label>

          <select
            className={errors.courseType ? "error-field" : ""}
            value={course.courseType}
            onChange={(e) =>
              setCourse({
                ...course,
                courseType: e.target.value
              })
            }
          >
            <option value="">Select Course Type</option>
            <option>Degree</option>
            <option>Diploma</option>
            <option>Certificate</option>
            <option>PG Course</option>
          </select>

          {errors.courseType && (
            <span className="error-message">
              {errors.courseType}
            </span>
          )}
        </div>

        <div>
          <label>Department *</label>

          <select
            className={errors.department ? "error-field" : ""}
            value={course.department}
            onChange={(e) =>
              setCourse({
                ...course,
                department: e.target.value
              })
            }
          >
            <option value="">Select Department</option>
            <option>Computer Engineering</option>
            <option>Information Technology</option>
            <option>Mechanical Engineering</option>
            <option>Civil Engineering</option>
            <option>Electronics Engineering</option>
            <option>MBA</option>
            <option>MCA</option>
          </select>

          {errors.department && (
            <span className="error-message">
              {errors.department}
            </span>
          )}
        </div>

        <div>
          <label>Course Level *</label>

          <select
            className={errors.courseLevel ? "error-field" : ""}
            value={course.courseLevel}
            onChange={(e) =>
              setCourse({
                ...course,
                courseLevel: e.target.value
              })
            }
          >
            <option value="">Select Course Level</option>
            <option>UG</option>
            <option>PG</option>
            <option>Doctorate</option>
          </select>

          {errors.courseLevel && (
            <span className="error-message">
              {errors.courseLevel}
            </span>
          )}
        </div>

        <div>
          <label>Duration *</label>

          <select
            className={errors.duration ? "error-field" : ""}
            value={course.duration}
            onChange={(e) =>
              setCourse({
                ...course,
                duration: e.target.value
              })
            }
          >
            <option value="">Select Duration</option>
            <option>1 Year</option>
            <option>2 Years</option>
            <option>3 Years</option>
            <option>4 Years</option>
          </select>

          {errors.duration && (
            <span className="error-message">
              {errors.duration}
            </span>
          )}
        </div>
                <div>
          <label>Total Semesters *</label>

          <select
            className={errors.totalSemesters ? "error-field" : ""}
            value={course.totalSemesters}
            onChange={(e) =>
              setCourse({
                ...course,
                totalSemesters: e.target.value
              })
            }
          >
            <option value="">Select Semesters</option>
            <option>2</option>
            <option>4</option>
            <option>6</option>
            <option>8</option>
          </select>

          {errors.totalSemesters && (
            <span className="error-message">
              {errors.totalSemesters}
            </span>
          )}
        </div>

        <div>
          <label>Intake Capacity *</label>

          <input
            type="number"
            placeholder="Enter Intake Capacity"
            className={errors.intakeCapacity ? "error-field" : ""}
            value={course.intakeCapacity}
            onChange={(e) =>
              setCourse({
                ...course,
                intakeCapacity: e.target.value
              })
            }
          />

          {errors.intakeCapacity && (
            <span className="error-message">
              {errors.intakeCapacity}
            </span>
          )}
        </div>

        <div>
          <label>Course Status *</label>

          <select
            className={errors.courseStatus ? "error-field" : ""}
            value={course.courseStatus}
            onChange={(e) =>
              setCourse({
                ...course,
                courseStatus: e.target.value
              })
            }
          >
            <option value="">Select Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          {errors.courseStatus && (
            <span className="error-message">
              {errors.courseStatus}
            </span>
          )}
        </div>

        <div>
  <label>Approval Status *</label>

  <select
    className={errors.approvalStatus ? "error-field" : ""}
    value={course.approvalStatus}
    onChange={(e) =>
      setCourse({
        ...course,
        approvalStatus: e.target.value
      })
    }
  >
    <option value="">Select Approval Status</option>
    <option>Approved</option>
    <option>Pending</option>
    <option>Rejected</option>
  </select>

  {errors.approvalStatus && (
    <span className="error-message">
      {errors.approvalStatus}
    </span>
  )}
</div>
        <div>
  <label>Start Date *</label>

  <input
    type="date"
    className={errors.startDate ? "error-field" : ""}
    value={course.startDate}
    onChange={(e) =>
      setCourse({
        ...course,
        startDate: e.target.value
      })
    }
  />

  {errors.startDate && (
    <span className="error-message">
      {errors.startDate}
    </span>
  )}
</div>

       <div>
  <label>End Date *</label>

  <input
    type="date"
    className={errors.endDate ? "error-field" : ""}
    value={course.endDate}
    onChange={(e) =>
      setCourse({
        ...course,
        endDate: e.target.value
      })
    }
  />

  {errors.endDate && (
    <span className="error-message">
      {errors.endDate}
    </span>
  )}
</div>

        <div>
  <label>Course Coordinator *</label>

  <input
    type="text"
    placeholder="Enter Coordinator Name"
    className={errors.coordinator ? "error-field" : ""}
    value={course.coordinator}
    onChange={(e) =>
      setCourse({
        ...course,
        coordinator: e.target.value
      })
    }
  />

  {errors.coordinator && (
    <span className="error-message">
      {errors.coordinator}
    </span>
  )}
</div>
      <div>
  <label>Contact Number *</label>

  <input
    type="text"
    placeholder="Enter Contact Number"
    className={errors.contactNumber ? "error-field" : ""}
    value={course.contactNumber}
    onChange={(e) =>
      setCourse({
        ...course,
        contactNumber: e.target.value
      })
    }
  />

  {errors.contactNumber && (
    <span className="error-message">
      {errors.contactNumber}
    </span>
  )}
</div>

      </div>

    </div>
        {/* Course Details */}

    <div className="section">

      <div className="section-title">
        <span className="section-icon">ℹ️</span>
        <h2>Course Details</h2>
      </div>

      <div className="grid-2">

        <div>
  <label>Course Description *</label>

  <textarea
    placeholder="Enter course description..."
    className={errors.courseDescription ? "error-field" : ""}
    value={course.courseDescription}
    onChange={(e) =>
      setCourse({
        ...course,
        courseDescription: e.target.value
      })
    }
  ></textarea>

  {errors.courseDescription && (
    <span className="error-message">
      {errors.courseDescription}
    </span>
  )}
</div>

        <div>
  <label>Course Objective *</label>

  <textarea
    placeholder="Enter course objective..."
    className={errors.courseObjective ? "error-field" : ""}
    value={course.courseObjective}
    onChange={(e) =>
      setCourse({
        ...course,
        courseObjective: e.target.value
      })
    }
  ></textarea>

  {errors.courseObjective && (
    <span className="error-message">
      {errors.courseObjective}
    </span>
  )}
</div>

       <div>
  <label>Eligibility Criteria *</label>

  <textarea
    placeholder="Enter eligibility criteria..."
    className={errors.eligibilityCriteria ? "error-field" : ""}
    value={course.eligibilityCriteria}
    onChange={(e) =>
      setCourse({
        ...course,
        eligibilityCriteria: e.target.value
      })
    }
  ></textarea>

  {errors.eligibilityCriteria && (
    <span className="error-message">
      {errors.eligibilityCriteria}
    </span>
  )}
</div>

       <div>
  <label>Course Outcome *</label>

  <textarea
    placeholder="Enter course outcome..."
    className={errors.courseOutcome ? "error-field" : ""}
    value={course.courseOutcome}
    onChange={(e) =>
      setCourse({
        ...course,
        courseOutcome: e.target.value
      })
    }
  ></textarea>

  {errors.courseOutcome && (
    <span className="error-message">
      {errors.courseOutcome}
    </span>
  )}
</div>

      </div>

    </div>

    {/* Fees Information */}

    <div className="section">

      <div className="section-title">
        <span className="section-icon">₹</span>
        <h2>Fees Information</h2>
      </div>

      <div className="grid-4">

        <div>
          <label>Tuition Fees (₹) *</label>

          <input
            type="number"
            placeholder="Enter Tuition Fees"
            className={errors.tuitionFees ? "error-field" : ""}
            value={course.tuitionFees}
            onChange={(e) =>
              setCourse({
                ...course,
                tuitionFees: e.target.value
              })
            }
          />

          {errors.tuitionFees && (
            <span className="error-message">
              {errors.tuitionFees}
            </span>
          )}
        </div>

        <div>
  <label>Development Fees (₹) *</label>

  <input
    type="number"
    placeholder="Enter Development Fees"
    className={errors.developmentFees ? "error-field" : ""}
    value={course.developmentFees}
    onChange={(e) =>
      setCourse({
        ...course,
        developmentFees: e.target.value
      })
    }
  />

  {errors.developmentFees && (
    <span className="error-message">
      {errors.developmentFees}
    </span>
  )}
</div>

       <div>
  <label>Other Fees (₹) *</label>

  <input
    type="number"
    placeholder="Enter Other Fees"
    className={errors.otherFees ? "error-field" : ""}
    value={course.otherFees}
    onChange={(e) =>
      setCourse({
        ...course,
        otherFees: e.target.value
      })
    }
  />

  {errors.otherFees && (
    <span className="error-message">
      {errors.otherFees}
    </span>
  )}
</div>

        <div>
  <label>Total Fees (₹) *</label>

  <input
    type="number"
    placeholder="Enter Total Fees"
    className={errors.totalFees ? "error-field" : ""}
    value={course.totalFees}
    onChange={(e) =>
      setCourse({
        ...course,
        totalFees: e.target.value
      })
    }
  />

  {errors.totalFees && (
    <span className="error-message">
      {errors.totalFees}
    </span>
  )}
</div>

      </div>

    </div>

    {/* Action Buttons */}

    <div className="button-group">

      <button
        className="save-btn"
        onClick={handleSave}
      >
        Save
      </button>

      <button
        className="update-btn"
        onClick={handleUpdate}
      >
        Update
      </button>

      <button
        className="delete-btn"
        onClick={handleDelete}
      >
        Delete
      </button>

      <button
        className="clear-btn"
        onClick={handleClear}
      >
        Clear
      </button>

    </div>

  </div>

</div>
  );
}

export default CourseMaster;
