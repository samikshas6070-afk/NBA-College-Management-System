import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NBASidebar from "../Pages/NBASidebar";
import "./CourseOutcomeAttainment.css";
import axios from "axios";

import {
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTrash,
  FaPrint,
  FaPlus,
  FaCheckCircle,
  FaBroom,
  FaUpload,
  FaEye,
  FaDownload,
  FaEdit,
} from "react-icons/fa";

/*
=========================================================
NBA 3.7.2
RECORD THE ATTAINMENT OF COURSE OUTCOMES OF ALL COURSES
WITH RESPECT TO SET ATTAINMENT LEVELS

Evaluation:
1. Methodology to define set levels and its compliance
2. Data collection
3. Verification
4. Analysis
5. Decision making
6. Details for one course per year of study to be verified
7. Supporting evidence
8. Action taken / improvement evidence
=========================================================
*/

const STORAGE_KEY = "nba_3_7_2_course_outcome_attainment";

const YEAR_OPTIONS = [
  "First Year",
  "Second Year",
  "Third Year",
  "Final Year",
];

const SEMESTER_OPTIONS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
];

/* =========================================================
   INITIAL COURSE
========================================================= */

const getInitialCourse = () => ({
  academicYear: "2025-26",
  department: "Computer Engineering",
  yearOfStudy: "Final Year",
  semester: "VI",
  courseCode: "",
  courseName: "",
  faculty: "",
});

/* =========================================================
   INITIAL CO DATA
========================================================= */

const getInitialCOs = () =>
  [1, 2, 3, 4, 5].map((n) => ({
    co: `CO${n}`,

    // Approved CO attainment level
    setLevel: 3,

    // Minimum percentage of students expected
    // to attain the prescribed threshold
    benchmark: 80,

    // Minimum marks percentage required
    // for a student to be counted as attaining
    threshold: 60,

    // CIE
    cieTotalStudents: "",
    cieAchievedStudents: "",

    // SEE
    seeTotalStudents: "",
    seeAchievedStudents: "",

    // Internal assessment evidence
    unitTest: "",
    assignment: "",
    midTerm: "",
    laboratory: "",

    // Improvement / re-attainment
    improvementBefore: "",
    improvementAfter: "",
  }));

/* =========================================================
   INDIRECT
========================================================= */

const getInitialIndirect = () =>
  [1, 2, 3, 4, 5].map((n) => ({
    co: `CO${n}`,
    courseExitSurvey: "",
    studentFeedback: "",
    alumniFeedback: "",
    employerFeedback: "",
  }));

/* =========================================================
   DOCUMENTS
========================================================= */

const getInitialDocuments = () => [
  {
    id: 1,
    name: "CO Attainment Record / Excel",
    file: null,
    fileName: "",
    status: "Pending",
  },
  {
    id: 2,
    name: "CIE / Internal Assessment Record",
    file: null,
    fileName: "",
    status: "Pending",
  },
  {
    id: 3,
    name: "SEE CO-wise Analysis",
    file: null,
    fileName: "",
    status: "Pending",
  },
  {
    id: 4,
    name: "CO Benchmark / Target Sheet",
    file: null,
    fileName: "",
    status: "Pending",
  },
  {
    id: 5,
    name: "CO-PO / PSO Mapping Sheet",
    file: null,
    fileName: "",
    status: "Pending",
  },
  {
    id: 6,
    name: "Course-wise CO Attainment Report",
    file: null,
    fileName: "",
    status: "Pending",
  },
  {
    id: 7,
    name: "Verification / Approval Report",
    file: null,
    fileName: "",
    status: "Pending",
  },
  {
    id: 8,
    name: "Action Taken / Improvement Evidence",
    file: null,
    fileName: "",
    status: "Pending",
  },
];

/* =========================================================
   APPROVAL
========================================================= */

const getInitialApproval = () => ({
  teacher: {
    name: "",
    designation: "Course Teacher",
    status: "Pending",
    date: "",
  },

  coordinator: {
    name: "",
    designation: "Course Coordinator",
    status: "Pending",
    date: "",
  },

  hod: {
    name: "",
    designation: "Head of Department",
    status: "Pending",
    date: "",
  },

  iqac: {
    name: "",
    designation: "IQAC Coordinator",
    status: "Pending",
    date: "",
  },
});

/* =========================================================
   METHODOLOGY
========================================================= */

const getInitialMethodology = () => ({
  cieWeight: 50,
  seeWeight: 50,

  indirectEnabled: false,
  indirectWeight: 0,

  description:
    "CO attainment is determined using a benchmark-based methodology. For each CO, the number of students achieving the prescribed marks threshold is identified from CIE and SEE assessment records. Actual attainment percentage is calculated as the number of students achieving the prescribed threshold divided by the total number of students multiplied by 100. The attainment percentage is mapped to the approved Level 1, Level 2 and Level 3 bands and compared with the CO-wise benchmark and set attainment level.",

  basis:
    "The set attainment level, benchmark and marks threshold are defined before assessment. A student is counted as attaining a CO when the student achieves the prescribed marks threshold. CO attainment percentage is calculated as (students achieving threshold / total students) × 100.",

  compliance:
    "The approved methodology is applied consistently to CIE and SEE data. Assessment records are collected, threshold-achieving students are verified, attainment percentages are calculated, attainment levels are determined using approved benchmark bands, results are analysed and corrective/improvement actions are recorded for non-achieved COs.",

  level1Benchmark: 60,
  level2Benchmark: 70,
  level3Benchmark: 80,

  level1Text:
    "Level 1: Minimum 60% students achieving the prescribed marks threshold.",

  level2Text:
    "Level 2: Minimum 70% students achieving the prescribed marks threshold.",

  level3Text:
    "Level 3: Minimum 80% students achieving the prescribed marks threshold.",
});

/* =========================================================
   MAIN COMPONENT
========================================================= */

