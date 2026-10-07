import React, { useEffect, useState } from "react";
import "./courses.css";
import { useNavigate } from "react-router-dom";


/* =========================================================
   DEFAULT COURSES
========================================================= */

const DEFAULT_COURSES = [
  {
    id: 1,
    courseCode: "CS301",
    courseName: "Data Structures",
    semester: "V",
    academicYear: "2026-27",
    department: "Computer Engineering",
    faculty: "Dr. Faculty",
  },
  {
    id: 2,
    courseCode: "CS302",
    courseName: "Database Management",
    semester: "V",
    academicYear: "2026-27",
    department: "Computer Engineering",
    faculty: "Dr. Faculty",
  },
];

/* =========================================================
   SPECIALIZED MODULES
========================================================= */

const MODULES = [
  {
    id: 1,
    title: "Course Syllabus",
    icon: "▣",
    className: "module-blue",
    description: "Complete syllabus and course structure",
  },
  {
    id: 2,
    title: "Course Plan",
    icon: "▤",
    className: "module-green",
    description: "Unit-wise teaching and course plan",
  },
  {
    id: 3,
    title: "Lesson Plan",
    icon: "☰",
    className: "module-purple",
    description: "Detailed lesson-wise teaching plan",
  },
  {
    id: 4,
    title: "Lecture Notes",
    icon: "▤",
    className: "module-orange",
    description: "Topic-wise lecture notes",
  },
  {
    id: 5,
    title: "Question Papers",
    icon: "▥",
    className: "module-blue",
    description: "Question papers and question bank",
  },
  {
    id: 6,
    title: "Assignment",
    icon: "✎",
    className: "module-green",
    description: "Assignments given to students",
  },
  {
    id: 7,
    title: "Internal Assessment",
    icon: "▣",
    className: "module-purple",
    description: "Internal assessment and marks",
  },
  {
    id: 8,
    title: "University Examination",
    icon: "♜",
    className: "module-orange",
    description: "University examination details",
  },
  {
    id: 9,
    title: "CO Mapping",
    icon: "◎",
    className: "module-yellow",
    description: "Course Outcome mapping",
  },
  {
    id: 10,
    title: "CO Attainment",
    icon: "▥",
    className: "module-cyan",
    description: "Course Outcome attainment",
  },
  {
    id: 11,
    title: "Course Feedback",
    icon: "♣",
    className: "module-blue",
    description: "Student feedback analysis",
  },
  {
    id: 12,
    title: "Result Analysis",
    icon: "⌁",
    className: "module-green",
    description: "Student result analysis",
  },
  {
    id: 13,
    title: "Course Completion Report",
    icon: "▤",
    className: "module-purple",
    description: "Course completion details",
  },
  {
    id: 14,
    title: "Teaching Activities & Case Studies",
    icon: "✦",
    className: "module-yellow",
    description: "Teaching activities and case studies",
  },
  {
    id: 15,
    title: "Laboratory & Experiments",
    icon: "⚗",
    className: "module-cyan",
    description: "Laboratory experiments and practical work",
  },
];

/* =========================================================
   COURSE-SPECIFIC DATA
========================================================= */

