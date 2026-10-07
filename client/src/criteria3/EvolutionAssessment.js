import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NBASidebar from "../Pages/NBASidebar";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

import {
  FaCalendarAlt,
  FaUniversity,
  FaGraduationCap,
  FaDownload,
  FaSave,
  FaEye,
  FaArrowRight,
  FaTrash,
  FaPrint,
  FaBroom,
  FaChartBar,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";

import "./EvolutionAssessment.css";

function EvolutionAssessment() {
  const navigate = useNavigate();

  // =========================================================
  // FILE STATES
  // =========================================================

  const [files, setFiles] = useState({});
  const [savedFiles, setSavedFiles] = useState([]);

  // Prevents double-click / multiple Save requests
  const [isSaving, setIsSaving] = useState(false);

  // =========================================================
  // SESSION ID
  // =========================================================

  const getSessionId = () => {
    let sessionId = localStorage.getItem(
      "criteria3_session_id"
    );

    if (!sessionId) {
      sessionId =
        "criteria3_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .substring(2, 10);

      localStorage.setItem(
        "criteria3_session_id",
        sessionId
      );
    }

    return sessionId;
  };

  const [sessionId, setSessionId] = useState("");

  // =========================================================
  // ACADEMIC YEAR
  // =========================================================

  const currentYear = new Date().getFullYear();

  const academicYears = [];

  for (
    let year = 2018;
    year <= currentYear + 5;
    year++
  ) {
    academicYears.push(
      `${year}-${String(year + 1).slice(-2)}`
    );
  }

  const [academicYear, setAcademicYear] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [program, setProgram] =
    useState("");

  // =========================================================
  // CONTINUOUS ASSESSMENT DATA
  // =========================================================

  const initialAssessmentData = [
    {
      id: 1,
      assessment: "Unit Test",
      maxMarks: 20,
      obtainedMarks: "",
      CO1: "",
      CO2: "",
      CO3: "",
      CO4: "",
      CO5: "",
    },
    {
      id: 2,
      assessment: "Class Test",
      maxMarks: 20,
      obtainedMarks: "",
      CO1: "",
      CO2: "",
      CO3: "",
      CO4: "",
      CO5: "",
    },
    {
      id: 3,
      assessment: "Mid-Term",
      maxMarks: 30,
      obtainedMarks: "",
      CO1: "",
      CO2: "",
      CO3: "",
      CO4: "",
      CO5: "",
    },
    {
      id: 4,
      assessment: "Assignment",
      maxMarks: 10,
      obtainedMarks: "",
      CO1: "",
      CO2: "",
      CO3: "",
      CO4: "",
      CO5: "",
    },
  ];

  const [assessmentData, setAssessmentData] =
    useState(initialAssessmentData);

  // =========================================================
  // DOCUMENT DATA
  // =========================================================

  const rows = [
    {
      id: 1,
      marks: 2,
      documentName: "Question Paper Process",
      description:
        "Question paper setting, evaluation & compliance.",
    },
    {
      id: 2,
      marks: 3,
      documentName:
        "Assessment Quality & CO Mapping",
      description:
        "Quality of unit/class/mid-term questions and CO mapping.",
    },
    {
      id: 3,
      marks: 3,
      documentName: "CO Assessment & Coverage",
      description:
        "CO coverage through tests and assignments.",
    },
    {
      id: 4,
      marks: 2,
      documentName: "Student Feedback",
      description:
        "Post-evaluation feedback for improvement.",
    },
  ];

  // =========================================================
  // LOAD SAVED FILES FROM DATABASE
  // =========================================================

  const loadSavedFiles = async (
    providedSessionId = ""
  ) => {
    try {
      const currentSessionId =
        providedSessionId ||
        sessionId ||
        localStorage.getItem(
          "criteria3_session_id"
        ) ||
        getSessionId();

      const response = await axios.get(
        "http://localhost:5000/criteria3/1/assessment",
        {
          params: {
            session_id: currentSessionId,
          },
        }
      );

      const fileList = Array.isArray(
        response.data?.files
      )
        ? response.data.files
        : [];

      setSavedFiles(fileList);

      return fileList;
    } catch (error) {
      console.error(
        "LOAD 3.1 FILES ERROR:",
        error.response?.data ||
          error.message
      );

      setSavedFiles([]);

      return [];
    }
  };

  // =========================================================
  // LOAD SAVED ASSESSMENT DATA
  // =========================================================

  const loadAssessmentData =
    async (providedSessionId = "") => {
      try {
        const currentSessionId =
          providedSessionId ||
          sessionId ||
          localStorage.getItem(
            "criteria3_session_id"
          ) ||
          getSessionId();

        const response = await axios.get(
          "http://localhost:5000/criteria3/assessment/3.1",
          {
            params: {
              session_id: currentSessionId,
            },
          }
        );

        if (
          response.data?.success &&
          Array.isArray(
            response.data?.assessment_data
          )
        ) {
          const dbData =
            response.data.assessment_data;

          setAssessmentData(
            initialAssessmentData.map(
              (defaultItem) => {
                const dbItem =
                  dbData.find(
                    (item) =>
                      Number(
                        item.assessment_id
                      ) ===
                      Number(
                        defaultItem.id
                      )
                  );

                if (!dbItem) {
                  return defaultItem;
                }

                return {
                  ...defaultItem,

                  id:
                    Number(
                      dbItem.assessment_id
                    ),

                  assessment:
                    dbItem.assessment_name ||
                    defaultItem.assessment,

                  maxMarks:
                    dbItem.max_marks !==
                    null
                      ? Number(
                          dbItem.max_marks
                        )
                      : defaultItem.maxMarks,

                  obtainedMarks:
                    dbItem.obtained_marks !==
                    null
                      ? Number(
                          dbItem.obtained_marks
                        )
                      : "",

                  CO1:
                    dbItem.co1 !== null
                      ? Number(dbItem.co1)
                      : "",

                  CO2:
                    dbItem.co2 !== null
                      ? Number(dbItem.co2)
                      : "",

                  CO3:
                    dbItem.co3 !== null
                      ? Number(dbItem.co3)
                      : "",

                  CO4:
                    dbItem.co4 !== null
                      ? Number(dbItem.co4)
                      : "",

                  CO5:
                    dbItem.co5 !== null
                      ? Number(dbItem.co5)
                      : "",
                };
              }
            )
          );
        }
      } catch (error) {
        console.error(
          "LOAD 3.1 ASSESSMENT ERROR:",
          error.response?.data ||
            error.message
        );
      }
    };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const currentSessionId =
      getSessionId();

    setSessionId(currentSessionId);

    loadSavedFiles(
      currentSessionId
    );

    loadAssessmentData(
      currentSessionId
    );

    // =====================================================
    // LOCAL STORAGE
    // =====================================================

    const savedAcademicYear =
      localStorage.getItem(
        "criteria3_1_academic_year"
      );

    const savedDepartment =
      localStorage.getItem(
        "criteria3_1_department"
      );

    const savedProgram =
      localStorage.getItem(
        "criteria3_1_program"
      );

    const savedAssessmentData =
      localStorage.getItem(
        "criteria3_1_assessment_data"
      );

    if (savedAcademicYear) {
      setAcademicYear(
        savedAcademicYear
      );
    }

    if (savedDepartment) {
      setDepartment(
        savedDepartment
      );
    }

    if (savedProgram) {
      setProgram(
        savedProgram
      );
    }

    if (savedAssessmentData) {
      try {
        const parsedData =
          JSON.parse(
            savedAssessmentData
          );

        if (
          Array.isArray(parsedData)
        ) {
          setAssessmentData(
            parsedData
          );
        }
      } catch (error) {
        console.error(
          "ASSESSMENT DATA LOCAL STORAGE ERROR:",
          error
        );
      }
    }
  }, []);

  // =========================================================
  // FILE SELECT / UPLOAD
  // =========================================================

  const handleUpload = (
    e,
    item
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [item.id]: file,
    }));

    alert(
      `${file.name} selected successfully.`
    );
  };

  // =========================================================
  // GET BACKEND FILE
  // =========================================================

  const getBackendFile =
    async (item) => {
      try {
        const currentSessionId =
          sessionId ||
          localStorage.getItem(
            "criteria3_session_id"
          ) ||
          getSessionId();

        const response =
          await axios.get(
            "http://localhost:5000/criteria3/files/3.1",
            {
              params: {
                session_id:
                  currentSessionId,
              },
            }
          );

        const fileList =
          Array.isArray(
            response.data?.files
          )
            ? response.data.files
            : [];

        const file =
          fileList.find(
            (f) =>
              String(
                f.document_name ||
                  ""
              )
                .trim()
                .toLowerCase() ===
              String(
                item.documentName ||
                  ""
              )
                .trim()
                .toLowerCase()
          );

        return file || null;
      } catch (error) {
        console.error(
          "GET BACKEND FILE ERROR:",
          error.response?.data ||
            error.message
        );

        return null;
      }
    };

  // =========================================================
  // VIEW FILE
  // =========================================================

  const handleView =
    async (item) => {
      try {
        if (files[item.id]) {
          const localURL =
            URL.createObjectURL(
              files[item.id]
            );

          window.open(
            localURL,
            "_blank"
          );

          setTimeout(() => {
            URL.revokeObjectURL(
              localURL
            );
          }, 60000);

          return;
        }

        const file =
          await getBackendFile(
            item
          );

        if (!file) {
          alert(
            "No File Found."
          );
          return;
        }

        const filePath =
          String(
            file.file_path || ""
          ).replace(
            /\\/g,
            "/"
          );

        if (!filePath) {
          alert(
            "File path not available."
          );
          return;
        }

        window.open(
          `http://localhost:5000/${filePath}`,
          "_blank"
        );
      } catch (error) {
        console.error(
          "VIEW 3.1 ERROR:",
          error
        );

        alert(
          "Unable to View File."
        );
      }
    };

  // =========================================================
  // DOWNLOAD FILE
  // =========================================================

  const handleDownload =
    async (item) => {
      try {
        if (files[item.id]) {
          const localURL =
            URL.createObjectURL(
              files[item.id]
            );

          const link =
            document.createElement(
              "a"
            );

          link.href =
            localURL;

          link.download =
            files[item.id].name;

          document.body.appendChild(
            link
          );

          link.click();

          document.body.removeChild(
            link
          );

          setTimeout(() => {
            URL.revokeObjectURL(
              localURL
            );
          }, 1000);

          return;
        }

        const file =
          await getBackendFile(
            item
          );

        if (!file) {
          alert(
            "No File Found."
          );
          return;
        }

        const filePath =
          String(
            file.file_path || ""
          ).replace(
            /\\/g,
            "/"
          );

        if (!filePath) {
          alert(
            "File path not available."
          );
          return;
        }

        const link =
          document.createElement(
            "a"
          );

        link.href =
          `http://localhost:5000/${filePath}`;

        link.download =
          file.file_name ||
          item.documentName;

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );
      } catch (error) {
        console.error(
          "DOWNLOAD 3.1 ERROR:",
          error
        );

        alert(
          "Download Failed."
        );
      }
    };

  // =========================================================
  // ASSESSMENT CALCULATIONS
  // =========================================================

  const assessmentCoverage =
    useMemo(() => {
      return assessmentData.map(
        (item) => {
          const maxMarks =
            Number(
              item.maxMarks || 0
            );

          const mappedMarks =
            Number(
              item.CO1 || 0
            ) +
            Number(
              item.CO2 || 0
            ) +
            Number(
              item.CO3 || 0
            ) +
            Number(
              item.CO4 || 0
            ) +
            Number(
              item.CO5 || 0
            );

          const percentage =
            maxMarks > 0
              ? (
                  (mappedMarks /
                    maxMarks) *
                  100
                ).toFixed(2)
              : "0.00";

          return {
            id: item.id,
            mappedMarks,
            percentage,
          };
        }
      );
    }, [assessmentData]);

  // =========================================================
  // INVALID CO MAPPING
  // =========================================================

  const invalidCOMappingRows =
    useMemo(() => {
      return assessmentData.filter(
        (item) => {
          const maxMarks =
            Number(
              item.maxMarks || 0
            );

          const totalCOMarks =
            Number(
              item.CO1 || 0
            ) +
            Number(
              item.CO2 || 0
            ) +
            Number(
              item.CO3 || 0
            ) +
            Number(
              item.CO4 || 0
            ) +
            Number(
              item.CO5 || 0
            );

          return (
            totalCOMarks >
            maxMarks
          );
        }
      );
    }, [assessmentData]);

  // =========================================================
  // TOTAL MAXIMUM MARKS
  // =========================================================

  const totalMaxMarks =
    useMemo(() => {
      return assessmentData.reduce(
        (total, item) =>
          total +
          Number(
            item.maxMarks || 0
          ),
        0
      );
    }, [assessmentData]);

  // =========================================================
  // TOTAL OBTAINED MARKS
  // =========================================================

  const totalObtainedMarks =
    useMemo(() => {
      return assessmentData.reduce(
        (total, item) =>
          total +
          Number(
            item.obtainedMarks ||
              0
          ),
        0
      );
    }, [assessmentData]);

  // =========================================================
  // OVERALL PERCENTAGE
  // =========================================================

  const overallPercentage =
    useMemo(() => {
      if (
        totalMaxMarks <= 0
      ) {
        return "0.00";
      }

      return (
        (totalObtainedMarks /
          totalMaxMarks) *
        100
      ).toFixed(2);
    }, [
      totalObtainedMarks,
      totalMaxMarks,
    ]);

  // =========================================================
  // CO COVERAGE
  // =========================================================

  const coCoverage =
    useMemo(() => {
      return {
        CO1: assessmentData.reduce(
          (total, item) =>
            total +
            Number(
              item.CO1 || 0
            ),
          0
        ),

        CO2: assessmentData.reduce(
          (total, item) =>
            total +
            Number(
              item.CO2 || 0
            ),
          0
        ),

        CO3: assessmentData.reduce(
          (total, item) =>
            total +
            Number(
              item.CO3 || 0
            ),
          0
        ),

        CO4: assessmentData.reduce(
          (total, item) =>
            total +
            Number(
              item.CO4 || 0
            ),
          0
        ),

        CO5: assessmentData.reduce(
          (total, item) =>
            total +
            Number(
              item.CO5 || 0
            ),
          0
        ),
      };
    }, [assessmentData]);

  // =========================================================
  // TOTAL CO MAPPED MARKS
  // =========================================================

  const totalCOMappedMarks =
    useMemo(() => {
      return (
        Number(
          coCoverage.CO1 || 0
        ) +
        Number(
          coCoverage.CO2 || 0
        ) +
        Number(
          coCoverage.CO3 || 0
        ) +
        Number(
          coCoverage.CO4 || 0
        ) +
        Number(
          coCoverage.CO5 || 0
        )
      );
    }, [coCoverage]);

  // =========================================================
  // CO COVERAGE PERCENTAGE
  // =========================================================

  const coCoveragePercentage =
    useMemo(() => {
      if (
        totalMaxMarks <= 0
      ) {
        return "0.00";
      }

      return (
        (totalCOMappedMarks /
          totalMaxMarks) *
        100
      ).toFixed(2);
    }, [
      totalCOMappedMarks,
      totalMaxMarks,
    ]);

  // =========================================================
  // ALL EVIDENCE UPLOADED
  // =========================================================

  const allEvidenceUploaded =
    useMemo(() => {
      return rows.every(
        (item) => {
          const hasCurrentFile =
            !!files[item.id];

          const hasSavedFile =
            savedFiles.some(
              (file) =>
                String(
                  file.document_name ||
                    ""
                )
                  .trim()
                  .toLowerCase() ===
                String(
                  item.documentName ||
                    ""
                )
                  .trim()
                  .toLowerCase()
            );

          return (
            hasCurrentFile ||
            hasSavedFile
          );
        }
      );
    }, [
      files,
      savedFiles,
    ]);

  // =========================================================
  // ASSESSMENT DATA CHANGE
  // =========================================================

  const handleAssessmentChange = (
    id,
    field,
    value
  ) => {
    if (value === "") {
      setAssessmentData(
        (prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  [field]: "",
                }
              : item
          )
      );

      return;
    }

    const numericValue =
      Number(value);

    if (
      Number.isNaN(
        numericValue
      ) ||
      numericValue < 0
    ) {
      return;
    }

    setAssessmentData(
      (prev) =>
        prev.map((item) => {
          if (
            item.id !== id
          ) {
            return item;
          }

          // =================================================
          // MAX MARKS
          // =================================================

          if (
            field ===
            "maxMarks"
          ) {
            const newMaxMarks =
              numericValue;

            const currentObtained =
              Number(
                item.obtainedMarks ||
                  0
              );

            const newObtainedMarks =
              currentObtained >
              newMaxMarks
                ? newMaxMarks
                : item.obtainedMarks;

            return {
              ...item,
              maxMarks:
                newMaxMarks,
              obtainedMarks:
                newObtainedMarks,
            };
          }

          // =================================================
          // OBTAINED MARKS
          // =================================================

          if (
            field ===
            "obtainedMarks"
          ) {
            const maxMarks =
              Number(
                item.maxMarks ||
                  0
              );

            if (
              numericValue >
              maxMarks
            ) {
              return {
                ...item,
                obtainedMarks:
                  maxMarks,
              };
            }

            return {
              ...item,
              obtainedMarks:
                numericValue,
            };
          }

          // =================================================
          // CO MAPPING
          // =================================================

          if (
            [
              "CO1",
              "CO2",
              "CO3",
              "CO4",
              "CO5",
            ].includes(field)
          ) {
            return {
              ...item,
              [field]:
                numericValue,
            };
          }

          return item;
        })
    );
  };

  // =========================================================
  // SAVE - CRITERIA 3.1
  // ASSESSMENT DATA + FILES
  // =========================================================

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      // =====================================================
      // SESSION ID
      // =====================================================

      const currentSessionId =
        sessionId ||
        localStorage.getItem(
          "criteria3_session_id"
        ) ||
        getSessionId();

      if (!currentSessionId) {
        alert(
          "Session ID not found."
        );
        return;
      }

      // =====================================================
      // BASIC VALIDATION
      // =====================================================

      if (!academicYear) {
        alert(
          "Please select Academic Year."
        );
        return;
      }

      if (!department) {
        alert(
          "Please select Department."
        );
        return;
      }

      if (!program) {
        alert(
          "Please select Program."
        );
        return;
      }

      // =====================================================
      // CO MAPPING VALIDATION
      // =====================================================

      if (
        invalidCOMappingRows.length >
        0
      ) {
        alert(
          "CO-wise mapped marks cannot exceed maximum marks. Please correct the highlighted assessment."
        );
        return;
      }

      // =====================================================
      // 1. SAVE ASSESSMENT DATA
      // =====================================================

      const assessmentPayload = {
        session_id:
          currentSessionId,

        academic_year:
          academicYear,

        department:
          department,

        program:
          program,

        assessment_data:
          assessmentData.map(
            (item, index) => {
              const assessmentId =
                Number(item.id);

              const maxMarks =
                Number(
                  item.maxMarks
                );

              const obtainedMarks =
                Number(
                  item.obtainedMarks
                );

              const co1 =
                Number(item.CO1);

              const co2 =
                Number(item.CO2);

              const co3 =
                Number(item.CO3);

              const co4 =
                Number(item.CO4);

              const co5 =
                Number(item.CO5);

              return {
                assessment_id:
                  Number.isFinite(
                    assessmentId
                  )
                    ? assessmentId
                    : index + 1,

                assessment_name:
                  item.assessment ||
                  "",

                max_marks:
                  Number.isFinite(
                    maxMarks
                  )
                    ? maxMarks
                    : 0,

                obtained_marks:
                  Number.isFinite(
                    obtainedMarks
                  )
                    ? obtainedMarks
                    : 0,

                co1:
                  Number.isFinite(
                    co1
                  )
                    ? co1
                    : 0,

                co2:
                  Number.isFinite(
                    co2
                  )
                    ? co2
                    : 0,

                co3:
                  Number.isFinite(
                    co3
                  )
                    ? co3
                    : 0,

                co4:
                  Number.isFinite(
                    co4
                  )
                    ? co4
                    : 0,

                co5:
                  Number.isFinite(
                    co5
                  )
                    ? co5
                    : 0,
              };
            }
          ),
      };

      console.log(
        "3.1 ASSESSMENT PAYLOAD:",
        assessmentPayload
      );

      // =====================================================
      // SEND ASSESSMENT DATA TO BACKEND
      // =====================================================

      const assessmentResponse =
        await axios.post(
          "http://localhost:5000/criteria3/1/assessment",
          assessmentPayload
        );

      if (
        !assessmentResponse.data
          ?.success
      ) {
        alert(
          assessmentResponse.data
            ?.message ||
            "Assessment data save failed."
        );

        return;
      }

      // =====================================================
      // 2. SAVE / UPLOAD FILES
      // =====================================================

      for (const item of rows) {
        const selectedFile =
          files[item.id];

        // Existing DB file remains unchanged
        if (!selectedFile) {
          continue;
        }

        const formData =
          new FormData();

        formData.append(
          "file",
          selectedFile
        );

        formData.append(
          "session_id",
          currentSessionId
        );

        formData.append(
          "criteriaNo",
          "3.1"
        );

        formData.append(
          "documentName",
          item.documentName
        );

        formData.append(
          "description",
          item.description || ""
        );

        formData.append(
          "academicYear",
          academicYear
        );

        formData.append(
          "department",
          department
        );

        formData.append(
          "program",
          program
        );

        console.log(
          "Uploading:",
          item.documentName,
          selectedFile.name
        );

        const fileResponse =
          await axios.post(
            "http://localhost:5000/criteria3/upload/3.1",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        if (
          !fileResponse.data
            ?.success
        ) {
          alert(
            fileResponse.data
              ?.message ||
              `File upload failed for ${item.documentName}.`
          );

          return;
        }
      }

      // =====================================================
      // 3. SAVE TO LOCAL STORAGE
      // =====================================================

      localStorage.setItem(
        "criteria3_1_academic_year",
        academicYear
      );

      localStorage.setItem(
        "criteria3_1_department",
        department
      );

      localStorage.setItem(
        "criteria3_1_program",
        program
      );

      localStorage.setItem(
        "criteria3_1_assessment_data",
        JSON.stringify(
          assessmentData
        )
      );

      // =====================================================
      // 4. RELOAD SAVED DATA
      // =====================================================

      await loadSavedFiles(
        currentSessionId
      );

      await loadAssessmentData(
        currentSessionId
      );

      // =====================================================
      // 5. SUCCESS
      // =====================================================

      alert(
        "Criteria 3.1 data saved successfully."
      );
    } catch (error) {
      console.error(
        "HANDLE SAVE 3.1 ERROR:",
        error.response?.data ||
          error.message ||
          error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Data save failed."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================
  // DELETE ALL SAVED 3.1 DATA
  // =========================================================

  const handleDelete = async () => {
    try {
      const currentSessionId =
        sessionId ||
        localStorage.getItem(
          "criteria3_session_id"
        ) ||
        getSessionId();

      // Check database files
      let backendFiles =
        savedFiles;

      if (
        backendFiles.length ===
        0
      ) {
        try {
          const response =
            await axios.get(
              "http://localhost:5000/criteria3/files/3.1",
              {
                params: {
                  session_id:
                    currentSessionId,
                },
              }
            );

          backendFiles =
            Array.isArray(
              response.data?.files
            )
              ? response.data.files
              : [];
        } catch (error) {
          console.error(
            "DELETE FILE CHECK ERROR:",
            error.response?.data ||
              error.message
          );
        }
      }

      if (
        Object.keys(files)
          .length === 0 &&
        backendFiles.length === 0
      ) {
        alert(
          "No files available to delete."
        );
        return;
      }

      const confirmed =
        window.confirm(
          "Delete all Criteria 3.1 files from database?"
        );

      if (!confirmed) {
        return;
      }

      await axios.delete(
        "http://localhost:5000/criteria3/deleteAll/3.1",
        {
          params: {
            session_id:
              currentSessionId,
          },
        }
      );

      setFiles({});

      setSavedFiles([]);

      document
        .querySelectorAll(
          '.assessment-container input[type="file"]'
        )
        .forEach((input) => {
          input.value = "";
        });

      alert(
        "Criteria 3.1 files deleted successfully."
      );
    } catch (error) {
      console.error(
        "DELETE 3.1 ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data
          ?.message ||
          error.response?.data
            ?.error ||
          "Delete failed."
      );
    }
  };

  // =========================================================
  // CLEAR
  // FRONTEND ONLY
  // =========================================================

  const handleClear = () => {
    const confirmed =
      window.confirm(
        "Clear all 3.1 data from the current screen?"
      );

    if (!confirmed) {
      return;
    }

    setFiles({});

    setAcademicYear("");

    setDepartment("");

    setProgram("");

    setAssessmentData(
      initialAssessmentData.map(
        (item) => ({
          ...item,
          obtainedMarks: "",
          CO1: "",
          CO2: "",
          CO3: "",
          CO4: "",
          CO5: "",
        })
      )
    );

    document
      .querySelectorAll(
        '.assessment-container input[type="file"]'
      )
      .forEach((input) => {
        input.value = "";
      });

    localStorage.removeItem(
      "criteria3_1_files"
    );

    localStorage.removeItem(
      "criteria3_1_assessment_data"
    );

    localStorage.removeItem(
      "criteria3_1_academic_year"
    );

    localStorage.removeItem(
      "criteria3_1_department"
    );

    localStorage.removeItem(
      "criteria3_1_program"
    );

    alert(
      "3.1 current screen data cleared successfully."
    );
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = async () => {
    try {
      const currentFiles =
        Object.keys(files)
          .map((key) => ({
            row: rows.find(
              (item) =>
                item.id ===
                Number(key)
            ),
            file: files[key],
          }))
          .filter(
            (item) =>
              item.row &&
              item.file
          );

      if (
        currentFiles.length ===
        0
      ) {
        alert(
          "No current files available for printing."
        );
        return;
      }

      const printWindow =
        window.open(
          "",
          "_blank"
        );

      if (!printWindow) {
        alert(
          "Please allow pop-ups in your browser for printing."
        );
        return;
      }

      const printAcademicYear =
        academicYear ||
        localStorage.getItem(
          "criteria3_1_academic_year"
        ) ||
        "N/A";

      const printDepartment =
        department ||
        localStorage.getItem(
          "criteria3_1_department"
        ) ||
        "N/A";

      const printProgram =
        program ||
        localStorage.getItem(
          "criteria3_1_program"
        ) ||
        "N/A";

      printWindow.document.open();

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>

          <title>Criteria 3.1 Report</title>

          <style>

            @page {
              size: A4;
              margin: 15mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              font-family:
                Arial,
                Helvetica,
                sans-serif;

              margin: 0;
              padding: 20px;

              color: #222;
              background: #fff;
            }

            .report-header {
              text-align: center;

              border-bottom:
                3px solid #14579e;

              padding-bottom: 15px;

              margin-bottom: 25px;
            }

            .report-header h1 {
              margin: 0;
              color: #14579e;
              font-size: 24px;
            }

            .report-header h2 {
              margin: 8px 0;
              color: #14579e;
              font-size: 18px;
            }

            .report-header p {
              margin: 6px 0;
              font-size: 13px;
              color: #444;
            }

            .file-card {
              border:
                1px solid #ccc;

              border-radius: 6px;

              margin-bottom: 25px;

              overflow: hidden;

              page-break-inside: auto;
            }

            .file-title {
              background: #eef4fa;

              padding: 12px;

              font-size: 16px;

              font-weight: 600;

              color: #14579e;

              border-bottom:
                1px solid #ccc;
            }

            .file-body {
              padding: 15px;
            }

            .file-body p {
              font-size: 13px;

              line-height: 1.6;

              margin: 7px 0;
            }

            .file-name {
              color: #16a34a;

              font-weight: 600;

              word-break: break-word;
            }

            .document-content {
              margin-top: 18px;

              padding: 18px;

              border:
                1px solid #ddd;

              background: #fff;

              font-size: 13px;

              line-height: 1.6;

              overflow-wrap: break-word;
            }

            .document-content h1,
            .document-content h2,
            .document-content h3,
            .document-content h4,
            .document-content h5,
            .document-content h6 {
              color: #14579e;

              margin-top: 15px;

              margin-bottom: 8px;
            }

            .document-content p {
              margin: 7px 0;
              color: #222;
            }

            .document-content table {
              width: 100%;

              border-collapse: collapse;

              margin: 15px 0;

              page-break-inside: auto;
            }

            .document-content table tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }

            .document-content table th,
            .document-content table td {
              border:
                1px solid #999;

              padding: 7px;

              font-size: 11px;

              vertical-align: top;
            }

            .document-content table th {
              background: #eef4fa;
              font-weight: 600;
            }

            .document-content img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 10px auto;
            }

            .pdf-preview {
              width: 100%;
              height: 700px;

              border:
                1px solid #ccc;

              margin-top: 15px;
            }

            .image-preview {
              display: block;

              max-width: 100%;
              max-height: 650px;

              margin: 15px auto;

              border:
                1px solid #ccc;
            }

            .excel-table {
              width: 100%;

              border-collapse: collapse;

              margin-top: 15px;
            }

            .excel-table th,
            .excel-table td {
              border:
                1px solid #999;

              padding: 6px;

              font-size: 11px;

              text-align: left;

              vertical-align: top;
            }

            .excel-table th {
              background: #eef4fa;
            }

            .unsupported {
              padding: 20px;

              background: #f8f8f8;

              border:
                1px dashed #aaa;

              margin-top: 15px;

              text-align: center;
            }

            .assessment-info {
              margin-top: 30px;

              border:
                1px solid #ddd;

              padding: 15px;

              page-break-inside: avoid;
            }

            .assessment-info h3 {
              color: #14579e;
              margin-top: 0;
            }

            .assessment-table {
              width: 100%;

              border-collapse: collapse;

              margin-top: 10px;
            }

            .assessment-table th,
            .assessment-table td {
              border:
                1px solid #ccc;

              padding: 7px;

              font-size: 11px;

              text-align: center;
            }

            .assessment-table th {
              background: #eef4fa;
            }

            .footer {
              margin-top: 30px;

              text-align: center;

              font-size: 11px;

              color: #777;
            }

          </style>

        </head>

        <body>

          <div class="report-header">

            <h1>
              CRITERIA 3
            </h1>

            <h2>
              3.1 Evaluation of Continuous Assessment
            </h2>

            <p>
              <strong>Academic Year:</strong>
              ${printAcademicYear}
            </p>

            <p>
              <strong>Department:</strong>
              ${printDepartment}
            </p>

            <p>
              <strong>Program:</strong>
              ${printProgram}
            </p>

            <p>
              <strong>Current Uploaded Files:</strong>
              ${currentFiles.length}
            </p>

          </div>
      `);

      // =====================================================
      // PROCESS CURRENT FILES
      // =====================================================

      for (
        const item of currentFiles
      ) {
        const row = item.row;
        const file = item.file;

        const fileName =
          file.name || "File";

        const extension =
          fileName
            .split(".")
            .pop()
            .toLowerCase();

        let contentHTML = "";

        // ---------------------------------------------------
        // PDF
        // ---------------------------------------------------

        if (
          extension === "pdf"
        ) {
          const fileURL =
            URL.createObjectURL(
              file
            );

          contentHTML = `
            <iframe
              src="${fileURL}"
              class="pdf-preview"
            ></iframe>
          `;
        }

        // ---------------------------------------------------
        // IMAGE
        // ---------------------------------------------------

        else if (
          [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
          ].includes(extension)
        ) {
          const fileURL =
            URL.createObjectURL(
              file
            );

          contentHTML = `
            <img
              src="${fileURL}"
              class="image-preview"
              alt="${fileName}"
            />
          `;
        }

        // ---------------------------------------------------
        // WORD
        // ---------------------------------------------------

        else if (
          [
            "doc",
            "docx",
          ].includes(extension)
        ) {
          try {
            const arrayBuffer =
              await file.arrayBuffer();

            const result =
              await mammoth.convertToHtml(
                {
                  arrayBuffer,
                }
              );

            contentHTML = `
              <div class="document-content">
                ${result.value}
              </div>
            `;
          } catch (docError) {
            console.error(
              "DOCX PREVIEW ERROR:",
              docError
            );

            contentHTML = `
              <div class="unsupported">

                <strong>
                  ${fileName}
                </strong>

                <p>
                  Unable to read the Word document.
                </p>

              </div>
            `;
          }
        }

        // ---------------------------------------------------
        // EXCEL
        // ---------------------------------------------------

        else if (
          [
            "xls",
            "xlsx",
          ].includes(extension)
        ) {
          try {
            const arrayBuffer =
              await file.arrayBuffer();

            const workbook =
              XLSX.read(
                arrayBuffer,
                {
                  type: "array",
                }
              );

            let excelHTML = "";

            workbook.SheetNames.forEach(
              (sheetName) => {
                const worksheet =
                  workbook.Sheets[
                    sheetName
                  ];

                const sheetData =
                  XLSX.utils.sheet_to_json(
                    worksheet,
                    {
                      header: 1,
                      defval: "",
                    }
                  );

                excelHTML += `
                  <h3>
                    ${sheetName}
                  </h3>

                  <table class="excel-table">
                `;

                sheetData.forEach(
                  (
                    rowData,
                    rowIndex
                  ) => {
                    excelHTML +=
                      "<tr>";

                    rowData.forEach(
                      (cell) => {
                        if (
                          rowIndex ===
                          0
                        ) {
                          excelHTML += `
                            <th>
                              ${cell}
                            </th>
                          `;
                        } else {
                          excelHTML += `
                            <td>
                              ${cell}
                            </td>
                          `;
                        }
                      }
                    );

                    excelHTML +=
                      "</tr>";
                  }
                );

                excelHTML += `
                  </table>
                `;
              }
            );

            contentHTML = `
              <div class="document-content">
                ${excelHTML}
              </div>
            `;
          } catch (excelError) {
            console.error(
              "EXCEL PREVIEW ERROR:",
              excelError
            );

            contentHTML = `
              <div class="unsupported">

                <strong>
                  ${fileName}
                </strong>

                <p>
                  Unable to read Excel document.
                </p>

              </div>
            `;
          }
        }

        // ---------------------------------------------------
        // OTHER
        // ---------------------------------------------------

        else {
          contentHTML = `
            <div class="unsupported">

              <strong>
                ${fileName}
              </strong>

              <p>
                File content preview is not available
                for this file type in the browser.
              </p>

            </div>
          `;
        }

        printWindow.document.write(`

          <div class="file-card">

            <div class="file-title">

              ${row.id}.
              ${row.documentName}

              -

              ${row.marks}
              Marks

            </div>

            <div class="file-body">

              <p>

                <strong>
                  Description:
                </strong>

                ${row.description}

              </p>

              <p>

                <strong>
                  File:
                </strong>

                <span class="file-name">
                  ${fileName}
                </span>

              </p>

              ${contentHTML}

            </div>

          </div>

        `);
      }

      // =====================================================
      // ASSESSMENT SUMMARY
      // =====================================================

      printWindow.document.write(`

        <div class="assessment-info">

          <h3>
            Continuous Assessment Summary
          </h3>

          <table class="assessment-table">

            <thead>

              <tr>

                <th>Assessment</th>
                <th>Max Marks</th>
                <th>Obtained Marks</th>
                <th>CO1</th>
                <th>CO2</th>
                <th>CO3</th>
                <th>CO4</th>
                <th>CO5</th>

              </tr>

            </thead>

            <tbody>

              ${assessmentData
                .map(
                  (item) => `
                    <tr>

                      <td>
                        ${item.assessment}
                      </td>

                      <td>
                        ${item.maxMarks}
                      </td>

                      <td>
                        ${item.obtainedMarks || 0}
                      </td>

                      <td>
                        ${item.CO1 || 0}
                      </td>

                      <td>
                        ${item.CO2 || 0}
                      </td>

                      <td>
                        ${item.CO3 || 0}
                      </td>

                      <td>
                        ${item.CO4 || 0}
                      </td>

                      <td>
                        ${item.CO5 || 0}
                      </td>

                    </tr>
                  `
                )
                .join("")}

            </tbody>

          </table>

          <p>
            <strong>
              Total Maximum Marks:
            </strong>

            ${totalMaxMarks}
          </p>

          <p>
            <strong>
              Total Obtained Marks:
            </strong>

            ${totalObtainedMarks}
          </p>

          <p>
            <strong>
              Overall Assessment Percentage:
            </strong>

            ${overallPercentage}%
          </p>

          <p>
            <strong>
              CO Coverage:
            </strong>

            ${coCoveragePercentage}%
          </p>

        </div>

        <div class="footer">

          Criteria 3.1 -
          Evaluation of Continuous Assessment

        </div>

        </body>
        </html>
      `);

      printWindow.document.close();

      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch (error) {
          console.error(
            "PRINT ERROR:",
            error
          );
        }
      }, 2000);
    } catch (error) {
      console.error(
        "PRINT 3.1 ERROR:",
        error
      );

      alert(
        "Unable to generate print report."
      );
    }
  };

  // =========================================================
  // NEXT
  // =========================================================

  const handleNext = () => {
    navigate(
      "/criteria/3.2"
    );
  };

  // =========================================================
  // JSX START
  // =========================================================

  return (
    <div className="main-container">

      <NBASidebar />

      <div className="assessment-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="assessment-header">

          <div className="assessment-title-section">

            <div className="assessment-badge">
              3.1
            </div>

            <div>

              <h2>
                Evaluation of Continuous Assessment
              </h2>

              <p>
                Evaluation of Unit Tests, Class Tests,
                Mid-Term Tests, Assignments and
                Post-Evaluation Feedback
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            TOP FILTER
        ================================================= */}

        <div className="top-bar">

          {/* ACADEMIC YEAR */}

          <div className="filter-box">

            <label>
              Academic Year
            </label>

            <div className="select-box">

              <FaCalendarAlt className="icon" />

              <select
                value={academicYear}
                onChange={(e) =>
                  setAcademicYear(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Academic Year
                </option>

                {academicYears.map(
                  (year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* DEPARTMENT */}

          <div className="filter-box">

            <label>
              Department
            </label>

            <div className="select-box">

              <FaUniversity className="icon" />

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Department
                </option>

                <option value="Computer Engineering">
                  Computer Engineering
                </option>

                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>

                <option value="Civil Engineering">
                  Civil Engineering
                </option>

                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>

              </select>

            </div>

          </div>

          {/* PROGRAM */}

          <div className="filter-box">

            <label>
              Program
            </label>

            <div className="select-box">

              <FaGraduationCap className="icon" />

              <select
                value={program}
                onChange={(e) =>
                  setProgram(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Program
                </option>

                <option value="B.E. Computer Engineering">
                  B.E. Computer Engineering
                </option>

                <option value="M.E. Computer Engineering">
                  M.E. Computer Engineering
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* =================================================
            DOCUMENTARY EVIDENCE
        ================================================= */}

        <div className="assessment-card">

          <div className="section-heading">

            <div>

              <h3>
                3.1 Documentary Evidence
              </h3>

              <p>
                Evidence required for evaluation of
                Continuous Assessment as per NBA
                Criterion 3.1.
              </p>

            </div>

            <div className="marks-badge">
              10 Marks
            </div>

          </div>

          {/* EVIDENCE STATUS */}

          <div className="evidence-score-card">

            <div className="evidence-score-left">
            </div>

            <div className="evidence-score-right">

              {allEvidenceUploaded ? (
                <>

                  <FaCheckCircle />

                  <span>
                    Complete Evidence Coverage
                  </span>

                </>
              ) : (
                <>

                  <FaFileAlt />

                  <span>
                    Upload all A-D evidence
                  </span>

                </>
              )}

            </div>

          </div>

          {/* EVIDENCE TABLE */}

          <div className="table-wrapper">

            <table className="assessment-table">

              <thead>

                <tr>

                  <th className="sr-column">
                    Sr.No.
                  </th>

                  <th>
                    Document
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {rows.map(
                  (item) => {

                    const savedFile =
                      savedFiles.find(
                        (file) =>
                          String(
                            file.document_name ||
                              ""
                          )
                            .trim()
                            .toLowerCase() ===
                          String(
                            item.documentName ||
                              ""
                          )
                            .trim()
                            .toLowerCase()
                      );

                    return (
                      <tr
                        key={item.id}
                      >

                        <td>
                          {item.id}
                        </td>

                        <td>

                          <strong>
                            {item.documentName}
                          </strong>

                          <small className="guideline-text">
                            {item.marks} Marks
                          </small>

                        </td>

                        <td>

                          <textarea
                            className="description-box"
                            value={
                              item.description
                            }
                            readOnly
                          />

                        </td>

                        <td className="attachment-cell">

                          <div className="action-buttons">

                            <input
                              type="file"
                              className="file-input"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                              onChange={(e) =>
                                handleUpload(
                                  e,
                                  item
                                )
                              }
                            />

                            {files[item.id] && (
                              <div className="selected-file-name">

                                <FaCheckCircle />

                                {files[item.id].name}

                              </div>
                            )}

                            {!files[item.id] &&
                              savedFile && (
                                <div className="selected-file-name">

                                  <FaCheckCircle />

                                  {savedFile.file_name}

                                </div>
                              )}

                            <div className="file-action-buttons">

                              <button
                                type="button"
                                className="view-btn"
                                onClick={() =>
                                  handleView(
                                    item
                                  )
                                }
                              >

                                <FaEye />

                                View

                              </button>

                              <button
                                type="button"
                                className="download-btn"
                                onClick={() =>
                                  handleDownload(
                                    item
                                  )
                                }
                              >

                                <FaDownload />

                                Download

                              </button>

                            </div>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =================================================
            CONTINUOUS ASSESSMENT CALCULATION
        ================================================= */}

        <div className="assessment-calculation-card">

          <div className="calculation-header">

            <div>

              <h3>

                <FaChartBar />

                Continuous Assessment & CO Coverage

              </h3>

              <p>
                Supporting assessment record for Unit Tests,
                Class Tests, Mid-Term Tests and Assignments.
                Enter assessment marks and CO-wise question
                coverage for documentary verification.
              </p>

            </div>

          </div>

          {/* CALCULATION TABLE */}

          <div className="calculation-table-wrapper">

            <table className="calculation-table">

              <thead>

                <tr>

                  <th>
                    Assessment
                  </th>

                  <th>
                    Max Marks
                  </th>

                  <th>
                    Obtained Marks
                  </th>

                  <th>
                    CO1
                  </th>

                  <th>
                    CO2
                  </th>

                  <th>
                    CO3
                  </th>

                  <th>
                    CO4
                  </th>

                  <th>
                    CO5
                  </th>

                  <th>
                    CO Mapping %
                  </th>

                </tr>

              </thead>

              <tbody>

                {assessmentData.map(
                  (item) => {

                    const coverage =
                      assessmentCoverage.find(
                        (row) =>
                          row.id ===
                          item.id
                      );

                    const hasError =
                      invalidCOMappingRows.some(
                        (row) =>
                          row.id ===
                          item.id
                      );

                    return (
                      <tr
                        key={item.id}
                      >

                        <td className="assessment-name">
                          {item.assessment}
                        </td>

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              item.maxMarks
                            }
                            onChange={(e) =>
                              handleAssessmentChange(
                                item.id,
                                "maxMarks",
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
                              item.maxMarks
                            }
                            value={
                              item.obtainedMarks
                            }
                            placeholder="Marks"
                            onChange={(e) =>
                              handleAssessmentChange(
                                item.id,
                                "obtainedMarks",
                                e.target.value
                              )
                            }
                          />

                        </td>

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              item.CO1
                            }
                            placeholder="0"
                            onChange={(e) =>
                              handleAssessmentChange(
                                item.id,
                                "CO1",
                                e.target.value
                              )
                            }
                          />

                        </td>

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              item.CO2
                            }
                            placeholder="0"
                            onChange={(e) =>
                              handleAssessmentChange(
                                item.id,
                                "CO2",
                                e.target.value
                              )
                            }
                          />

                        </td>

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              item.CO3
                            }
                            placeholder="0"
                            onChange={(e) =>
                              handleAssessmentChange(
                                item.id,
                                "CO3",
                                e.target.value
                              )
                            }
                          />

                        </td>

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              item.CO4
                            }
                            placeholder="0"
                            onChange={(e) =>
                              handleAssessmentChange(
                                item.id,
                                "CO4",
                                e.target.value
                              )
                            }
                          />

                        </td>

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              item.CO5
                            }
                            placeholder="0"
                            onChange={(e) =>
                              handleAssessmentChange(
                                item.id,
                                "CO5",
                                e.target.value
                              )
                            }
                          />

                        </td>

                        <td>

                          <strong
                            className={
                              hasError
                                ? "coverage-error"
                                : "coverage-value"
                            }
                          >

                            {coverage?.percentage ||
                              "0.00"}

                            %

                          </strong>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

          {/* MAPPING WARNING */}

          {invalidCOMappingRows.length >
            0 && (

            <div className="mapping-warning">

              <strong>
                CO Mapping Validation:
              </strong>

              <span>
                CO-wise mapped marks cannot exceed
                the maximum marks of the respective
                assessment. Please correct the highlighted
                assessment mapping before saving.
              </span>

            </div>

          )}

          {/* CALCULATION RESULTS */}

          <div className="calculation-result">

            <div className="result-box">

              <span>
                Total Maximum Marks
              </span>

              <strong>
                {totalMaxMarks}
              </strong>

            </div>

            <div className="result-box">

              <span>
                Total Obtained Marks
              </span>

              <strong>
                {totalObtainedMarks}
              </strong>

            </div>

            <div className="result-box">

              <span>
                Overall Assessment Percentage
              </span>

              <strong>
                {overallPercentage}%
              </strong>

            </div>

            <div className="result-box">

              <span>
                CO Coverage
              </span>

              <strong>
                {coCoveragePercentage}%
              </strong>

            </div>

          </div>

          {/* CO COVERAGE SUMMARY */}

          <div className="co-coverage-section">

            <div className="co-heading">

              <div>

                <h4>
                  CO Coverage Summary
                </h4>

                <p>
                  Total assessment/question marks
                  mapped with each Course Outcome.
                </p>

              </div>

            </div>

            <div className="co-coverage-grid">

              <div className="co-box">

                <span>
                  CO1
                </span>

                <strong>
                  {coCoverage.CO1}
                </strong>

                <small>
                  Mapped Marks
                </small>

              </div>

              <div className="co-box">

                <span>
                  CO2
                </span>

                <strong>
                  {coCoverage.CO2}
                </strong>

                <small>
                  Mapped Marks
                </small>

              </div>

              <div className="co-box">

                <span>
                  CO3
                </span>

                <strong>
                  {coCoverage.CO3}
                </strong>

                <small>
                  Mapped Marks
                </small>

              </div>

              <div className="co-box">

                <span>
                  CO4
                </span>

                <strong>
                  {coCoverage.CO4}
                </strong>

                <small>
                  Mapped Marks
                </small>

              </div>

              <div className="co-box">

                <span>
                  CO5
                </span>

                <strong>
                  {coCoverage.CO5}
                </strong>

                <small>
                  Mapped Marks
                </small>

              </div>

            </div>

          </div>

          {/* =================================================
              BOTTOM BUTTONS
          ================================================= */}

          <div className="bottom-buttons">

            {/* SAVE */}

            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >

              <FaSave />

              {isSaving
                ? "Saving..."
                : "Save"}

            </button>

            {/* DELETE */}

            <button
              type="button"
              className="delete-btn"
              onClick={handleDelete}
              disabled={isSaving}
            >

              <FaTrash />

              Delete

            </button>

            {/* PRINT */}

            <button
              type="button"
              className="print-btn"
              onClick={handlePrint}
            >

              <FaPrint />

              Print

            </button>

            {/* CLEAR */}

            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
            >

              <FaBroom />

              Clear

            </button>

            {/* NEXT */}

            <button
              type="button"
              className="next-btn"
              onClick={handleNext}
            >

              Next

              <FaArrowRight />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EvolutionAssessment;