function CourseOutcomeAttainment() {
  const navigate = useNavigate();

  const [course, setCourse] = useState(getInitialCourse());
  const [editing, setEditing] = useState(true);

  const [coData, setCoData] = useState(getInitialCOs());
  const [indirectData, setIndirectData] =
    useState(getInitialIndirect());

  const [courseRecords, setCourseRecords] = useState([]);

  const [methodology, setMethodology] =
    useState(getInitialMethodology());

  const [remarks, setRemarks] = useState("");
  const [verificationRemarks, setVerificationRemarks] =
    useState("");
  const [decisionRemarks, setDecisionRemarks] =
    useState("");

  const [decisions, setDecisions] = useState({
    remedial: false,
    assignment: false,
    expert: false,
    quiz: false,
    laboratory: false,
    mentoring: false,
  });

  const [actions, setActions] = useState({
    remedial: "Pending",
    assignment: "Pending",
    quiz: "Pending",
    expert: "Pending",
    laboratory: "Pending",
    mentoring: "Pending",
  });

  const [hod, setHod] = useState({
    faculty: "",
    approval: "",
    date: "",
  });

  const [approval, setApproval] =
    useState(getInitialApproval());

  const [documents, setDocuments] =
    useState(getInitialDocuments());

  // Keeps one native file input available so the Upload button
  // remains clickable even when CSS hides the input element.
  const fileInputRef = useRef(null);
  const [uploadingDocumentId, setUploadingDocumentId] = useState(null);

  const [verificationRecords, setVerificationRecords] =
    useState({});

  const [message, setMessage] = useState("");

  /* =========================================================
     HELPERS
  ========================================================= */

  const toNumber = (value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
  };

  const clampPercentage = (value) => {
    if (value === "") return "";

    const number = Number(value);

    if (!Number.isFinite(number)) return "";

    return Math.max(0, Math.min(100, number));
  };

  const clampStudents = (value) => {
    if (value === "") return "";

    const number = Number(value);

    if (!Number.isFinite(number)) return "";

    return Math.max(0, Math.floor(number));
  };

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  /* =========================================================
     COURSE UPDATE
  ========================================================= */

  const updateCourse = (field, value) => {
    setCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================================
     CO UPDATE
  ========================================================= */

  const updateCO = (index, field, value) => {
    setCoData((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        let updatedValue = value;

        if (
          field === "cieTotalStudents" ||
          field === "cieAchievedStudents" ||
          field === "seeTotalStudents" ||
          field === "seeAchievedStudents"
        ) {
          updatedValue = clampStudents(value);
        }

        if (
          field === "benchmark" ||
          field === "threshold" ||
          field === "unitTest" ||
          field === "assignment" ||
          field === "midTerm" ||
          field === "laboratory" ||
          field === "improvementBefore" ||
          field === "improvementAfter"
        ) {
          updatedValue = clampPercentage(value);
        }

        if (field === "setLevel") {
          updatedValue = Number(value);
        }

        return {
          ...row,
          [field]: updatedValue,
        };
      })
    );
  };

  /* =========================================================
     INDIRECT UPDATE
  ========================================================= */

  const updateIndirect = (index, field, value) => {
    setIndirectData((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: clampPercentage(value),
            }
          : row
      )
    );
  };

  /* =========================================================
     METHODOLOGY UPDATE
  ========================================================= */

  const updateMethodology = (field, value) => {
    setMethodology((prev) => ({
      ...prev,
      [field]:
        typeof value === "number"
          ? Math.max(0, Math.min(100, value))
          : value,
    }));
  };

  /* =========================================================
     WEIGHTAGE
  ========================================================= */

  const directWeightTotal =
    Number(methodology.cieWeight || 0) +
    Number(methodology.seeWeight || 0);

  const overallWeightTotal = methodology.indirectEnabled
    ? directWeightTotal +
      Number(methodology.indirectWeight || 0)
    : directWeightTotal;

  const methodologyValid = methodology.indirectEnabled
    ? overallWeightTotal === 100
    : directWeightTotal === 100;

  /* =========================================================
     BENCHMARK VALIDATION
  ========================================================= */

  const benchmarkBandsValid =
    Number(methodology.level1Benchmark) >= 0 &&
    Number(methodology.level1Benchmark) <= 100 &&
    Number(methodology.level2Benchmark) >= 0 &&
    Number(methodology.level2Benchmark) <= 100 &&
    Number(methodology.level3Benchmark) >= 0 &&
    Number(methodology.level3Benchmark) <= 100 &&
    Number(methodology.level1Benchmark) <
      Number(methodology.level2Benchmark) &&
    Number(methodology.level2Benchmark) <
      Number(methodology.level3Benchmark);

  /* =========================================================
     CO METHODOLOGY VALIDATION
  ========================================================= */

  const coMethodologyValid = coData.every((row) => {
    const setLevel = toNumber(row.setLevel);
    const benchmark = toNumber(row.benchmark);
    const threshold = toNumber(row.threshold);

    return (
      setLevel !== null &&
      [1, 2, 3].includes(setLevel) &&
      benchmark !== null &&
      benchmark >= 0 &&
      benchmark <= 100 &&
      threshold !== null &&
      threshold >= 0 &&
      threshold <= 100
    );
  });

  const completeMethodologyValid =
    methodologyValid &&
    benchmarkBandsValid &&
    coMethodologyValid;

  /* =========================================================
     PERCENTAGE → LEVEL
  ========================================================= */

  const percentageToLevel = (percentage) => {
    const value = toNumber(percentage);

    if (value === null) return null;

    if (
      value >= Number(methodology.level3Benchmark)
    ) {
      return 3;
    }

    if (
      value >= Number(methodology.level2Benchmark)
    ) {
      return 2;
    }

    if (
      value >= Number(methodology.level1Benchmark)
    ) {
      return 1;
    }

    return 0;
  };

  /* =========================================================
     STUDENT ATTAINMENT %
  ========================================================= */

  const calculateStudentPercentage = (
    achieved,
    total
  ) => {
    const achievedNumber = toNumber(achieved);
    const totalNumber = toNumber(total);

    if (
      achievedNumber === null ||
      totalNumber === null ||
      totalNumber <= 0
    ) {
      return null;
    }

    if (
      achievedNumber < 0 ||
      achievedNumber > totalNumber
    ) {
      return null;
    }

    return (achievedNumber / totalNumber) * 100;
  };

  /* =========================================================
     CO-WISE CALCULATION

     IMPORTANT:
     Threshold is applied at data-entry level:
     cieAchievedStudents / seeAchievedStudents
     must represent students achieving >= threshold.
  ========================================================= */

  const calculatedCO = useMemo(() => {
    return coData.map((row, index) => {
      const cieActual = calculateStudentPercentage(
        row.cieAchievedStudents,
        row.cieTotalStudents
      );

      const seeActual = calculateStudentPercentage(
        row.seeAchievedStudents,
        row.seeTotalStudents
      );

      const cieLevel = percentageToLevel(cieActual);
      const seeLevel = percentageToLevel(seeActual);
      /* =====================================================
         DIRECT ATTAINMENT PERCENTAGE

         Weighted CIE + SEE actual percentage
      ===================================================== */

      let directAttainmentPercentage = null;

      if (
        cieActual !== null &&
        seeActual !== null &&
        directWeightTotal > 0
      ) {
        directAttainmentPercentage =
          (cieActual *
            Number(methodology.cieWeight) +
            seeActual *
              Number(methodology.seeWeight)) /
          directWeightTotal;
      }

      /* =====================================================
         DIRECT LEVEL
      ===================================================== */

      let directLevel = null;

      if (
        cieLevel !== null &&
        seeLevel !== null &&
        directWeightTotal > 0
      ) {
        directLevel =
          (cieLevel *
            Number(methodology.cieWeight) +
            seeLevel *
              Number(methodology.seeWeight)) /
          directWeightTotal;
      }

      /* =====================================================
         INDIRECT
      ===================================================== */

      const indirect = indirectData[index];

      const indirectValues = [
        indirect?.courseExitSurvey,
        indirect?.studentFeedback,
        indirect?.alumniFeedback,
        indirect?.employerFeedback,
      ];

      const indirectComplete = indirectValues.every(
        (value) => toNumber(value) !== null
      );

      let indirectPercentage = null;
      let indirectLevel = null;

      if (
        methodology.indirectEnabled &&
        indirectComplete
      ) {
        indirectPercentage =
          indirectValues.reduce(
            (sum, value) => sum + Number(value),
            0
          ) / indirectValues.length;

        indirectLevel =
          percentageToLevel(indirectPercentage);
      }

      /* =====================================================
         FINAL ATTAINMENT %

         Direct + Indirect weighted percentage
      ===================================================== */

      let finalAttainmentPercentage = null;

      if (methodology.indirectEnabled) {
        if (
          directAttainmentPercentage !== null &&
          indirectPercentage !== null &&
          overallWeightTotal === 100
        ) {
          finalAttainmentPercentage =
            (directAttainmentPercentage *
              directWeightTotal +
              indirectPercentage *
                Number(methodology.indirectWeight)) /
            100;
        }
      } else {
        finalAttainmentPercentage =
          directAttainmentPercentage;
      }

      /* =====================================================
         FINAL LEVEL
      ===================================================== */

      const finalLevel =
        finalAttainmentPercentage === null
          ? null
          : percentageToLevel(
              finalAttainmentPercentage
            );

      /* =====================================================
         BENCHMARK
      ===================================================== */

      const benchmark = toNumber(row.benchmark);

      const benchmarkMet =
        finalAttainmentPercentage !== null &&
        benchmark !== null &&
        finalAttainmentPercentage >= benchmark;

      /* =====================================================
         SET LEVEL
      ===================================================== */

      const setLevel = toNumber(row.setLevel);

      const levelMet =
        finalLevel !== null &&
        setLevel !== null &&
        finalLevel >= setLevel;

      /* =====================================================
         DATA COMPLETENESS
      ===================================================== */

      const dataPending =
        cieActual === null ||
        seeActual === null ||
        (methodology.indirectEnabled &&
          !indirectComplete);

      /* =====================================================
         IMPROVEMENT
      ===================================================== */

      const improvementBefore =
        toNumber(row.improvementBefore);

      const improvementAfter =
        toNumber(row.improvementAfter);

      const improvementRecorded =
        improvementBefore !== null &&
        improvementAfter !== null;

      const improvement =
        improvementRecorded
          ? improvementAfter - improvementBefore
          : null;

      /* =====================================================
         STATUS
      ===================================================== */

      let status = "Data Pending";

      if (
        !dataPending &&
        finalAttainmentPercentage !== null
      ) {
        status =
          benchmarkMet && levelMet
            ? "Achieved"
            : "Not Achieved";
      }

      return {
        ...row,

        cieActual,
        seeActual,

        cieLevel,
        seeLevel,

        directAttainmentPercentage,
        directLevel,

        indirectPercentage,
        indirectLevel,

        finalAttainmentPercentage,
        finalLevel,

        benchmark,
        benchmarkMet,
        levelMet,

        dataPending,

        improvementBefore,
        improvementAfter,
        improvement,
        improvementRecorded,

        status,

        index,
      };
    });
  }, [
    coData,
    indirectData,
    methodology,
    directWeightTotal,
    overallWeightTotal,
  ]);

  /* =========================================================
     CURRENT SUMMARY
  ========================================================= */

  const completedCO = calculatedCO.filter(
    (row) => row.status !== "Data Pending"
  );

  const achievedCO = calculatedCO.filter(
    (row) => row.status === "Achieved"
  );

  const notAchievedCO = calculatedCO.filter(
    (row) => row.status === "Not Achieved"
  );

  const pendingCO = calculatedCO.filter(
    (row) => row.status === "Data Pending"
  );

  const averageAttainment =
    completedCO.length > 0
      ? (
          completedCO.reduce(
            (sum, row) =>
              sum +
              Number(
                row.finalAttainmentPercentage || 0
              ),
            0
          ) / completedCO.length
        ).toFixed(2)
      : "—";

  const averageLevel =
    completedCO.length > 0
      ? (
          completedCO.reduce(
            (sum, row) =>
              sum + Number(row.finalLevel || 0),
            0
          ) / completedCO.length
        ).toFixed(2)
      : "—";

  const achievementPercentage =
    completedCO.length > 0
      ? (
          (achievedCO.length /
            completedCO.length) *
          100
        ).toFixed(2)
      : "—";

  /* =========================================================
     CONSOLIDATED RECORDS
  ========================================================= */

  const consolidatedRows = courseRecords.flatMap(
    (record) =>
      (record.coData || []).map((row) => ({
        ...row,

        recordId: record.id,
        courseCode: record.courseCode,
        courseName: record.courseName,
        academicYear: record.academicYear,
        department: record.department,
        yearOfStudy: record.yearOfStudy,
        semester: record.semester,
      }))
  );

  /* =========================================================
     YEAR-WISE SUMMARY
  ========================================================= */

  const yearWiseSummary = YEAR_OPTIONS.map((year) => {
    const records = courseRecords.filter(
      (record) => record.yearOfStudy === year
    );

    const verified = records.filter((record) => {
      if (!record.coData?.length) return false;

      return record.coData.every(
        (row) =>
          verificationRecords[
            `${record.id}-${row.co}`
          ] === "Verified"
      );
    });

    return {
      year,
      count: records.length,
      verified: verified.length,
    };
  });

  const yearWiseVerificationComplete =
    YEAR_OPTIONS.every((year) => {
      const records = courseRecords.filter(
        (record) => record.yearOfStudy === year
      );

      return records.some(
        (record) =>
          record.coData?.length > 0 &&
          record.coData.every(
            (row) =>
              verificationRecords[
                `${record.id}-${row.co}`
              ] === "Verified"
          )
      );
    });

  /* =========================================================
     LOAD STORAGE
  ========================================================= */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) return;

      const data = JSON.parse(saved);

      if (data.course) setCourse(data.course);

      if (Array.isArray(data.coData)) {
        setCoData(data.coData);
      }

      if (Array.isArray(data.indirectData)) {
        setIndirectData(data.indirectData);
      }

      if (Array.isArray(data.courseRecords)) {
        setCourseRecords(data.courseRecords);
      }

      if (data.methodology) {
        setMethodology(data.methodology);
      }

      if (data.remarks !== undefined) {
        setRemarks(data.remarks);
      }

      if (data.verificationRemarks !== undefined) {
        setVerificationRemarks(
          data.verificationRemarks
        );
      }

      if (data.decisionRemarks !== undefined) {
        setDecisionRemarks(data.decisionRemarks);
      }

      if (data.decisions) {
        setDecisions(data.decisions);
      }

      if (data.actions) {
        setActions(data.actions);
      }

      if (data.hod) {
        setHod(data.hod);
      }

      if (data.approval) {
        setApproval(data.approval);
      }

      if (data.verificationRecords) {
        setVerificationRecords(
          data.verificationRecords
        );
      }

      if (Array.isArray(data.documents)) {
        setDocuments((prev) =>
          prev.map((item) => {
            const savedDoc =
              data.documents.find(
                (doc) => doc.id === item.id
              );

            return savedDoc
              ? {
                  ...item,
                  fileName:
                    savedDoc.fileName || "",
                  status:
                    savedDoc.status || "Pending",
                }
              : item;
          })
        );
      }
    } catch (error) {
      console.error(
        "3.7.2 load error:",
        error
      );
    }
  }, []);

  
