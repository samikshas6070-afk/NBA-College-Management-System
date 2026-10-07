import React, { useEffect, useState } from "react";
import NBASidebar from "../Pages/NBASidebar";
import "./coursesyllabus.css";

const CourseSyllabus = () => {
  /* =========================================================
     EMPTY FORM
  ========================================================= */

  const emptyForm = {
    courseCode: "",
    courseName: "",
    academicYear: "",
    semester: "",
    department: "",
    facultyName: "",
    courseType: "",
    credits: "",
    lectureHours: "",
    practicalHours: "",
    tutorialHours: "",

    courseObjectives: "",
    prerequisites: "",
    courseDescription: "",

    unit1: "",
    unit2: "",
    unit3: "",
    unit4: "",
    unit5: "",

    co1: "",
    co2: "",
    co3: "",
    co4: "",
    co5: "",

    referenceBooks: "",
    onlineResources: "",

    file: null,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [savedData, setSavedData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  /* =========================================================
     LOAD SAVED DATA
  ========================================================= */

  useEffect(() => {
    const storedData = localStorage.getItem("course_syllabus_data");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          setSavedData(parsedData);
        }
      } catch (error) {
        console.error("Error loading syllabus data:", error);
      }
    }
  }, []);

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     HANDLE FILE
  ========================================================= */

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        file: null,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      file: {
        name: file.name,
        type: file.type,
        size: file.size,
      },
    }));
  };

  /* =========================================================
     SAVE / UPDATE
  ========================================================= */

  const handleSave = () => {
    if (!formData.courseCode.trim()) {
      alert("Please enter Course Code.");
      return;
    }

    if (!formData.courseName.trim()) {
      alert("Please enter Course Name.");
      return;
    }

    if (!formData.academicYear.trim()) {
      alert("Please enter Academic Year.");
      return;
    }

    if (!formData.facultyName.trim()) {
      alert("Please enter Faculty Name.");
      return;
    }

    let updatedData;

    /* =======================================================
       UPDATE EXISTING RECORD
    ======================================================= */

    if (editingId !== null) {
      updatedData = savedData.map((item) =>
        item.id === editingId
          ? {
              ...formData,
              id: editingId,
              updatedAt: new Date().toISOString(),
            }
          : item
      );

      alert("Course Syllabus updated successfully.");
    }

    /* =======================================================
       CREATE NEW RECORD
    ======================================================= */

    else {
      const newData = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      updatedData = [...savedData, newData];

      alert("Course Syllabus saved successfully.");
    }

    setSavedData(updatedData);

    localStorage.setItem(
      "course_syllabus_data",
      JSON.stringify(updatedData)
    );

    setFormData({ ...emptyForm });
    setEditingId(null);
  };

  /* =========================================================
     CLEAR FORM
  ========================================================= */

  const handleClear = () => {
    setFormData({ ...emptyForm });
    setEditingId(null);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (item) => {
    setFormData({
      ...emptyForm,
      ...item,
    });

    setEditingId(item.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Course Syllabus?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedData = savedData.filter(
      (item) => item.id !== id
    );

    setSavedData(updatedData);

    localStorage.setItem(
      "course_syllabus_data",
      JSON.stringify(updatedData)
    );

    if (editingId === id) {
      setFormData({ ...emptyForm });
      setEditingId(null);
    }
  };

  /* =========================================================
     BACK
  ========================================================= */

  const handleBack = () => {
    window.history.back();
  };

  /* =========================================================
     VIEW FILE
  ========================================================= */

  const handleViewFile = (file) => {
    if (!file) {
      alert("No file uploaded.");
      return;
    }

    alert(
      `Uploaded File:\n${file.name}\n\nFile viewing will be connected with backend storage.`
    );
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="course-syllabus-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <NBASidebar />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="nba-header">

        <div className="header-menu">
          ☰
        </div>

        <div className="header-title">
          NBA Accreditation Management System
        </div>

        <div className="header-bell">
          🔔
        </div>

        <div className="profile-circle">
          S
        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="syllabus-content">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="page-top">

          <button
            type="button"
            className="back-button"
            onClick={handleBack}
          >
            ← Back
          </button>

          <div>
            <h1>Course Syllabus</h1>

            <p>
              Enter and manage course syllabus information.
            </p>
          </div>

        </div>

        {/* ===================================================
            FORM CARD
        =================================================== */}

        <div className="syllabus-card">

          {/* CARD HEADER */}

          <div className="card-title">

            <h2>
              {editingId !== null
                ? "Edit Course Syllabus"
                : "Course Syllabus Details"}
            </h2>

            <span>
              Faculty can enter the course syllabus information
            </span>

          </div>

          {/* =================================================
              COURSE INFORMATION
          ================================================= */}

          <div className="section-title">
            Course Information
          </div>

          <div className="form-grid">

            {/* COURSE CODE */}

            <div className="form-group">

              <label>
                Course Code <span>*</span>
              </label>

              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                placeholder="Enter course code"
              />

            </div>

            {/* COURSE NAME */}

            <div className="form-group">

              <label>
                Course Name <span>*</span>
              </label>

              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="Enter course name"
              />

            </div>

            {/* ACADEMIC YEAR */}

            <div className="form-group">

              <label>
                Academic Year <span>*</span>
              </label>

              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="Example: 2026-27"
              />

            </div>

            {/* SEMESTER */}

            <div className="form-group">

              <label>
                Semester
              </label>

              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >

                <option value="">
                  Select Semester
                </option>

                <option value="Semester I">
                  Semester I
                </option>

                <option value="Semester II">
                  Semester II
                </option>

                <option value="Semester III">
                  Semester III
                </option>

                <option value="Semester IV">
                  Semester IV
                </option>

              </select>

            </div>

            {/* DEPARTMENT */}

            <div className="form-group">

              <label>
                Department
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department"
              />

            </div>

            {/* FACULTY */}

            <div className="form-group">

              <label>
                Faculty Name <span>*</span>
              </label>

              <input
                type="text"
                name="facultyName"
                value={formData.facultyName}
                onChange={handleChange}
                placeholder="Enter faculty name"
              />

            </div>

            {/* COURSE TYPE */}

            <div className="form-group">

              <label>
                Course Type
              </label>

              <select
                name="courseType"
                value={formData.courseType}
                onChange={handleChange}
              >

                <option value="">
                  Select Course Type
                </option>

                <option value="Theory">
                  Theory
                </option>

                <option value="Practical">
                  Practical
                </option>

                <option value="Theory + Practical">
                  Theory + Practical
                </option>

                <option value="Project">
                  Project
                </option>

              </select>

            </div>

            {/* CREDITS */}

            <div className="form-group">

              <label>
                Credits
              </label>

              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                placeholder="Enter credits"
                min="0"
              />

            </div>

            {/* LECTURE HOURS */}

            <div className="form-group">

              <label>
                Lecture Hours
              </label>

              <input
                type="number"
                name="lectureHours"
                value={formData.lectureHours}
                onChange={handleChange}
                placeholder="Enter hours"
                min="0"
              />

            </div>

            {/* PRACTICAL HOURS */}

            <div className="form-group">

              <label>
                Practical Hours
              </label>

              <input
                type="number"
                name="practicalHours"
                value={formData.practicalHours}
                onChange={handleChange}
                placeholder="Enter hours"
                min="0"
              />

            </div>

            {/* TUTORIAL HOURS */}

            <div className="form-group">

              <label>
                Tutorial Hours
              </label>

              <input
                type="number"
                name="tutorialHours"
                value={formData.tutorialHours}
                onChange={handleChange}
                placeholder="Enter hours"
                min="0"
              />

            </div>

          </div>

          {/* =================================================
              COURSE OBJECTIVES
          ================================================= */}

          <div className="section-title">
            Course Objectives
          </div>

          <div className="form-group full-width">

            <label>
              Course Objectives
            </label>

            <textarea
              name="courseObjectives"
              value={formData.courseObjectives}
              onChange={handleChange}
              placeholder="Enter course objectives"
              rows="4"
            />

          </div>

          {/* =================================================
              PREREQUISITES
          ================================================= */}

          <div className="form-group full-width">

            <label>
              Prerequisites
            </label>

            <textarea
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              placeholder="Enter prerequisites"
              rows="3"
            />

          </div>

          {/* =================================================
              COURSE DESCRIPTION
          ================================================= */}

          <div className="form-group full-width">

            <label>
              Course Description
            </label>

            <textarea
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleChange}
              placeholder="Enter course description"
              rows="4"
            />

          </div>

          {/* =================================================
              SYLLABUS UNITS
          ================================================= */}

          <div className="section-title">
            Syllabus Units
          </div>

          <div className="form-grid">

            {/* UNIT 1 */}

            <div className="form-group full-width">

              <label>
                Unit 1
              </label>

              <textarea
                name="unit1"
                value={formData.unit1}
                onChange={handleChange}
                placeholder="Enter Unit 1 syllabus"
                rows="4"
              />

            </div>

            {/* UNIT 2 */}

            <div className="form-group full-width">

              <label>
                Unit 2
              </label>

              <textarea
                name="unit2"
                value={formData.unit2}
                onChange={handleChange}
                placeholder="Enter Unit 2 syllabus"
                rows="4"
              />

            </div>

            {/* UNIT 3 */}

            <div className="form-group full-width">

              <label>
                Unit 3
              </label>

              <textarea
                name="unit3"
                value={formData.unit3}
                onChange={handleChange}
                placeholder="Enter Unit 3 syllabus"
                rows="4"
              />

            </div>

            {/* UNIT 4 */}

            <div className="form-group full-width">

              <label>
                Unit 4
              </label>

              <textarea
                name="unit4"
                value={formData.unit4}
                onChange={handleChange}
                placeholder="Enter Unit 4 syllabus"
                rows="4"
              />

            </div>

            {/* UNIT 5 */}

            <div className="form-group full-width">

              <label>
                Unit 5
              </label>

              <textarea
                name="unit5"
                value={formData.unit5}
                onChange={handleChange}
                placeholder="Enter Unit 5 syllabus"
                rows="4"
              />

            </div>

          </div>

          {/* =================================================
              COURSE OUTCOMES
          ================================================= */}

          <div className="section-title">
            Course Outcomes
          </div>

          <div className="co-grid">

            {/* CO1 */}

            <div className="form-group">

              <label>
                CO1
              </label>

              <textarea
                name="co1"
                value={formData.co1}
                onChange={handleChange}
                placeholder="Enter CO1"
                rows="3"
              />

            </div>

            {/* CO2 */}

            <div className="form-group">

              <label>
                CO2
              </label>

              <textarea
                name="co2"
                value={formData.co2}
                onChange={handleChange}
                placeholder="Enter CO2"
                rows="3"
              />

            </div>

            {/* CO3 */}

            <div className="form-group">

              <label>
                CO3
              </label>

              <textarea
                name="co3"
                value={formData.co3}
                onChange={handleChange}
                placeholder="Enter CO3"
                rows="3"
              />

            </div>

            {/* CO4 */}

            <div className="form-group">

              <label>
                CO4
              </label>

              <textarea
                name="co4"
                value={formData.co4}
                onChange={handleChange}
                placeholder="Enter CO4"
                rows="3"
              />

            </div>

            {/* CO5 */}

            <div className="form-group">

              <label>
                CO5
              </label>

              <textarea
                name="co5"
                value={formData.co5}
                onChange={handleChange}
                placeholder="Enter CO5"
                rows="3"
              />

            </div>

          </div>

          {/* =================================================
              REFERENCES
          ================================================= */}

          <div className="section-title">
            References & Resources
          </div>

          {/* REFERENCE BOOKS */}

          <div className="form-group full-width">

            <label>
              Reference Books
            </label>

            <textarea
              name="referenceBooks"
              value={formData.referenceBooks}
              onChange={handleChange}
              placeholder="Enter reference books"
              rows="4"
            />

          </div>

          {/* ONLINE RESOURCES */}

          <div className="form-group full-width">

            <label>
              Online Resources
            </label>

            <textarea
              name="onlineResources"
              value={formData.onlineResources}
              onChange={handleChange}
              placeholder="Enter online resources"
              rows="4"
            />

          </div>

          {/* =================================================
              FILE UPLOAD
          ================================================= */}

          <div className="section-title">
            Syllabus Document
          </div>

          <div className="file-upload">

            <label>
              Upload Syllabus Document
            </label>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />

            {formData.file && (
              <div className="selected-file">
                Selected File:{" "}
                <strong>{formData.file.name}</strong>
              </div>
            )}

          </div>

          {/* =================================================
              FORM ACTIONS
          ================================================= */}

          <div className="form-actions">

            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
            >
              Clear
            </button>

            <button
              type="button"
              className="save-button"
              onClick={handleSave}
            >
              {editingId !== null
                ? "Update Syllabus"
                : "Save Syllabus"}
            </button>

          </div>

        </div>

        {/* ===================================================
            SAVED SYLLABUS
        =================================================== */}

        <div className="saved-section">

          <div className="saved-header">

            <h2>
              Saved Course Syllabus
            </h2>

            <span>
              {savedData.length} record(s)
            </span>

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {savedData.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📄
              </div>

              <h3>
                No Course Syllabus Saved
              </h3>

              <p>
                Faculty-entered syllabus information will
                appear here after saving.
              </p>

            </div>

          ) : (

            /* =================================================
               SAVED LIST
            ================================================= */

            <div className="saved-list">

              {savedData.map((item) => (

                <div
                  className="saved-card"
                  key={item.id}
                >

                  {/* SAVED CARD TOP */}

                  <div className="saved-card-top">

                    <div>

                      <h3>
                        {item.courseName}
                      </h3>

                      <p>
                        {item.courseCode}
                      </p>

                    </div>

                    <div className="saved-actions">

                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          handleEdit(item)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                  {/* SAVED INFORMATION */}

                  <div className="saved-info">

                    <div>

                      <strong>
                        Academic Year
                      </strong>

                      <span>
                        {item.academicYear || "-"}
                      </span>

                    </div>

                    <div>

                      <strong>
                        Semester
                      </strong>

                      <span>
                        {item.semester || "-"}
                      </span>

                    </div>

                    <div>

                      <strong>
                        Faculty
                      </strong>

                      <span>
                        {item.facultyName || "-"}
                      </span>

                    </div>

                    <div>

                      <strong>
                        Department
                      </strong>

                      <span>
                        {item.department || "-"}
                      </span>

                    </div>

                  </div>

                  {/* SAVED FILE */}

                  {item.file && (

                    <div className="saved-file">

                      <span>
                        📎 {item.file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewFile(item.file)
                        }
                      >
                        View
                      </button>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default CourseSyllabus;