const getModuleData = (course, moduleId) => {
  const name = course.courseName;

  const common = {
    1: {
      heading: "Course Syllabus",
      sections: [
        {
          title: "Course Information",
          items: [
            ["Course Code", course.courseCode],
            ["Course Name", name],
            ["Semester", course.semester],
            ["Academic Year", course.academicYear],
            ["Department", course.department],
          ],
        },
        {
          title: "Course Objectives",
          items: [
            ["CO1", "Understand fundamental concepts of data organization."],
            ["CO2", "Apply linear and non-linear data structures."],
            ["CO3", "Analyze searching and sorting techniques."],
            ["CO4", "Select appropriate data structures for problems."],
            ["CO5", "Implement data structures using programming."],
          ],
        },
        {
          title: "Units",
          items: [
            ["Unit 1", "Introduction, Arrays and Linked Lists"],
            ["Unit 2", "Stacks and Queues"],
            ["Unit 3", "Trees and Binary Search Trees"],
            ["Unit 4", "Graphs and Graph Algorithms"],
            ["Unit 5", "Searching and Sorting"],
          ],
        },
      ],
    },

    2: {
      heading: "Course Plan",
      sections: [
        {
          title: "Course Plan",
          items: [
            ["Unit 1", "Introduction, Arrays, Linked Lists"],
            ["Unit 2", "Stacks, Queues and Applications"],
            ["Unit 3", "Trees, BST and Traversals"],
            ["Unit 4", "Graphs, BFS and DFS"],
            ["Unit 5", "Searching and Sorting"],
          ],
        },
        {
          title: "Teaching Method",
          items: [
            ["Method 1", "Board / Digital Teaching"],
            ["Method 2", "Programming Demonstration"],
            ["Method 3", "Problem Solving"],
            ["Method 4", "Collaborative Learning"],
            ["Method 5", "Laboratory Practice"],
          ],
        },
      ],
    },

    3: {
      heading: "Lesson Plan",
      sections: [
        {
          title: "Lesson Schedule",
          items: [
            ["Lecture 1", "Introduction to Data Structures"],
            ["Lecture 2", "Arrays"],
            ["Lecture 3", "Linked Lists"],
            ["Lecture 4", "Stacks"],
            ["Lecture 5", "Queues"],
            ["Lecture 6", "Trees"],
            ["Lecture 7", "Graphs"],
            ["Lecture 8", "Searching and Sorting"],
          ],
        },
      ],
    },

    4: {
      heading: "Lecture Notes",
      sections: [
        {
          title: "Available Notes",
          items: [
            ["Topic 1", "Introduction to Data Structures"],
            ["Topic 2", "Arrays and Linked Lists"],
            ["Topic 3", "Stacks and Queues"],
            ["Topic 4", "Trees and Graphs"],
            ["Topic 5", "Searching Algorithms"],
            ["Topic 6", "Sorting Algorithms"],
          ],
        },
      ],
    },

    5: {
      heading: "Question Papers",
      sections: [
        {
          title: "Question Paper Details",
          items: [
            ["Unit Test", "Data Structures - Unit 1 & Unit 2"],
            ["Class Test", "Stacks, Queues and Linked Lists"],
            ["Mid Term", "Units 1 to 3"],
            ["University Exam", "Complete Data Structures syllabus"],
          ],
        },
        {
          title: "Question Bank",
          items: [
            ["Q1", "Explain arrays and linked lists."],
            ["Q2", "Explain stack operations."],
            ["Q3", "Explain tree traversal techniques."],
            ["Q4", "Compare BFS and DFS."],
            ["Q5", "Explain sorting algorithms."],
          ],
        },
      ],
    },

    6: {
      heading: "Assignment",
      sections: [
        {
          title: "Assignments",
          items: [
            ["Assignment 1", "Implement array operations."],
            ["Assignment 2", "Implement singly linked list."],
            ["Assignment 3", "Implement stack using array."],
            ["Assignment 4", "Implement queue using linked list."],
            ["Assignment 5", "Implement binary search tree."],
          ],
        },
      ],
    },

    7: {
      heading: "Internal Assessment",
      sections: [
        {
          title: "Assessment Components",
          items: [
            ["Unit Test", "20 Marks"],
            ["Class Test", "20 Marks"],
            ["Assignment", "10 Marks"],
            ["Practical", "20 Marks"],
            ["Internal Total", "30 Marks"],
          ],
        },
        {
          title: "CO Assessment",
          items: [
            ["CO1", "Assessed through Unit Test"],
            ["CO2", "Assessed through Assignment"],
            ["CO3", "Assessed through Class Test"],
            ["CO4", "Assessed through Practical"],
            ["CO5", "Assessed through Practical & Assignment"],
          ],
        },
      ],
    },

    8: {
      heading: "University Examination",
      sections: [
        {
          title: "Examination Details",
          items: [
            ["Examination", "University Semester Examination"],
            ["Course", name],
            ["Maximum Marks", "70"],
            ["Duration", "3 Hours"],
            ["Pattern", "Theory Examination"],
          ],
        },
        {
          title: "Unit Weightage",
          items: [
            ["Unit 1", "14 Marks"],
            ["Unit 2", "14 Marks"],
            ["Unit 3", "14 Marks"],
            ["Unit 4", "14 Marks"],
            ["Unit 5", "14 Marks"],
          ],
        },
      ],
    },

    9: {
      heading: "CO Mapping",
      sections: [
        {
          title: "Course Outcomes",
          items: [
            ["CO1", "Understand basic data structure concepts"],
            ["CO2", "Implement linear data structures"],
            ["CO3", "Analyze non-linear data structures"],
            ["CO4", "Apply searching and sorting"],
            ["CO5", "Solve computational problems"],
          ],
        },
        {
          title: "CO to Course Content Mapping",
          items: [
            ["Unit 1 → CO1", "100%"],
            ["Unit 2 → CO2", "100%"],
            ["Unit 3 → CO3", "100%"],
            ["Unit 4 → CO4", "85%"],
            ["Unit 5 → CO5", "90%"],
          ],
        },
      ],
    },

    10: {
      heading: "CO Attainment",
      sections: [
        {
          title: "CO Attainment Summary",
          items: [
            ["CO1", "2.85 / 3.00"],
            ["CO2", "2.72 / 3.00"],
            ["CO3", "2.61 / 3.00"],
            ["CO4", "2.55 / 3.00"],
            ["CO5", "2.70 / 3.00"],
          ],
        },
        {
          title: "Attainment Status",
          items: [
            ["CO1", "High"],
            ["CO2", "High"],
            ["CO3", "High"],
            ["CO4", "Medium"],
            ["CO5", "High"],
          ],
        },
      ],
    },

    11: {
      heading: "Course Feedback",
      sections: [
        {
          title: "Student Feedback",
          items: [
            ["Content Quality", "4.5 / 5"],
            ["Teaching Effectiveness", "4.4 / 5"],
            ["Practical Understanding", "4.6 / 5"],
            ["Problem Solving", "4.3 / 5"],
            ["Overall Satisfaction", "4.5 / 5"],
          ],
        },
        {
          title: "Feedback Summary",
          items: [
            ["Positive Feedback", "Students understood practical implementation."],
            ["Improvement Area", "More programming practice recommended."],
          ],
        },
      ],
    },

    12: {
      heading: "Result Analysis",
      sections: [
        {
          title: "Result Summary",
          items: [
            ["Students Appeared", "60"],
            ["Students Passed", "55"],
            ["Students Failed", "5"],
            ["Pass Percentage", "91.67%"],
            ["Average Marks", "68.4%"],
          ],
        },
        {
          title: "Performance Analysis",
          items: [
            ["Excellent", "15 Students"],
            ["Good", "25 Students"],
            ["Average", "15 Students"],
            ["Needs Improvement", "5 Students"],
          ],
        },
      ],
    },

    13: {
      heading: "Course Completion Report",
      sections: [
        {
          title: "Completion Status",
          items: [
            ["Total Units", "5"],
            ["Units Completed", "5"],
            ["Completion", "100%"],
            ["Total Lectures", "45"],
            ["Lectures Conducted", "45"],
          ],
        },
        {
          title: "Academic Activities",
          items: [
            ["Assignments", "5 Completed"],
            ["Unit Tests", "2 Conducted"],
            ["Practical Sessions", "15 Conducted"],
            ["University Examination", "Completed"],
          ],
        },
      ],
    },

    14: {
      heading: "Teaching Activities & Case Studies",
      sections: [
        {
          title: "Teaching Activities",
          items: [
            ["Activity 1", "Problem Based Learning"],
            ["Activity 2", "Group Discussion"],
            ["Activity 3", "Algorithm Visualization"],
            ["Activity 4", "Live Coding"],
            ["Activity 5", "Peer Learning"],
          ],
        },
        {
          title: "Case Studies",
          items: [
            [
              "Case Study 1",
              "Hospital patient management using linked lists",
            ],
            [
              "Case Study 2",
              "Browser history management using stacks",
            ],
            [
              "Case Study 3",
              "Network routing using graphs",
            ],
          ],
        },
      ],
    },

    15: {
      heading: "Laboratory & Experiments",
      sections: [
        {
          title: "Laboratory Experiments",
          items: [
            ["Experiment 1", "Array operations"],
            ["Experiment 2", "Singly linked list"],
            ["Experiment 3", "Stack implementation"],
            ["Experiment 4", "Queue implementation"],
            ["Experiment 5", "Binary search tree"],
            ["Experiment 6", "Tree traversal"],
            ["Experiment 7", "Graph traversal"],
            ["Experiment 8", "Searching algorithms"],
            ["Experiment 9", "Sorting algorithms"],
          ],
        },
      ],
    },
  };

  /* For other courses, automatically change course information */
  const data = common[moduleId];

  if (!data) {
    return {
      heading: "Course Information",
      sections: [],
    };
  }

  return data;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    semester: "",
    academicYear: "2026-27",
    department: "Computer Engineering",
    faculty: "",
  });

  /* =======================================================
     LOAD COURSES
  ======================================================= */

  useEffect(() => {
    const savedCourses = localStorage.getItem("nba_courses");

    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      setCourses(DEFAULT_COURSES);
      localStorage.setItem(
        "nba_courses",
        JSON.stringify(DEFAULT_COURSES)
      );
    }
  }, []);

  /* =======================================================
     SAVE COURSES
  ======================================================= */

  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem("nba_courses", JSON.stringify(courses));
    }
  }, [courses]);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     ADD COURSE
  ======================================================= */

  const handleAddCourse = (e) => {
    e.preventDefault();

    if (
      !formData.courseCode.trim() ||
      !formData.courseName.trim() ||
      !formData.semester.trim()
    ) {
      alert("Please fill Course Code, Course Name and Semester.");
      return;
    }

    const alreadyExists = courses.some(
      (course) =>
        course.courseCode.toLowerCase() ===
        formData.courseCode.toLowerCase()
    );

    if (alreadyExists) {
      alert("This Course Code already exists.");
      return;
    }

    const newCourse = {
      id: Date.now(),
      courseCode: formData.courseCode.trim(),
      courseName: formData.courseName.trim(),
      semester: formData.semester.trim(),
      academicYear: formData.academicYear,
      department: formData.department,
      faculty: formData.faculty.trim() || "Not Assigned",
    };

    const updatedCourses = [...courses, newCourse];

    setCourses(updatedCourses);

    setFormData({
      courseCode: "",
      courseName: "",
      semester: "",
      academicYear: "2026-27",
      department: "Computer Engineering",
      faculty: "",
    });

    setShowAddForm(false);

    alert("Course added successfully.");
  };

  /* =======================================================
     OPEN COURSE
  ======================================================= */

  const openCourse = (course) => {
    setSelectedCourse(course);
    setSelectedModule(null);
  };

  /* =======================================================
     BACK TO COURSES
  ======================================================= */

  const backToCourses = () => {
    setSelectedCourse(null);
    setSelectedModule(null);
  };

  /* =======================================================
     OPEN MODULE
  ======================================================= */

  const openModule = (module) => {
    setSelectedModule(module);
  };

  /* =======================================================
     BACK TO MODULES
  ======================================================= */

  const backToModules = () => {
    setSelectedModule(null);
  };

  /* =======================================================
     DELETE COURSE
  ======================================================= */

  const deleteCourse = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    const updatedCourses = courses.filter(
      (course) => course.id !== id
    );

    setCourses(updatedCourses);

    if (updatedCourses.length === 0) {
      localStorage.removeItem("nba_courses");
    }
  };

  /* =======================================================
     MODULE DETAIL PAGE
  ======================================================= */

  if (selectedCourse && selectedModule) {
    const moduleData = getModuleData(
      selectedCourse,
      selectedModule.id
    );

    return (
      <div className="courses-page">

        {/* HEADER */}
        <div className="nba-header">
          <div className="header-menu">☰</div>

          <div className="header-title">
            NBA Accreditation Management System
          </div>

          <div className="header-bell">🔔</div>

          <div className="profile-circle">S</div>
        </div>

        {/* DETAIL CONTENT */}
        <div className="detail-container">

          <button
            className="back-button"
            onClick={backToModules}
          >
            ← Back
          </button>

          <div className="course-detail-heading">
            <div>
              <h1>{moduleData.heading}</h1>

              <p>
                <strong>{selectedCourse.courseCode}</strong>
                {" - "}
                {selectedCourse.courseName}
              </p>
            </div>
          </div>

          <div className="course-info-strip">
            <div>
              <span>Course Code</span>
              <strong>{selectedCourse.courseCode}</strong>
            </div>

            <div>
              <span>Course Name</span>
              <strong>{selectedCourse.courseName}</strong>
            </div>

            <div>
              <span>Semester</span>
              <strong>{selectedCourse.semester}</strong>
            </div>

            <div>
              <span>Academic Year</span>
              <strong>{selectedCourse.academicYear}</strong>
            </div>
          </div>

          {moduleData.sections.map((section, index) => (
            <div className="information-card" key={index}>

              <div className="information-card-header">
                <h2>{section.title}</h2>
              </div>

              <div className="information-list">

                {section.items.map((item, itemIndex) => (
                  <div
                    className="information-row"
                    key={itemIndex}
                  >
                    <div className="information-label">
                      {item[0]}
                    </div>

                    <div className="information-value">
                      {item[1]}
                    </div>
                  </div>
                ))}

              </div>
            </div>
          ))}

          <div className="detail-actions">
            <button
              className="print-button"
              onClick={() => window.print()}
            >
              🖨 Print
            </button>

            <button
              className="back-module-button"
              onClick={backToModules}
            >
              ← Back to Modules
            </button>
          </div>

        </div>
      </div>
    );
  }

  /* =======================================================
     COURSE MODULE PAGE
  ======================================================= */

  if (selectedCourse) {
    return (
      <div className="courses-page">

        {/* HEADER */}
        <div className="nba-header">
          <div className="header-menu">☰</div>

          <div className="header-title">
            NBA Accreditation Management System
          </div>

          <div className="header-bell">🔔</div>

          <div className="profile-circle">S</div>
        </div>

        {/* COURSE TITLE */}
        <div className="specialized-header">

          <button
            className="back-button"
            onClick={backToCourses}
          >
            ← Back to Courses
          </button>

          <div>
            <h1>
              {selectedCourse.courseCode} -{" "}
              {selectedCourse.courseName}
            </h1>

            <p>
              Specialized Course Modules
            </p>
          </div>
        </div>

        {/* COURSE BASIC INFORMATION */}
        <div className="selected-course-info">

          <div className="selected-info-box">
            <span>Course Code</span>
            <strong>{selectedCourse.courseCode}</strong>
          </div>

          <div className="selected-info-box">
            <span>Course Name</span>
            <strong>{selectedCourse.courseName}</strong>
          </div>

          <div className="selected-info-box">
            <span>Semester</span>
            <strong>{selectedCourse.semester}</strong>
          </div>

          <div className="selected-info-box">
            <span>Faculty</span>
            <strong>{selectedCourse.faculty}</strong>
          </div>

        </div>

        {/* SPECIALIZED MODULES */}
        <div className="modules-container">

          <div className="modules-title">
            <h2>Specialized Modules</h2>

            <p>
              Click any card to view {selectedCourse.courseName} related
              information.
            </p>
          </div>

          <div className="modules-grid">

            {MODULES.map((module) => (
             <div
  className={`module-card ${module.className}`}
  key={module.id}
  onClick={() => {
    if (module.id === 1) {
      navigate("/course-syllabus");
    } else {
      openModule(module);
    }
  }}
>

                <div className="module-icon">
                  {module.icon}
                </div>

                <div className="module-content">

                  <h3>
                    {module.id}. {module.title}
                  </h3>

                  <p>
                    ● Completed
                  </p>

                  <span className="module-description">
                    {module.description}
                  </span>

                </div>

                <div className="module-arrow">
                  →
                </div>

              </div>
            ))}

          </div>

          {/* REPORT */}
          <div className="report-card">

            <div className="report-icon">
              ▤
            </div>

            <h2>
              Generate Complete
              <br />
              Course Evidence Report
            </h2>

            <p>
              Create a single report with all verified evidence.
            </p>

            <button
              className="generate-report-button"
              onClick={() => {
                alert(
                  `Complete Course Evidence Report generated for ${selectedCourse.courseName}`
                );
              }}
            >
              Generate Report
            </button>

          </div>

        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN COURSES PAGE
  ======================================================= */

  return (
    <div className="courses-page">

      {/* HEADER */}
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

      {/* PAGE TITLE */}
      <div className="courses-heading">

        <h1>
          Courses
        </h1>

        <button
          className="add-course-button"
          onClick={() => setShowAddForm(true)}
        >
          + Add Course
        </button>

      </div>

      {/* ADD COURSE FORM */}
      {showAddForm && (
        <div className="form-overlay">

          <div className="add-course-modal">

            <div className="modal-header">
              <div>
                <h2>
                  Add New Course
                </h2>

                <p>
                  Enter course information
                </p>
              </div>

              <button
                className="close-modal"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCourse}>

              <div className="form-grid">

                <div className="form-group">
                  <label>
                    Course Code *
                  </label>

                  <input
                    type="text"
                    name="courseCode"
                    placeholder="e.g. CS303"
                    value={formData.courseCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Course Name *
                  </label>

                  <input
                    type="text"
                    name="courseName"
                    placeholder="e.g. Operating Systems"
                    value={formData.courseName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Semester *
                  </label>

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Semester
                    </option>

                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                    <option value="VI">VI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Academic Year
                  </label>

                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                  >
                    <option value="2026-27">
                      2026-27
                    </option>

                    <option value="2025-26">
                      2025-26
                    </option>

                    <option value="2027-28">
                      2027-28
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Department
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="Computer Engineering">
                      Computer Engineering
                    </option>

                    <option value="Information Technology">
                      Information Technology
                    </option>

                    <option value="Electronics Engineering">
                      Electronics Engineering
                    </option>

                    <option value="Mechanical Engineering">
                      Mechanical Engineering
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Faculty
                  </label>

                  <input
                    type="text"
                    name="faculty"
                    placeholder="Faculty Name"
                    value={formData.faculty}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-course-button"
                >
                  Save Course
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* COURSE TABLE */}
      <div className="course-table-card">

        <div className="course-table-wrapper">

          <table className="course-table">

            <thead>
              <tr>
                <th>
                  Course Code
                </th>

                <th>
                  Course Name
                </th>

                <th>
                  Semester
                </th>

                <th>
                  Academic Year
                </th>

                <th>
                  Department
                </th>

                <th>
                  Faculty
                </th>

                <th>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {courses.map((course) => (

                <tr key={course.id}>

                  <td>
                    <span className="course-code">
                      {course.courseCode}
                    </span>
                  </td>

                  <td>

                    <button
                      className="course-name-link"
                      onClick={() => openCourse(course)}
                    >
                      {course.courseName}
                    </button>

                  </td>

                  <td>
                    {course.semester}
                  </td>

                  <td>
                    {course.academicYear}
                  </td>

                  <td>
                    {course.department}
                  </td>

                  <td>
                    {course.faculty}
                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="open-button"
                        onClick={() => openCourse(course)}
                      >
                        Open
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteCourse(course.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {courses.length === 0 && (
          <div className="empty-course">
            No courses available.
          </div>
        )}

      </div>

    </div>
  );
}

export default Courses;