/* =========================================================
   SESSION ID
========================================================= */
const sessionId =
  sessionStorage.getItem("criteria3_session_id") || "";


/* =========================================================
   SAVE
========================================================= */
const handleSave = async () => {

  try {

    console.log(
      "===================================="
    );

    console.log(
      "STARTING CRITERIA 3.7.2 SAVE"
    );

    console.log(
      "SESSION ID:",
      sessionId
    );

    console.log(
      "===================================="
    );


    const payload = {

      session_id: sessionId,

      course: course,

      coData: coData,

      indirectData: indirectData,

      courseRecords: courseRecords,

      methodology: methodology,

      remarks: remarks,

      verificationRemarks:
        verificationRemarks,

      decisionRemarks:
        decisionRemarks,

      decisions: decisions,

      actions: actions,

      hod: hod,

      approval: approval,

      verificationRecords:
        verificationRecords,

      averageAttainment:
        averageAttainment,

      averageLevel:
        averageLevel,

      achievementPercentage:
        achievementPercentage,

      isSubmitted: false,

    };

    console.log(
      "CRITERIA 3.7.2 PAYLOAD:",
      payload
    );


    const response =
      await axios.post(

        "http://localhost:5000/criteria3/3.7.2/save",

        payload

      );


    console.log(
      "DATABASE RESPONSE:",
      response.data
    );


    if (response.data.success) {

      // ----------------------------------
      // SUCCESS MESSAGE
      // ----------------------------------

      showMessage(
        "✅ Criteria 3.7.2 data successfully saved in PostgreSQL database."
      );


      // ----------------------------------
      // ALSO SAVE LOCAL BACKUP
      // ----------------------------------

      localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify({
          ...payload,
          savedAt:
            new Date().toISOString(),
        })

      );


      alert(
        "Criteria 3.7.2 data saved successfully in database."
      );


    } else {

      showMessage(
        "❌ " +
        (
          response.data.message ||
          "Data could not be saved."
        )
      );


      alert(
        response.data.message ||
        "Data could not be saved."
      );

    }


  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "CRITERIA 3.7.2 SAVE ERROR:"
    );

    console.error(error);

    console.error(
      "===================================="
    );


    const errorMessage =

      error.response?.data?.message ||

      error.response?.data?.error ||

      error.message ||

      "Database connection failed.";


    console.error(
      "ERROR MESSAGE:",
      errorMessage
    );


    showMessage(
      "❌ Save Failed: " +
      errorMessage
    );


    alert(
      "Save Failed!\n\n" +
      errorMessage
    );

  }

};

  /* =========================================================
     ADD / UPDATE COURSE
  ========================================================= */

  const handleAddCourse = () => {
    if (!course.academicYear.trim()) {
      alert("Please enter Academic Year.");
      return;
    }

    if (!course.department.trim()) {
      alert("Please enter Department.");
      return;
    }

    if (!course.yearOfStudy) {
      alert("Please select Year of Study.");
      return;
    }

    if (!course.semester) {
      alert("Please select Semester.");
      return;
    }

    if (!course.courseCode.trim()) {
      alert("Please enter Course Code.");
      return;
    }

    if (!course.courseName.trim()) {
      alert("Please enter Course Name.");
      return;
    }

    if (!completeMethodologyValid) {
      alert(
        "Please complete approved methodology, benchmark bands and CO-wise set levels."
      );
      return;
    }

    if (pendingCO.length > 0) {
      alert(
        "Please complete CIE and SEE data for all COs."
      );
      return;
    }

    if (
      calculatedCO.some(
        (row) => row.finalAttainmentPercentage === null
      )
    ) {
      alert(
        "Final attainment percentage could not be calculated for all COs."
      );
      return;
    }

    if (
      methodology.indirectEnabled &&
      calculatedCO.some(
        (row) => row.indirectLevel === null
      )
    ) {
      alert(
        "Please complete indirect assessment data for all COs."
      );
      return;
    }

    const record = {
      id: Date.now(),

      ...course,

      methodology: {
        ...methodology,
      },

      coData: calculatedCO.map((row) => ({
        co: row.co,

        setLevel: row.setLevel,
        benchmark: row.benchmark,
        threshold: row.threshold,

        cieTotalStudents:
          row.cieTotalStudents,

        cieAchievedStudents:
          row.cieAchievedStudents,

        seeTotalStudents:
          row.seeTotalStudents,

        seeAchievedStudents:
          row.seeAchievedStudents,

        cieActual: row.cieActual,
        seeActual: row.seeActual,

        cieLevel: row.cieLevel,
        seeLevel: row.seeLevel,

        directAttainmentPercentage:
          row.directAttainmentPercentage,

        directLevel: row.directLevel,

        indirectPercentage:
          row.indirectPercentage,

        indirectLevel:
          row.indirectLevel,finalAttainmentPercentage:
          row.finalAttainmentPercentage,

        finalLevel: row.finalLevel,

        benchmarkMet:
          row.benchmarkMet,

        levelMet:
          row.levelMet,

        status: row.status,

        improvementBefore:
          row.improvementBefore,

        improvementAfter:
          row.improvementAfter,

        improvement:
          row.improvement,

        improvementRecorded:
          row.improvementRecorded,
      })),

      averageAttainment,
      averageLevel,
      achievementPercentage,

      remarks,
      verificationRemarks,
      decisionRemarks,

      decisions: {
        ...decisions,
      },

      actions: {
        ...actions,
      },

      savedAt:
        new Date().toISOString(),
    };

    setCourseRecords((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.courseCode === course.courseCode &&
          item.academicYear === course.academicYear
      );

      if (existingIndex === -1) {
        return [...prev, record];
      }

      const updated = [...prev];

      /*
       * Preserve existing verification records
       * only if course is being updated.
       */
      const oldRecord = updated[existingIndex];

      if (oldRecord?.id) {
        record.id = oldRecord.id;
      }

      updated[existingIndex] = record;

      return updated;
    });

    showMessage(
      "Course record added / updated successfully."
    );
  };

  /* =========================================================
     DELETE COURSE
  ========================================================= */

  const handleDeleteCourseRecord = (recordId) => {
    const confirmed = window.confirm(
      "Delete this course record?"
    );

    if (!confirmed) return;

    setCourseRecords((prev) =>
      prev.filter(
        (record) => record.id !== recordId
      )
    );

    setVerificationRecords((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((key) => {
        if (key.startsWith(`${recordId}-`)) {
          delete updated[key];
        }
      });

      return updated;
    });

    showMessage(
      "Course record deleted."
    );
  };

  /* =========================================================
     DELETE CURRENT COURSE
  ========================================================= */

  const handleDeleteCurrent = () => {
    if (!course.courseCode.trim()) {
      alert("Enter Course Code first.");
      return;
    }

    const record = courseRecords.find(
      (item) =>
        item.courseCode === course.courseCode &&
        item.academicYear === course.academicYear
    );

    if (!record) {
      alert(
        "No saved record found for this course."
      );
      return;
    }

    handleDeleteCourseRecord(record.id);
  };

  /* =========================================================
     CLEAR CURRENT
  ========================================================= */

  const handleClear = () => {
    const confirmed = window.confirm(
      "Clear current course data?"
    );

    if (!confirmed) return;

    setCoData(getInitialCOs());
    setIndirectData(getInitialIndirect());

    setRemarks("");
    setVerificationRemarks("");
    setDecisionRemarks("");

    setDecisions({
      remedial: false,
      assignment: false,
      expert: false,
      quiz: false,
      laboratory: false,
      mentoring: false,
    });

    setActions({
      remedial: "Pending",
      assignment: "Pending",
      quiz: "Pending",
      expert: "Pending",
      laboratory: "Pending",
      mentoring: "Pending",
    });

    setApproval(getInitialApproval());

    setHod({
      faculty: "",
      approval: "",
      date: "",
    });

    setDocuments(getInitialDocuments());

    showMessage(
      "Current course data cleared."
    );
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleResetPage = () => {
    const confirmed = window.confirm(
      "Reset all 3.7.2 page data?"
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);

    setCourse(getInitialCourse());
    setCoData(getInitialCOs());
    setIndirectData(getInitialIndirect());

    setCourseRecords([]);

    setMethodology(
      getInitialMethodology()
    );

    setRemarks("");
    setVerificationRemarks("");
    setDecisionRemarks("");

    setDecisions({
      remedial: false,
      assignment: false,
      expert: false,
      quiz: false,
      laboratory: false,
      mentoring: false,
    });

    setActions({
      remedial: "Pending",
      assignment: "Pending",
      quiz: "Pending",
      expert: "Pending",
      laboratory: "Pending",
      mentoring: "Pending",
    });

    setHod({
      faculty: "",
      approval: "",
      date: "",
    });

    setApproval(
      getInitialApproval()
    );

    setVerificationRecords({});
    setDocuments(getInitialDocuments());

    showMessage(
      "All 3.7.2 page data reset."
    );
  };

  /* =========================================================
     DOCUMENT UPLOAD
  ========================================================= */

  const handleUpload = (id, file) => {
    if (!file) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              file,
              fileName: file.name,
              status: "Selected",
            }
          : doc
      )
    );
  };

  const handleUploadClick = (id) => {
    setUploadingDocumentId(id);

    // Reset the input first so selecting the same file again
    // also triggers onChange.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleDocumentFileChange = (event) => {
    const file = event.target.files?.[0];

    if (uploadingDocumentId !== null && file) {
      handleUpload(uploadingDocumentId, file);
    }

    setUploadingDocumentId(null);
  };

  /* =========================================================
     DOCUMENT REMOVE
  ========================================================= */

  const handleRemoveDocument = (id) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              file: null,
              fileName: "",
              status: "Pending",
            }
          : doc
      )
    );
  };

  /* =========================================================
     DOCUMENT VIEW
  ========================================================= */

  const handleViewDocument = (document) => {
    if (!document.file) {
      alert("Please select a file first.");
      return;
    }

    const url = URL.createObjectURL(
      document.file
    );

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  };

  /* =========================================================
     DOCUMENT DOWNLOAD
  ========================================================= */

  const handleDownloadDocument = (document) => {
    if (!document.file) {
      alert("Please select a file first.");
      return;
    }

    const url = URL.createObjectURL(
      document.file
    );

    const anchor =
      window.document.createElement("a");

    anchor.href = url;

    anchor.download =
      document.fileName || "document";

    window.document.body.appendChild(anchor);

    anchor.click();

    window.document.body.removeChild(anchor);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  /* =========================================================
     APPROVAL UPDATE
  ========================================================= */

  const updateApproval = (
    role,
    field,
    value
  ) => {
    setApproval((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value,
      },
    }));
  };

  /* =========================================================
     VERIFICATION
  ========================================================= */

  const updateVerification = (
    row,
    status
  ) => {
    const key =
      `${row.recordId}-${row.co}`;

    setVerificationRecords((prev) => ({
      ...prev,
      [key]: status,
    }));
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = () => {
    window.print();
  };

  

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handlePrevious = () => {
    navigate(-1);
  };

  const handleNext = () => {
    navigate("/criteria/3.8");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="main-container">

      <NBASidebar />

      <div className="co-page">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="co-header">

          <div className="circle">
            <span>3.7.2</span>
          </div>

          <div>
            <h1>
              Course Outcome Attainment
            </h1>

            <p>
              Record the attainment of Course
              Outcomes of all courses with respect
              to set attainment levels.
            </p>
          </div>

        </div>

        {message && (
          <div className="save-status-message">
            <FaCheckCircle />
            {message}
          </div>
        )}

        {/* ===================================================
            COURSE INFORMATION
        =================================================== */}

        <div className="top-grid">

          <div className="card">

            <div className="card-title">

              <h3>
                Course Information
              </h3>

              <button
                type="button"
                className="edit-btn"
                onClick={() =>
                  setEditing((prev) => !prev)
                }
              >
                <FaEdit />
                {editing ? "Lock" : "Edit"}
              </button>

            </div>

            <table className="info-table">
              <tbody>

                <tr>
                  <td>Academic Year</td>
                  <td>
                    <input
                      type="text"
                      value={course.academicYear}
                      disabled={!editing}
                      onChange={(e) =>
                        updateCourse(
                          "academicYear",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>

                <tr>
                  <td>Department</td>
                  <td>
                    <input
                      type="text"
                      value={course.department}
                      disabled={!editing}
                      onChange={(e) =>
                        updateCourse(
                          "department",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>

                <tr>
                  <td>Year of Study</td>
                  <td>
                    <select
                      value={course.yearOfStudy}
                      disabled={!editing}
                      onChange={(e) =>
                        updateCourse(
                          "yearOfStudy",
                          e.target.value
                        )
                      }
                    >
                      {YEAR_OPTIONS.map((year) => (
                        <option
                          key={year}
                          value={year}
                        >
                          {year}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td>Semester</td>
                  <td>
                    <select
                      value={course.semester}
                      disabled={!editing}
                      onChange={(e) =>
                        updateCourse(
                          "semester",
                          e.target.value
                        )
                      }
                    >
                      {SEMESTER_OPTIONS.map(
                        (semester) => (
                          <option
                            key={semester}
                            value={semester}
                          >
                            {semester}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td>Course Code</td>
                  <td>
                    <input
                      type="text"
                      value={course.courseCode}
                      disabled={!editing}
                      onChange={(e) =>
                        updateCourse(
                          "courseCode",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>

                <tr>
                  <td>Course Name</td>
                  <td>
                    <input
                      type="text"
                      value={course.courseName}
                      disabled={!editing}
                      onChange={(e) =>
                        updateCourse(
                          "courseName",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>

                <tr>
                  <td>Faculty</td>
                  <td>
                    <input
                      type="text"
                      value={course.faculty}
                      disabled={!editing}
                      onChange={(e) =>
                        updateCourse(
                          "faculty",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
          {/* =================================================
              SET LEVEL
          ================================================= */}

          <div className="card">

            <h3 className="green-title">
              Set CO Attainment Levels
            </h3>

            <p className="section-note">
              Set Level, Benchmark and Marks
              Threshold must be defined before
              assessment.
            </p>

            <div className="table-responsive">

              <table className="benchmark-table">

                <thead>
                  <tr>
                    <th>CO</th>
                    <th>Set Level</th>
                    <th>Benchmark %</th>
                    <th>Marks Threshold %</th>
                  </tr>
                </thead>

                <tbody>

                  {coData.map((row, index) => (
                    <tr key={row.co}>

                      <td>
                        <b>{row.co}</b>
                      </td>

                      <td>
                        <select
                          value={row.setLevel}
                          onChange={(e) =>
                            updateCO(
                              index,
                              "setLevel",
                              Number(
                                e.target.value
                              )
                            )
                          }
                        >
                          <option value={1}>
                            Level 1
                          </option>
                          <option value={2}>
                            Level 2
                          </option>
                          <option value={3}>
                            Level 3
                          </option>
                        </select>
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.benchmark}
                          onChange={(e) =>
                            updateCO(
                              index,
                              "benchmark",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.threshold}
                          onChange={(e) =>
                            updateCO(
                              index,
                              "threshold",
                              e.target.value
                            )
                          }
                        />
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>

            </div>
          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="card">

            <h3 className="purple-title">
              Overall Summary
            </h3>

            <div className="summary-box">

              <div className="circle-summary">

                <h2>
                  {averageAttainment}
                </h2>

                <p>
                  Average Attainment %
                </p>

              </div>

              <div className="summary-data">

                <p>
                  Total CO:
                  <b>{coData.length}</b>
                </p>

                <p>
                  Achieved:
                  <b>{achievedCO.length}</b>
                </p>

                <p>
                  Not Achieved:
                  <b>{notAchievedCO.length}</b>
                </p>

                <p>
                  Pending:
                  <b>{pendingCO.length}</b>
                </p>

                <p>
                  Average Level:
                  <b>{averageLevel}</b>
                </p>

                <p>
                  Achievement %:
                  <b>
                    {achievementPercentage}
                    {achievementPercentage !==
                      "—" && "%"}
                  </b>
                </p>

                <p>
                  Courses Added:
                  <b>{courseRecords.length}</b>
                </p></div>
            </div>
          </div>

        </div>

        {/* ===================================================
            METHODOLOGY
        =================================================== */}

        <div className="card">

          <div className="benchmark-header">

            <h3 className="blue-title">
              Methodology to Define Set Levels
            </h3>

            <span className="benchmark-badge">
              NBA 3.7.2
            </span>

          </div>

          <div className="methodology-grid">

            <div className="method-box direct-box">

              <h4>
                Direct Assessment
              </h4>

              <label>
                CIE Weightage (%)

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={methodology.cieWeight}
                  onChange={(e) =>
                    updateMethodology(
                      "cieWeight",
                      Number(e.target.value)
                    )
                  }
                />
              </label>

              <label>
                SEE Weightage (%)

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={methodology.seeWeight}
                  onChange={(e) =>
                    updateMethodology(
                      "seeWeight",
                      Number(e.target.value)
                    )
                  }
                />
              </label>

              <strong>
                Direct Weightage:
                {" "}
                {directWeightTotal}%
              </strong>

            </div>

            <div className="method-box indirect-box">

              <h4>
                Indirect Assessment
              </h4>

              <label>

                <input
                  type="checkbox"
                  checked={
                    methodology.indirectEnabled
                  }
                  onChange={(e) =>
                    updateMethodology(
                      "indirectEnabled",
                      e.target.checked
                    )
                  }
                />

                Enable Indirect Assessment

              </label>

              <label>
                Indirect Weightage (%)

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    methodology.indirectWeight
                  }
                  disabled={
                    !methodology.indirectEnabled
                  }
                  onChange={(e) =>
                    updateMethodology(
                      "indirectWeight",
                      Number(e.target.value)
                    )
                  }
                />
              </label>

              <strong>
                Overall Weightage:
                {" "}
                {overallWeightTotal}%
              </strong>

            </div>

          </div>

          {!methodologyValid && (
            <div className="error-message">
              Assessment methodology weightage
              must total 100%.
            </div>
          )}

          {!benchmarkBandsValid && (
            <div className="error-message">
              Level 1 &lt; Level 2 &lt; Level 3
              benchmark bands are required.
            </div>
          )}

          {!coMethodologyValid && (
            <div className="error-message">
              Define valid Set Level, Benchmark
              and Marks Threshold for every CO.
            </div>
          )}

          <div className="formula-card">

            <h4>
              Attainment Method
            </h4>

            <label>
              Methodology Description

              <textarea
                rows="4"
                value={methodology.description}
                onChange={(e) =>
                  updateMethodology(
                    "description",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Benchmark Basis

              <textarea
                rows="4"
                value={methodology.basis}
                onChange={(e) =>
                  updateMethodology(
                    "basis",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Methodology Compliance

              <textarea
                rows="4"
                value={methodology.compliance}
                onChange={(e) =>
                  updateMethodology(
                    "compliance",
                    e.target.value
                  )
                }
              />
            </label>

          </div>

          <div className="benchmark-info">

            <div className="benchmark-box">

              <h4>Level 1</h4>

              <input
                type="number"
                min="0"
                max="100"
                value={
                  methodology.level1Benchmark
                }
                onChange={(e) =>
                  updateMethodology(
                    "level1Benchmark",
                    Number(e.target.value)
                  )
                }
              />

              <p>
                {methodology.level1Text}
              </p>

            </div>

            <div className="benchmark-box">

              <h4>Level 2</h4>

              <input
                type="number"
                min="0"
                max="100"
                value={
                  methodology.level2Benchmark
                }
                onChange={(e) =>
                  updateMethodology(
                    "level2Benchmark",
                    Number(e.target.value)
                  )
                }
              />

              <p>
                {methodology.level2Text}
              </p>

            </div>

            <div className="benchmark-box">

              <h4>Level 3</h4>

              <input
                type="number"
                min="0"
                max="100"
                value={
                  methodology.level3Benchmark
                }
                onChange={(e) =>
                  updateMethodology(
                    "level3Benchmark",
                    Number(e.target.value)
                  )
                }
              />

              <p>
                {methodology.level3Text}
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            DATA COLLECTION
        =================================================== */}

        <div className="card">

          <div className="benchmark-header">

            <h3 className="blue-title">
              CO-wise Data Collection & Attainment
            </h3>

            <span className="benchmark-badge">
              Data Collection
            </span>

          </div>

          <p className="section-note">
            For each CO, enter total students and
            students achieving the prescribed threshold.
            The "Students Achieving" value must represent
            students scoring at least the displayed
            threshold percentage.
          </p>

          <div className="table-responsive">

            <table className="calculation-table">

              <thead>

                <tr>

                  <th>CO</th>
                  <th>Set Level</th>
                  <th>Benchmark %</th>
                  <th>Threshold %</th>

                  <th>CIE Total</th>
                  <th>
                    CIE Achieving
                  </th>
                  <th>CIE Actual %</th>
                  <th>CIE Level</th>

                  <th>SEE Total</th>
                  <th>
                    SEE Achieving
                  </th>
                  <th>SEE Actual %</th>
                  <th>SEE Level</th>

                </tr>

              </thead>

              <tbody>

                {calculatedCO.map(
                  (row, index) => (
                    <tr key={row.co}>

                      <td>
                        <b>{row.co}</b>
                      </td>

                      <td>
                        Level {row.setLevel}
                      </td>

                      <td>
                        {row.benchmark}%
                      </td>

                      <td>
                        ≥ {row.threshold}%
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          value={
                            row.cieTotalStudents
                          }
                          onChange={(e) =>
                            updateCO(
                              index,
                              "cieTotalStudents",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          max={
                            row.cieTotalStudents ||
                            undefined
                          }
                          value={
                            row.cieAchievedStudents
                          }
                          onChange={(e) =>
                            updateCO(
                              index,
                              "cieAchievedStudents",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        {row.cieActual === null
                          ? "—"
                          : `${row.cieActual.toFixed(
                              2
                            )}%`}
                      </td>

                      <td>
                        {row.cieLevel === null
                          ? "—"
                          : row.cieLevel === 0
                          ? "Below L1"
                          : `Level ${row.cieLevel}`}
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          value={
                            row.seeTotalStudents
                          }
                          onChange={(e) =>
                            updateCO(
                              index,
                              "seeTotalStudents",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          max={
                            row.seeTotalStudents ||
                            undefined
                          }
                          value={
                            row.seeAchievedStudents
                          }
                          onChange={(e) =>
                            updateCO(
                              index,
                              "seeAchievedStudents",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        {row.seeActual === null
                          ? "—"
                          : `${row.seeActual.toFixed(
                              2
                            )}%`}
                      </td>

                      <td>
                        {row.seeLevel === null
                          ? "—"
                          : row.seeLevel === 0
                          ? "Below L1"
                          : `Level ${row.seeLevel}`}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
        {/* ===================================================
            ATTAINMENT ANALYSIS
        =================================================== */}

        <div className="card">

          <div className="benchmark-header">

            <h3 className="green-title">
              CO Attainment Analysis
            </h3>

            <span className="benchmark-badge">
              Set vs Achieved
            </span>

          </div>

          <div className="table-responsive">

            <table className="comparison-table">

              <thead>

                <tr>

                  <th>CO</th>
                  <th>Set Level</th>
                  <th>Benchmark %</th>
                  <th>Threshold %</th>
                  <th>CIE %</th>
                  <th>SEE %</th>
                  <th>Direct %</th>
                  <th>Direct Level</th>
                  <th>Final %</th>
                  <th>Final Level</th>
                  <th>Benchmark</th>
                  <th>Set Level</th>
                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                {calculatedCO.map((row) => (
                  <tr key={row.co}>

                    <td>
                      <b>{row.co}</b>
                    </td>

                    <td>
                      Level {row.setLevel}
                    </td>

                    <td>
                      {row.benchmark}%
                    </td>

                    <td>
                      ≥ {row.threshold}%
                    </td>

                    <td>
                      {row.cieActual === null
                        ? "—"
                        : `${row.cieActual.toFixed(
                            2
                          )}%`}
                    </td>

                    <td>
                      {row.seeActual === null
                        ? "—"
                        : `${row.seeActual.toFixed(
                            2
                          )}%`}
                    </td>

                    <td>
                      {row.directAttainmentPercentage ===
                      null
                        ? "—"
                        : `${row.directAttainmentPercentage.toFixed(
                            2
                          )}%`}
                    </td>

                    <td>
                      {row.directLevel === null
                        ? "—"
                        : row.directLevel.toFixed(
                            2
                          )}
                    </td>

                    <td>
                      {row.finalAttainmentPercentage ===
                      null
                        ? "—"
                        : `${row.finalAttainmentPercentage.toFixed(
                            2
                          )}%`}
                    </td>

                    <td>
                      {row.finalLevel === null
                        ? "—"
                        : row.finalLevel === 0
                        ? "Below L1"
                        : `Level ${row.finalLevel}`}
                    </td>

                    <td>
                      {row.dataPending ? (
                        "Pending"
                      ) : row.benchmarkMet ? (
                        <span className="status success">
                          Met
                        </span>
                      ) : (
                        <span className="status danger">
                          Not Met
                        </span>
                      )}
                    </td>

                    <td>
                      {row.dataPending ? (
                        "Pending"
                      ) : row.levelMet ? (
                        <span className="status success">
                          Achieved
                        </span>
                      ) : (
                        <span className="status danger">
                          Below Set Level
                        </span>
                      )}
                    </td>

                    <td>
                      {row.status ===
                      "Achieved" ? (
                        <span className="status success">
                          <FaCheckCircle />
                          Achieved
                        </span>
                      ) : row.status ===
                        "Not Achieved" ? (
                        <span className="status danger">
                          Not Achieved
                        </span>
                      ) : (
                        <span className="status warning">
                          Data Pending
                        </span>
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* ===================================================
            CIE EVIDENCE
        =================================================== */}

        <div className="card">

          <h3 className="blue-title">
            CIE / Internal Assessment Tool-wise Evidence
          </h3>

          <p className="section-note">
            Record assessment evidence used to support
            CIE CO attainment verification.
          </p>

          <div className="table-responsive">

            <table className="calculation-table">

              <thead>

                <tr>
                  <th>CO</th>
                  <th>Unit Test</th>
                  <th>Assignment</th>
                  <th>Mid Term</th>
                  <th>Laboratory</th>
                </tr>

              </thead>

              <tbody>

                {coData.map((row, index) => (
                  <tr key={row.co}>

                    <td>
                      <b>{row.co}</b>
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.unitTest}
                        onChange={(e) =>
                          updateCO(
                            index,
                            "unitTest",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.assignment}
                        onChange={(e) =>
                          updateCO(
                            index,
                            "assignment",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.midTerm}
                        onChange={(e) =>
                          updateCO(
                            index,
                            "midTerm",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.laboratory}
                        onChange={(e) =>
                          updateCO(
                            index,
                            "laboratory",
                            e.target.value
                          )
                        }
                      />
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* ===================================================
            INDIRECT
        =================================================== */}

        {methodology.indirectEnabled && (
          <div className="card">

            <h3 className="green-title">
              Indirect Assessment
            </h3>

            <div className="table-responsive">

              <table className="calculation-table">

                <thead>
                  <tr>
                    <th>CO</th>
                    <th>Course Exit Survey</th>
                    <th>Student Feedback</th>
                    <th>Alumni Feedback</th>
                    <th>Employer Feedback</th>
                    <th>Indirect %</th>
                    <th>Indirect Level</th>
                  </tr>
                </thead>

                <tbody>

                  {calculatedCO.map(
                    (row, index) => (
                      <tr key={row.co}>

                        <td>
                          <b>{row.co}</b>
                        </td>

                        {[
                          "courseExitSurvey",
                          "studentFeedback",
                          "alumniFeedback",
                          "employerFeedback",
                        ].map((field) => (
                          <td key={field}>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={
                                indirectData[
                                  index
                                ][field]
                              }
                              onChange={(e) =>
                                updateIndirect(
                                  index,
                                  field,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        ))}

                        <td>
                          {row.indirectPercentage ===
                          null
                            ? "—"
                            : `${row.indirectPercentage.toFixed(
                                2
                              )}%`}
                        </td>

                        <td>
                          {row.indirectLevel ===
                          null
                            ? "Pending"
                            : `Level ${row.indirectLevel}`}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          </div>
        )}

        {/* ===================================================
            METHODOLOGY PROCESS
        =================================================== */}

        <div className="card methodology-card">

          <h3 className="orange-title">
            CO Attainment Methodology & Compliance
          </h3>

          <div className="formula-card">

            <h4>
              Verification Process
            </h4>

            <p>
              1. Define CO-wise Set Level,
              Benchmark and Marks Threshold before
              assessment.
            </p>

            <p>
              2. Collect CIE and SEE assessment
              records.
            </p>

            <p>
              3. Identify students achieving the
              prescribed marks threshold for each CO.
            </p>

            <p>
              4. Calculate CIE and SEE attainment
              percentage using:
              students achieving threshold /
              total students × 100.
            </p>

            <p>
              5. Map attainment percentage to
              approved Level 1, Level 2 and Level 3.
            </p>

            <p>
              6. Combine CIE and SEE using approved
              weightage.
            </p>

            <p>
              7. Calculate final attainment percentage
              and final attainment level.
            </p>

            <p>
              8. Compare final attainment against
              benchmark and Set Level.
            </p>

            <p>
              9. Verify calculations and supporting
              evidence.
            </p>

            <p>
              10. Analyse achieved and non-achieved
              COs.
            </p>

            <p>
              11. Record decisions and corrective
              actions.
            </p>

            <p>
              12. Record improvement / re-attainment
              evidence where applicable.
            </p>

            <p>
              13. Maintain at least one completely
              verified course for each year of study.
            </p>

          </div>
        </div>

        {/* ===================================================
            ADD COURSE
        =================================================== */}

        <div className="card add-course-card">

          <div className="add-course-content">

            <div>
              <h3>
                Add / Update Course Record
              </h3>

              <p>
                Add one complete course-wise CO
                attainment record.
              </p>
            </div>

            <button
              type="button"
              className="add-course-btn"
              onClick={handleAddCourse}
            >
              <FaPlus />
              Add / Update Course Record
            </button>

          </div>

        </div>

        {/* ===================================================
            YEAR-WISE VERIFICATION
        =================================================== */}

        <div className="card">

          <h3 className="green-title">
            One Course per Year of Study Verification
          </h3>

          <div className="table-responsive">

            <table className="comparison-table">

              <thead>
                <tr>
                  <th>Year of Study</th>
                  <th>Courses Added</th>
                  <th>Verified Courses</th>
                  <th>Requirement Status</th>
                </tr>
              </thead>

              <tbody>

                {yearWiseSummary.map(
                  (item) => (
                    <tr key={item.year}>

                      <td>
                        <b>{item.year}</b>
                      </td>

                      <td>
                        {item.count}
                      </td>

                      <td>
                        {item.verified}
                      </td>

                      <td>

                        {item.verified > 0 ? (
                          <span className="status success">
                            <FaCheckCircle />
                            Verified Course Available
                          </span>
                        ) : (
                          <span className="status warning">
                            Course Required
                          </span>
                        )}

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          <p className="section-note">
            Submission requires at least one fully
            verified course record for each year of
            study.
          </p>

        </div>

        {/* ===================================================
            CONSOLIDATED
        =================================================== */}

        <div className="card consolidated-card">

          <div className="benchmark-header">

            <h3 className="green-title">
              All Courses Consolidated CO Attainment
            </h3>

            <span className="benchmark-badge">
              Course-wise Record
            </span>

          </div>

          {courseRecords.length === 0 ? (

            <div className="empty-course-record">

              <p>
                No course records added yet.
              </p>

              <small>
                Complete course data and click
                <b>
                  {" "}
                  Add / Update Course Record
                </b>
                .
              </small>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="consolidated-table">

                <thead>

                  <tr>
                    <th>Sr.No</th>
                    <th>Academic Year</th>
                    <th>Year</th>
                    <th>Course</th>
                    <th>CO</th>
                    <th>Set Level</th>
                    <th>Benchmark</th>
                    <th>CIE %</th>
                    <th>SEE %</th>
                    <th>Final %</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {consolidatedRows.map(
                    (row, index) => (
                      <tr
                        key={`${row.recordId}-${row.co}`}
                      >

                        <td>
                          {index + 1}
                        </td><td>
                          {row.academicYear}
                        </td>

                        <td>
                          {row.yearOfStudy}
                        </td>

                        <td>
                          <b>
                            {row.courseCode}
                          </b>
                          {" - "}
                          {row.courseName}
                        </td>

                        <td>
                          <b>{row.co}</b>
                        </td>

                        <td>
                          Level {row.setLevel}
                        </td>

                        <td>
                          {row.benchmark}%
                        </td>

                        <td>
                          {typeof row.cieActual ===
                          "number"
                            ? row.cieActual.toFixed(
                                2
                              )
                            : "—"}
                          %
                        </td>

                        <td>
                          {typeof row.seeActual ===
                          "number"
                            ? row.seeActual.toFixed(
                                2
                              )
                            : "—"}
                          %
                        </td>

                        <td>
                          {typeof row.finalAttainmentPercentage ===
                          "number"
                            ? row.finalAttainmentPercentage.toFixed(
                                2
                              )
                            : "—"}
                          %
                        </td>

                        <td>
                          {row.finalLevel ===
                          null
                            ? "—"
                            : row.finalLevel}
                        </td>

                        <td>

                          {row.status ===
                          "Achieved" ? (
                            <span className="status-badge achieved">
                              <FaCheckCircle />
                              Achieved
                            </span>
                          ) : row.status ===
                            "Not Achieved" ? (
                            <span className="status-badge not-achieved">
                              Not Achieved
                            </span>
                          ) : (
                            <span className="status-badge">
                              Pending
                            </span>
                          )}

                        </td>

                        <td>

                          <button
                            type="button"
                            className="delete-record-btn"
                            onClick={() =>
                              handleDeleteCourseRecord(
                                row.recordId
                              )
                            }
                            title="Delete Course Record"
                          >
                            <FaTrash />
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* ===================================================
            VERIFICATION
        =================================================== */}

        <div className="card verification-attainment-card">

          <h3 className="dark-title">
            Verification of CO Attainment
          </h3>

          <p className="verification-description">
            Verify calculated attainment against
            approved benchmark, Set Level and
            supporting assessment records.
          </p>

          <div className="table-responsive">

            <table className="verification-attainment-table">

              <thead>

                <tr>
                  <th>Sr</th>
                  <th>Year</th>
                  <th>Course</th>
                  <th>CO</th>
                  <th>Set Level</th>
                  <th>Final %</th>
                  <th>Final Level</th>
                  <th>Benchmark</th>
                  <th>Verification</th>
                </tr>

              </thead>

              <tbody>

                {consolidatedRows.map(
                  (row, index) => {

                    const key =
                      `${row.recordId}-${row.co}`;

                    const verificationStatus =
                      verificationRecords[key] ||
                      "Pending";

                    return (
                      <tr key={key}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {row.yearOfStudy}
                        </td>

                        <td>
                          {row.courseCode}
                          {" - "}
                          {row.courseName}
                        </td>

                        <td>
                          {row.co}
                        </td>

                        <td>
                          Level {row.setLevel}
                        </td>

                        <td>
                          {typeof row.finalAttainmentPercentage ===
                          "number"
                            ? row.finalAttainmentPercentage.toFixed(
                                2
                              )
                            : "—"}
                          %
                        </td>

                        <td>
                          {row.finalLevel ?? "—"}
                        </td>

                        <td>
                          {row.benchmarkMet ? (
                            <span className="verify-status verified">
                              <FaCheckCircle />
                              Met
                            </span>
                          ) : (
                            <span className="verify-status progress">
                              Review Required
                            </span>
                          )}
                        </td>

                        <td>

                          <select
                            value={
                              verificationStatus
                            }
                            onChange={(e) =>
                              updateVerification(
                                row,
                                e.target.value
                              )
                            }
                          >
                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Verified">
                              Verified
                            </option>

                            <option value="Review Required">
                              Review Required
                            </option>
                          </select>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

          <h4>
            Verification Remarks
          </h4>

          <textarea
            rows="4"
            value={verificationRemarks}
            onChange={(e) =>
              setVerificationRemarks(
                e.target.value
              )
            }
            placeholder="Enter verification remarks..."
          />

        </div>

        {/* ===================================================
            ANALYSIS
        =================================================== */}

        <div className="card analysis-card">

          <h3 className="purple-title">
            Faculty Analysis & Recommendations
          </h3>

          <div className="table-responsive">

            <table className="analysis-table">

              <thead>

                <tr>
                  <th>CO</th>
                  <th>Status</th>
                  <th>Final Attainment</th>
                  <th>Observation</th>
                  <th>Recommendation</th>
                </tr>

              </thead>

              <tbody>

                {calculatedCO.map(
                  (row) => (
                    <tr key={row.co}>

                      <td>
                        <b>{row.co}</b>
                      </td>

                      <td>
                        {row.status}
                      </td>

                      <td>
                        {row.finalAttainmentPercentage ===
                        null
                          ? "Pending"
                          : `${row.finalAttainmentPercentage.toFixed(
                              2
                            )}% / Level ${row.finalLevel}`}
                      </td>

                      <td>
                        {row.status ===
                        "Achieved"
                          ? `Benchmark ${row.benchmark}% and Set Level ${row.setLevel} achieved.`
                          : row.status ===
                            "Not Achieved"
                          ? `Final attainment is below the approved benchmark or Set Level ${row.setLevel}.`
                          : "Required assessment data is pending."}
                      </td>

                      <td>
                        {row.status ===
                        "Achieved"
                          ? "Continue effective teaching-learning and assessment practices."
                          : row.status ===
                            "Not Achieved"
                          ? "Conduct remedial classes, additional assignments, mentoring and corrective assessment."
                          : "Complete data collection and verification."}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          <h4>
            Overall Faculty Remarks
          </h4>

          <textarea
            rows="5"
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
            placeholder="Enter overall faculty analysis..."
          />

        </div>

        {/* ===================================================
            DECISION & ACTION
        =================================================== */}

        <div className="card decision-card">

          <h3 className="red-title">
            Decision & Action Taken
          </h3>

          <div className="decision-grid">

            <div className="decision-box">

              <h4>
                Decision Taken
              </h4>

              {[
                ["remedial", "Conduct Remedial Classes"],
                ["assignment", "Additional Assignments"],
                ["expert", "Expert Lecture"],
                ["quiz", "Quiz / Unit Test"],
                [
                  "laboratory",
                  "Additional Laboratory Practice",
                ],
                ["mentoring", "Student Mentoring"],
              ].map(([key, label]) => (
                <label key={key}>

                  <input
                    type="checkbox"
                    checked={decisions[key]}
                    onChange={() =>
                      setDecisions(
                        (prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        })
                      )
                    }
                  />

                  {label}

                </label>
              ))}

            </div>

            <div className="decision-box">

              <h4>
                Action Status
              </h4>

              <table className="action-table">

                <tbody>

                  {[
                    ["remedial", "Remedial Classes"],
                    ["assignment", "Assignments"],
                    ["quiz", "Quiz / Unit Test"],
                    ["expert", "Expert Lecture"],
                    ["laboratory", "Laboratory Practice"],
                    ["mentoring", "Student Mentoring"],
                  ].map(([key, label]) => (
                    <tr key={key}>

                      <td>{label}</td>

                      <td>

                        <select
                          value={actions[key]}
                          onChange={(e) =>
                            setActions(
                              (prev) => ({
                                ...prev,
                                [key]:
                                  e.target.value,
                              })
                            )
                          }
                        >
                          <option>
                            Completed
                          </option>

                          <option>
                            In Progress
                          </option>

                          <option>
                            Pending
                          </option>
                        </select>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

          <h4>
            Decision / Action Remarks
          </h4>

          <textarea
            rows="4"
            value={decisionRemarks}
            onChange={(e) =>
              setDecisionRemarks(
                e.target.value
              )
            }
            placeholder="Enter decision, corrective action and improvement plan..."
          />

          <div className="hod-section">

            <div>
              <label>
                Faculty Name
              </label>

              <input
                value={hod.faculty}
                onChange={(e) =>
                  setHod((prev) => ({
                    ...prev,
                    faculty:
                      e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label>
                HOD Approval
              </label>

              <input
                value={hod.approval}
                onChange={(e) =>
                  setHod((prev) => ({
                    ...prev,
                    approval:
                      e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label>
                Date
              </label>

              <input
                type="date"
                value={hod.date}
                onChange={(e) =>
                  setHod((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>

          </div>

        </div>

        {/* ===================================================
            IMPROVEMENT / RE-ATTAINMENT
        =================================================== */}

        <div className="card">

          <div className="benchmark-header">

            <h3 className="green-title">
              Improvement / Re-attainment Evidence
            </h3>

            <span className="benchmark-badge">
              Action Effectiveness
            </span>

          </div>

          <p className="section-note">
            For non-achieved COs, record attainment
            before and after corrective action to
            demonstrate improvement.
          </p>

          <div className="table-responsive">

            <table className="comparison-table">

              <thead>

                <tr>
                  <th>CO</th>
                  <th>Status</th>
                  <th>Before Action %</th>
                  <th>After Action %</th>
                  <th>Improvement %</th>
                  <th>Improvement Status</th>
                </tr>

              </thead>

              <tbody>

                {coData.map((row, index) => {

                  const calculated =
                    calculatedCO[index];

                  const improvement =
                    calculated?.improvement;

                  return (
                    <tr key={row.co}>

                      <td>
                        <b>{row.co}</b>
                      </td>

                      <td>
                        {calculated?.status}
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={
                            row.improvementBefore
                          }
                          onChange={(e) =>
                            updateCO(
                              index,
                              "improvementBefore",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={
                            row.improvementAfter
                          }
                          onChange={(e) =>
                            updateCO(
                              index,
                              "improvementAfter",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        {improvement === null
                          ? "—"
                          : `${improvement.toFixed(
                              2
                            )}%`}
                      </td>

                      <td>

                        {improvement === null ? (
                          <span className="status warning">
                            Evidence Pending
                          </span>
                        ) : improvement > 0 ? (
                          <span className="status success">
                            Improvement Recorded
                          </span>
                        ) : (
                          <span className="status danger">
                            No Improvement
                          </span>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

        {/* ===================================================
            APPROVAL
        =================================================== */}

        <div className="card verification-card">

          <h3 className="dark-title">
            Verification & Approval
          </h3>

          <div className="table-responsive">

            <table className="verification-table">

              <thead>

                <tr>
                  <th>Authority</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {Object.entries(
                  approval
                ).map(([role, data]) => (
                  <tr key={role}>

                    <td>
                      {role === "teacher"
                        ? "Course Teacher"
                        : role === "coordinator"
                        ? "Course Coordinator"
                        : role === "hod"
                        ? "Head of Department"
                        : "IQAC Coordinator"}
                    </td>

                    <td>

                      <input
                        value={data.name}
                        onChange={(e) =>
                          updateApproval(
                            role,
                            "name",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>
                      {data.designation}
                    </td>

                    <td>

                      <select
                        value={data.status}
                        onChange={(e) =>
                          updateApproval(
                            role,
                            "status",
                            e.target.value
                          )
                        }
                      >

                        <option>
                          Pending
                        </option>

                        <option>
                          Verified
                        </option>

                        <option>
                          Approved
                        </option>

                        <option>
                          Review Required
                        </option>

                      </select>

                    </td>

                    <td>

                      <input
                        type="date"
                        value={data.date}
                        onChange={(e) =>
                          updateApproval(
                            role,
                            "date",
                            e.target.value
                          )
                        }
                      />

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* ===================================================
            CO PERFORMANCE
        =================================================== */}

        <div className="card">

          <h3 className="blue-title">
            CO Performance
          </h3>

          {calculatedCO.map((row) => {

            const progress =
              row.finalAttainmentPercentage ===
              null
                ? 0
                : Math.min(
                    Number(
                      row.finalAttainmentPercentage
                    ),
                    100
                  );

            return (
              <div
                className="progress-row"
                key={row.co}
              >

                <div className="progress-label">
                  {row.co}
                  {" - "}
                  Set Level {row.setLevel}
                  {" | "}
                  Final Attainment:
                  {" "}
                  {row.finalAttainmentPercentage ===
                  null
                    ? "Pending"
                    : `${row.finalAttainmentPercentage.toFixed(
                        2
                      )}%`}
                </div>

                <div className="progress">

                  <div
                    className={
                      row.status === "Achieved"
                        ? "progress-fill success"
                        : row.status ===
                          "Not Achieved"
                        ? "progress-fill danger"
                        : "progress-fill warning"
                    }
                    style={{
                      width: `${progress}%`,
                    }}
                  >
                    {row.finalAttainmentPercentage ===
                    null
                      ? "Data Pending"
                      : `${row.finalAttainmentPercentage.toFixed(
                          2
                        )}%`}
                  </div>

                </div>

              </div>
            );
          })}

        </div>
        {/* ===================================================
            SUPPORTING DOCUMENTS
        =================================================== */}

        <div className="card document-card">

          <h3>
            Supporting Documents / Evidence
          </h3>

          <p className="section-note">
            Upload evidence required for methodology,
            data collection, verification, analysis,
            decision making and improvement. Keep the
            evidence course-wise and year-wise for NBA verification.
          </p>

          <div className="table-responsive">

            <table className="document-table">

              <thead>

                <tr>
                  <th>Sr</th>
                  <th>Document</th>
                  <th>Upload</th>
                  <th>File Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {documents.map((document) => (
                  <tr key={document.id}>

                    <td>
                      {document.id}
                    </td>

                    <td>
                      {document.name}
                    </td>

                    <td>

                      <button
                        type="button"
                        className="document-upload-btn"
                        onClick={() =>
                          handleUploadClick(document.id)
                        }
                        title={`Upload ${document.name}`}
                      >
                        <FaUpload />
                        Upload
                      </button>

                    </td>

                    <td>

                      {document.fileName ? (
                        <span className="selected-file-name">
                          {document.fileName}
                        </span>
                      ) : (
                        <span className="no-file">
                          No file selected
                        </span>
                      )}

                    </td>

                    <td>
                      {document.status}
                    </td>

                    <td>

                      {document.fileName && (
                        <div className="document-actions">

                          <button
                            type="button"
                            className="view-file-btn"
                            onClick={() =>
                              handleViewDocument(
                                document
                              )
                            }
                            title="View"
                          >
                            <FaEye />
                          </button>

                          <button
                            type="button"
                            className="download-file-btn"
                            onClick={() =>
                              handleDownloadDocument(
                                document
                              )
                            }
                            title="Download"
                          >
                            <FaDownload />
                          </button>

                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() =>
                              handleRemoveDocument(
                                document.id
                              )
                            }
                            title="Remove"
                          >
                            <FaTrash />
                          </button>

                        </div>
                      )}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* Hidden native file input controlled by the clickable Upload button. */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
          onChange={handleDocumentFileChange}
          style={{ display: "none" }}
        />

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="footer-buttons">

          <button
            type="button"
            className="nav-btn"
            onClick={handlePrevious}
          >
            <FaArrowLeft />
            Previous
          </button>

          <div className="right-buttons">

            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
            >
              <FaSave />
              Save
            </button>

            <button
              type="button"
              className="add-course-btn"
              onClick={handleAddCourse}
            >
              <FaPlus />
              Add / Update
            </button>

            <button
              type="button"
              className="delete-btn"
              onClick={handleDeleteCurrent}
            >
              <FaTrash />
              Delete
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
            >
              <FaBroom />
              Clear
            </button>

            <button
              type="button"
              className="print-btn"
              onClick={handlePrint}
            >
              <FaPrint />
              Print
            </button>

          
            <button
              type="button"
              className="nav-btn"
              onClick={handleNext}
            >
              Next
              <FaArrowRight />
            </button>

          </div>

        </div>

        {/* ===================================================
            RESET
        =================================================== */}

        <div className="reset-section">

          <button
            type="button"
            className="reset-all-btn"
            onClick={handleResetPage}
          >
            Reset Page Data
          </button>

        </div>

      </div>
    </div>
  );
}

export default CourseOutcomeAttainment;
