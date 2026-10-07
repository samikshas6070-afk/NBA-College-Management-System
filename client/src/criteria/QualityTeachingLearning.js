import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import mammoth from "mammoth";

import NBASidebar from "../Pages/NBASidebar";

import {
  FaEye,
  FaDownload,
} from "react-icons/fa";

import "./QualityTeachingLearning.css";

function QualityTeachingLearning() {
  const navigate = useNavigate();

  // =========================================================
  // SESSION ID
  // =========================================================

  const [sessionId] = useState(() => {
    let id = localStorage.getItem("criteria2_session_id");

    if (!id) {
      id = Date.now().toString();

      localStorage.setItem(
        "criteria2_session_id",
        id
      );
    }

    return id;
  });

  // =========================================================
  // ACADEMIC INFORMATION
  // =========================================================

  const [academicYear, setAcademicYear] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [program, setProgram] =
    useState("");

  // =========================================================
  // FILE STATE
  // =========================================================

  const [files, setFiles] = useState({});

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // DOCUMENTS - CRITERIA 2.1
  // =========================================================

  const documents = [
    {
      id: 1,
      name: "Adherence to the Academic Calendar",
      description:
        "Academic calendar implementation and compliance records.",
    },

    {
      id: 2,
      name: "Pedagogical Initiatives",
      description:
        "Innovative teaching-learning methods and ICT practices.",
    },

    {
      id: 3,
      name: "Support Students Based on Their Ability",
      description:
        "Remedial classes, mentoring and support for advanced learners.",
    },

    {
      id: 4,
      name: "Quality of Classroom Teaching",
      description:
        "Teaching plans, classroom feedback and quality records.",
    },

    {
      id: 5,
      name: "Conduct of Experiments",
      description:
        "Laboratory practicals, experiment records and assessments.",
    },
  ];

  // =========================================================
  // LOAD FILES
  // =========================================================

  useEffect(() => {
    loadUploadedFiles();
  }, [sessionId]);

  // =========================================================
  // LOAD UPLOADED FILES
  // =========================================================

  const loadUploadedFiles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/criteria/files/2.1",
        {
          params: {
            session_id: sessionId,
          },
        }
      );

      const serverFiles =
        Array.isArray(response.data?.files)
          ? response.data.files
          : [];

      if (serverFiles.length === 0) {
        setFiles({});
        return;
      }

      // -------------------------------------------------------
      // LOAD ACADEMIC INFORMATION
      // -------------------------------------------------------

      const firstFile = serverFiles[0];

      setAcademicYear(
        firstFile.academic_year || ""
      );

      setDepartment(
        firstFile.department || ""
      );

      setProgram(
        firstFile.program || ""
      );

      // -------------------------------------------------------
      // MAP FILES
      // -------------------------------------------------------

      const loadedFiles = {};

      serverFiles.forEach((item) => {
        const documentName =
          (item.document_name || "").trim();

        const row = documents.find(
          (doc) =>
            doc.name.trim() ===
            documentName
        );

        if (!row) {
          return;
        }

        loadedFiles[row.id] = {
          file: null,

          saved: true,

          file_name:
            item.file_name || null,

          original_name:
            item.original_file_name ||
            item.file_name ||
            "",

          name:
            item.original_file_name ||
            item.file_name ||
            "",

          session_id:
            sessionId,
        };
      });

      setFiles(loadedFiles);

    } catch (error) {
      console.error(
        "LOAD 2.1 FILE ERROR:",
        error
      );
    }
  };

  // =========================================================
  // FILE SELECT
  // =========================================================

  const handleFileChange = (
    event,
    row
  ) => {

    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // =========================================================
    // UPDATE CURRENT PAGE STATE
    // =========================================================

    setFiles((previous) => ({
      ...previous,

      [row.id]: {
        file: selectedFile,

        name: selectedFile.name,

        original_name:
          selectedFile.name,

        saved: false,

        file_name: null,

        session_id:
          sessionId,
      },
    }));

    // =========================================================
    // SAVE CURRENT FILE FOR CRITERIA 2 REPORT
    // =========================================================

    const reader =
      new FileReader();

    reader.onload = () => {

      try {

        const existingFiles =
          JSON.parse(
            sessionStorage.getItem(
              "criteria2_current_files"
            ) || "[]"
          );

        // -------------------------------------------------------
        // REMOVE OLD FILE OF SAME DOCUMENT
        // -------------------------------------------------------

        const filteredFiles =
          existingFiles.filter(
            (item) =>
              !(
                String(item.criteriaNo) === "2.1" &&
                item.documentName === row.name
              )
          );

        // -------------------------------------------------------
        // ADD NEW CURRENT FILE
        // -------------------------------------------------------

        filteredFiles.push({

          criteriaNo: "2.1",

          documentName:
            row.name,

          description:
            row.description,

          fileName:
            selectedFile.name,

          fileType:
            selectedFile.type,

          fileData:
            reader.result,

        });

        // -------------------------------------------------------
        // SAVE BACK TO SESSION STORAGE
        // -------------------------------------------------------

        sessionStorage.setItem(
          "criteria2_current_files",
          JSON.stringify(
            filteredFiles
          )
        );

        console.log(
          "CURRENT 2.1 FILE ADDED:",
          selectedFile.name
        );

        console.log(
          "CURRENT CRITERIA 2 FILES:",
          filteredFiles
        );

      } catch (error) {

        console.error(
          "CURRENT FILE STORAGE ERROR:",
          error
        );

      }

    };

    reader.readAsDataURL(
      selectedFile
    );
  };

  // =========================================================
  // VIEW FILE
  // =========================================================

  const handleView = (row) => {
    const fileData =
      files[row.id];

    if (!fileData) {
      alert(
        "Please select a file first."
      );

      return;
    }

    let fileURL = "";

    // Saved file
    if (
      fileData.saved &&
      fileData.file_name
    ) {
      fileURL =
        `http://localhost:5000/uploads/${encodeURIComponent(
          fileData.file_name
        )}`;
    }

    // Newly selected file
    else if (fileData.file) {
      fileURL =
        URL.createObjectURL(
          fileData.file
        );
    }

    else {
      alert(
        "File is not available."
      );

      return;
    }

    window.open(
      fileURL,
      "_blank"
    );
  };

  // =========================================================
  // DOWNLOAD FILE
  // =========================================================

  const handleDownload = (row) => {
    const fileData =
      files[row.id];

    if (!fileData) {
      alert(
        "Please select a file first."
      );

      return;
    }

    let fileURL = "";

    // Saved file
    if (
      fileData.saved &&
      fileData.file_name
    ) {
      fileURL =
        `http://localhost:5000/uploads/${encodeURIComponent(
          fileData.file_name
        )}`;
    }

    // Newly selected file
    else if (fileData.file) {
      fileURL =
        URL.createObjectURL(
          fileData.file
        );
    }

    else {
      alert(
        "File is not available."
      );

      return;
    }

    const link =
      window.document.createElement(
        "a"
      );

    link.href = fileURL;

    link.download =
      fileData.original_name ||
      fileData.name ||
      "download";

    window.document.body.appendChild(
      link
    );

    link.click();

    window.document.body.removeChild(
      link
    );

    // Object URL cleanup
    if (fileData.file) {
      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 1000);
    }
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = async () => {
    const uploadedDocs =
      Object.keys(files);

    if (
      uploadedDocs.length === 0
    ) {
      alert(
        "Please select file first."
      );

      return;
    }

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

    try {
      setLoading(true);

      let savedCount = 0;

      for (
        const key of uploadedDocs
      ) {
        const fileData =
          files[key];

        // Already saved
        if (fileData.saved) {
          continue;
        }

        if (!fileData.file) {
          continue;
        }

        const row =
          documents.find(
            (doc) =>
              doc.id ===
              Number(key)
          );

        if (!row) {
          continue;
        }

        const formData =
          new FormData();

        formData.append(
          "criteriaNo",
          "2.1"
        );

        formData.append(
          "documentName",
          row.name
        );

        formData.append(
          "description",
          row.description
        );

        formData.append(
          "session_id",
          sessionId
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

        formData.append(
          "file",
          fileData.file
        );

        const response =
          await axios.post(
            "http://localhost:5000/criteria/upload",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        if (
          response.data?.success
        ) {
          setFiles((previous) => ({
            ...previous,

            [key]: {
              ...previous[key],

              saved: true,

              file_name:
                response.data.data
                  ?.file_name,

              original_name:
                response.data.data
                  ?.original_file_name ||
                fileData.original_name ||
                fileData.name,

              name:
                response.data.data
                  ?.original_file_name ||
                fileData.original_name ||
                fileData.name,

              session_id:
                sessionId,
            },
          }));

          savedCount++;
        }
      }

      if (savedCount > 0) {
        alert(
          `${savedCount} file(s) saved successfully.`
        );
      } else {
        alert(
          "All selected files are already saved."
        );
      }

    } catch (error) {
      console.error(
        "SAVE 2.1 ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Save Failed."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async () => {
    if (
      Object.keys(files).length === 0
    ) {
      alert(
        "No files available to delete."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Delete all 2.1 files from the current session?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await axios.delete(
        "http://localhost:5000/criteria/deleteAll/2.1",
        {
          data: {
            session_id:
              sessionId,
          },
        }
      );

      setFiles({});

      window.document
        .querySelectorAll(
          ".quality-table .file-input"
        )
        .forEach((input) => {
          input.value = "";
        });

      // =======================================================
      // REMOVE 2.1 FROM CURRENT REPORT FILES
      // =======================================================

      const currentFiles =
        JSON.parse(
          sessionStorage.getItem(
            "criteria2_current_files"
          ) || "[]"
        );

      const updatedFiles =
        currentFiles.filter(
          (item) =>
            String(item.criteriaNo) !==
            "2.1"
        );

      sessionStorage.setItem(
        "criteria2_current_files",
        JSON.stringify(
          updatedFiles
        )
      );

      alert(
        "2.1 files deleted successfully."
      );

    } catch (error) {
      console.error(
        "DELETE 2.1 ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Delete failed."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CLEAR
  // =========================================================
// =========================================================
// CLEAR
// =========================================================

const handleClear = () => {
  const confirmed = window.confirm(
    "Clear all 2.1 data from the current screen?"
  );

  if (!confirmed) {
    return;
  }

  // -------------------------------------------------------
  // CLEAR FILES FROM FRONTEND
  // -------------------------------------------------------

  setFiles({});

  // -------------------------------------------------------
  // CLEAR ACADEMIC INFORMATION
  // -------------------------------------------------------

  setAcademicYear("");
  setDepartment("");
  setProgram("");

  // -------------------------------------------------------
  // CLEAR ALL FILE INPUTS
  // -------------------------------------------------------

  window.document
    .querySelectorAll(
      ".quality-table .file-input"
    )
    .forEach((input) => {
      input.value = "";
    });

  // -------------------------------------------------------
  // REMOVE LOCAL STORAGE
  // -------------------------------------------------------

  localStorage.removeItem(
    "criteria2_1_files"
  );

  localStorage.removeItem(
    "criteria2_1_loaded_files"
  );

  // -------------------------------------------------------
  // REMOVE ONLY 2.1 FROM CURRENT REPORT FILES
  // -------------------------------------------------------

  const currentFiles = JSON.parse(
    sessionStorage.getItem(
      "criteria2_current_files"
    ) || "[]"
  );

  const updatedFiles = currentFiles.filter(
    (item) =>
      String(item.criteriaNo) !== "2.1"
  );

  sessionStorage.setItem(
    "criteria2_current_files",
    JSON.stringify(updatedFiles)
  );

  // -------------------------------------------------------
  // CLEAR SESSION DATA
  // -------------------------------------------------------

  sessionStorage.removeItem(
    "criteria2_1_files"
  );

  // -------------------------------------------------------
  // SUCCESS MESSAGE
  // -------------------------------------------------------

  alert(
    "All 2.1 data cleared successfully. You can upload new files now."
  );
};
  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = async () => {
    const currentFiles =
      Object.keys(files)
        .map((key) => ({
          doc: documents.find(
            (item) =>
              item.id ===
              Number(key)
          ),

          file: files[key],
        }))
        .filter(
          (item) =>
            item.doc &&
            item.file
        );

    if (
      currentFiles.length === 0
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

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <title>
          Criteria 2.1 Report
        </title>

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
            margin: 5px 0;

            font-size: 13px;

            color: #555;
          }

          .file-card {
            border:
              1px solid #ccc;

            border-radius: 6px;

            margin-bottom: 20px;

            overflow: hidden;

            page-break-inside: avoid;
          }

          .file-title {
            background: #eef4fa;

            padding: 10px 12px;

            font-size: 15px;

            font-weight: 600;

            color: #14579e;

            border-bottom:
              1px solid #ccc;
          }

          .file-body {
            padding: 12px;
          }

          .file-body p {
            font-size: 12px;

            line-height: 1.5;

            margin: 6px 0;
          }

          .pdf-view {
            width: 100%;

            height: 700px;

            border:
              1px solid #ccc;

            margin-top: 10px;
          }

          .img-view {
            display: block;

            max-width: 100%;

            max-height: 650px;

            margin:
              15px auto;

            border:
              1px solid #ccc;
          }

          .word-content {
            border:
              1px solid #ddd;

            padding: 15px;

            margin-top: 10px;

            font-size: 12px;

            line-height: 1.5;
          }

          .word-content img {
            max-width: 100%;
          }

          .excel-content {
            width: 100%;

            overflow-x: auto;

            margin-top: 10px;
          }

          .excel-content table {
            width: 100%;

            border-collapse:
              collapse;

            font-size: 10px;
          }

          .excel-content th,
          .excel-content td {
            border:
              1px solid #999;

            padding: 5px;

            text-align: left;
          }

          .unsupported {
            padding: 20px;

            background: #f8f8f8;

            border:
              1px dashed #aaa;

            margin-top: 10px;
          }

        </style>

      </head>

      <body>

        <div class="report-header">

          <h1>
            CRITERIA 2
          </h1>

          <h2>
            2.1 Quality of Teaching & Learning
          </h2>

          <p>
            Academic Year:
            ${academicYear || "N/A"}
          </p>

          <p>
            Department:
            ${department || "N/A"}
          </p>

          <p>
            Program:
            ${program || "N/A"}
          </p>

          <p>
            Current Uploaded Files:
            <strong>
              ${currentFiles.length}
            </strong>
          </p>

        </div>
    `);

    // -------------------------------------------------------
    // ADD FILES
    // -------------------------------------------------------

    for (
      const item of currentFiles
    ) {
      const row =
        item.doc;

      const file =
        item.file;

      const fileName =
        file.original_name ||
        file.name ||
        "File";

      let fileURL = "";

      if (
        file.saved &&
        file.file_name
      ) {
        fileURL =
          `http://localhost:5000/uploads/${encodeURIComponent(
            file.file_name
          )}`;
      }

      else if (file.file) {
        fileURL =
          URL.createObjectURL(
            file.file
          );
      }

      const ext =
        fileName
          .split(".")
          .pop()
          .toLowerCase();

      let previewHTML = "";

      // PDF
      if (ext === "pdf") {
        previewHTML = `
          <embed
            src="${fileURL}"
            type="application/pdf"
            class="pdf-view"
          />
        `;
      }

      // IMAGE
      else if (
        [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "webp",
        ].includes(ext)
      ) {
        previewHTML = `
          <img
            src="${fileURL}"
            class="img-view"
            alt="${fileName}"
          />
        `;
      }

      // WORD / EXCEL
      else if (
        [
          "docx",
          "xlsx",
          "xls",
        ].includes(ext)
      ) {
        previewHTML =
          await readFileContentHTML(
            file,
            ext
          );
      }

      // OTHER
      else {
        previewHTML = `
          <div class="unsupported">

            <strong>
              ${fileName}
            </strong>

            <p>
              Preview is not available
              for this file type.
            </p>

          </div>
        `;
      }

      printWindow.document.write(`

        <div class="file-card">

          <div class="file-title">

            ${row.id}.
            ${row.name}

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

              ${fileName}

            </p>

            ${previewHTML}

          </div>

        </div>

      `);
    }

    printWindow.document.write(`
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
    }, 1500);
  };

  // =========================================================
  // READ WORD / EXCEL
  // =========================================================

  const readFileContentHTML = async (
    file,
    ext
  ) => {
    let blob =
      file.file;

    // -------------------------------------------------------
    // SAVED FILE
    // -------------------------------------------------------

    if (
      !blob &&
      file.file_name
    ) {
      try {
        const response =
          await fetch(
            `http://localhost:5000/uploads/${encodeURIComponent(
              file.file_name
            )}`
          );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        blob =
          await response.blob();

      } catch (error) {
        console.error(
          "FILE FETCH ERROR:",
          error
        );

        return `
          <p style="color:red;">
            Unable to load file preview.
          </p>
        `;
      }
    }

    if (!blob) {
      return `
        <p>
          File not available.
        </p>
      `;
    }

    // -------------------------------------------------------
    // WORD
    // -------------------------------------------------------

    if (
      ext === "docx"
    ) {
      try {
        const arrayBuffer =
          await blob.arrayBuffer();

        const result =
          await mammoth.convertToHtml({
            arrayBuffer,
          });

        return `
          <div class="word-content">
            ${result.value}
          </div>
        `;

      } catch (error) {
        console.error(
          "WORD PREVIEW ERROR:",
          error
        );

        return `
          <p style="color:red;">
            Word preview failed.
          </p>
        `;
      }
    }

    // -------------------------------------------------------
    // EXCEL
    // -------------------------------------------------------

    if (
      ext === "xlsx" ||
      ext === "xls"
    ) {
      try {
        const arrayBuffer =
          await blob.arrayBuffer();

        const workbook =
          XLSX.read(
            arrayBuffer,
            {
              type: "array",
            }
          );

        if (
          !workbook.SheetNames ||
          workbook.SheetNames.length === 0
        ) {
          return `
            <p>
              Excel sheet not found.
            </p>
          `;
        }

        const firstSheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        const html =
          XLSX.utils.sheet_to_html(
            firstSheet
          );

        return `
          <div class="excel-content">
            ${html}
          </div>
        `;

      } catch (error) {
        console.error(
          "EXCEL PREVIEW ERROR:",
          error
        );

        return `
          <p style="color:red;">
            Excel preview failed.
          </p>
        `;
      }
    }

    return `
      <div class="unsupported">
        Preview not available.
      </div>
    `;
  };

  // =========================================================
  // NEXT
  // =========================================================

  const handleNext = () => {
    navigate(
      "/criteria/2.2-capstone-project"
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="quality-page">

      {/* SIDEBAR */}

      <NBASidebar />

      {/* MAIN CONTENT */}

      <div className="quality-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="quality-header">

          <div className="quality-title-section">

            <span className="quality-badge">
              2.1
            </span>

            <div>

              <h2>
                Quality of Teaching & Learning
              </h2>

              <p>
                Upload and manage Quality of
                Teaching & Learning related documents.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            ACADEMIC INFORMATION
        ================================================= */}

        <div className="quality-academic-information">

          {/* ACADEMIC YEAR */}

          <div className="quality-academic-info-field">

            <label>
              Academic Year
            </label>

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

              <option value="2025-26">
                2025-26
              </option>

              <option value="2026-27">
                2026-27
              </option>

              <option value="2027-28">
                2027-28
              </option>

              <option value="2028-29">
                2028-29
              </option>

              <option value="2029-30">
                2029-30
              </option>

            </select>

          </div>

          {/* DEPARTMENT */}

          <div className="quality-academic-info-field">

            <label>
              Department
            </label>

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

              <option value="MCA">
                MCA
              </option>

              <option value="Computer Engineering">
                Computer Engineering
              </option>

              <option value="Information Technology">
                Information Technology
              </option>

              <option value="Electronics and Telecommunication">
                Electronics and Telecommunication
              </option>

              <option value="Mechanical Engineering">
                Mechanical Engineering
              </option>

              <option value="Civil Engineering">
                Civil Engineering
              </option>

            </select>

          </div>

          {/* PROGRAM */}

          <div className="quality-academic-info-field">

            <label>
              Program
            </label>

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

              <option value="Master of Computer Applications">
                Master of Computer Applications
              </option>

              <option value="Bachelor of Computer Applications">
                Bachelor of Computer Applications
              </option>

              <option value="B.E. Computer Engineering">
                B.E. Computer Engineering
              </option>

              <option value="B.Tech Computer Engineering">
                B.Tech Computer Engineering
              </option>

              <option value="M.E. Computer Engineering">
                M.E. Computer Engineering
              </option>

            </select>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="quality-card">

          <table className="quality-table">

            <thead>

              <tr>

                <th>
                  Sr. No.
                </th>

                <th>
                  Document Name
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

              {documents.map((row) => (

                <tr key={row.id}>

                  {/* SR NO */}

                  <td className="quality-sr-no">
                    {row.id}
                  </td>

                  {/* DOCUMENT NAME */}

                  <td>

                    <div className="quality-document-name">
                      {row.name}
                    </div>

                  </td>

                  {/* DESCRIPTION */}

                  <td>

                    <textarea
                      className="quality-description-box"
                      value={
                        row.description
                      }
                      readOnly
                    />

                  </td>

                  {/* ACTION */}

                  <td>

                    <div className="quality-attachment-box">

                      {/* FILE INPUT */}

                      <input
                        type="file"
                        className="file-input"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            row
                          )
                        }
                      />

                      {/* SELECTED FILE NAME */}

                      {files[row.id] && (

                        <div className="quality-uploaded-file-name">

                          <span className="file-name-text">

                            {files[row.id]
                              .original_name ||
                              files[row.id]
                                .name ||
                              "File selected"}

                          </span>

                        </div>

                      )}

                      {/* VIEW + DOWNLOAD
                          ALWAYS VISIBLE */}

                      <div className="quality-action-buttons">

                        <button
                          type="button"
                          className="quality-view-btn"
                          onClick={() =>
                            handleView(row)
                          }
                        >

                          <FaEye />

                          <span>
                            View
                          </span>

                        </button>

                        <button
                          type="button"
                          className="quality-download-btn"
                          onClick={() =>
                            handleDownload(row)
                          }
                        >

                          <FaDownload />

                          <span>
                            Download
                          </span>

                        </button>

                      </div>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* =================================================
            BOTTOM BUTTONS
            ALL ALWAYS ENABLED
        ================================================= */}

        <div className="quality-bottom-buttons">

          {/* SAVE */}

          <button
            type="button"
            className="quality-save-btn"
            onClick={handleSave}
          >
            Save
          </button>

          {/* DELETE */}

          <button
            type="button"
            className="quality-delete-btn"
            onClick={handleDelete}
          >
            Delete
          </button>

          {/* PRINT */}

          <button
            type="button"
            className="quality-print-btn"
            onClick={handlePrint}
          >
            Print
          </button>

          {/* CLEAR */}

          <button
            type="button"
            className="quality-clear-btn"
            onClick={handleClear}
          >
            Clear
          </button>

          {/* NEXT */}

          <button
            type="button"
            className="quality-next-btn"
            onClick={handleNext}
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}

export default QualityTeachingLearning;