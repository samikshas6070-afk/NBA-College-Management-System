import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import mammoth from "mammoth";
import * as XLSX from "xlsx";

import NBASidebar from "../Pages/NBASidebar";

import {
  FaEye,
  FaDownload,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTrash,
  FaBroom,
} from "react-icons/fa";

import "./IndustryInstitutePartnership.css";

function IndustryInstitutePartnership() {

  const navigate = useNavigate();

  // ==========================================
  // Rows
  // ==========================================

  const rows = [
    {
      id: 1,
      documentName:
        "Industry Course Involvement",
      description:
        "Industry involvement in course delivery.",
    },
    {
      id: 2,
      documentName:
        "Industry Offered Courses/Training ",
      description:
        "Industry courses and training records.",
    },
    {
      id: 3,
      documentName:
        "Industry-Supported Laboratories ",
      description:
        "Industry-supported laboratory details.",
    },
    {
      id: 4,
      documentName:
        "Impact Analysis & Actions ",
      description:
        "Impact analysis and action reports.",
    },
  ];

  // ==========================================
  // States
  // ==========================================

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Create Session ID
  // ==========================================

  useEffect(() => {

    let sessionId = localStorage.getItem(
      "criteria2_session_id"
    );

    if (!sessionId) {

      sessionId = Date.now().toString();

      localStorage.setItem(
        "criteria2_session_id",
        sessionId
      );

    }

    console.log(
      "SESSION ID :",
      sessionId
    );

  }, []);

  // ==========================================
  // Load Saved Files
  // ==========================================

  useEffect(() => {

    loadFiles();

  }, []);

  const loadFiles = async () => {

    try {

      const sessionId =
        localStorage.getItem(
          "criteria2_session_id"
        );

      if (!sessionId)
        return;

      const res =
        await axios.get(
          "http://localhost:5000/criteria/files/2.8",
          {
            params: {
              session_id: sessionId
            }
          }
        );

      const data =
        Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

      const loadedFiles = {};

      data.forEach((item) => {

        const row = rows.find(
          (r) =>
            r.documentName.trim() ===
            item.document_name.trim()
        );

        if (row) {

          loadedFiles[row.id] = {

            saved: true,

            file_name:
              item.file_name,

            original_name:
              item.original_file_name ||
              item.file_name,

            session_id:
              sessionId

          };

        }

      });

      setFiles(loadedFiles);

    }

    catch (err) {

      console.log(
        "Load Files Error",
        err
      );

    }

  };

  //=================
  //Previous
  //=================

  const handlePrevious = () => {
    navigate("/complex-problems");
  };

  // ==========================================
  // Upload
  // ==========================================

  const handleUpload = async (e, item) => {

    const file = e.target.files[0];

    if (!file)
      return;

    let sessionId =
      localStorage.getItem(
        "criteria2_session_id"
      );

    if (!sessionId) {

      sessionId =
        Date.now().toString();

      localStorage.setItem(
        "criteria2_session_id",
        sessionId
      );

    }

    // ==========================================
    // CURRENT PAGE STATE
    // ==========================================

    setFiles((prev) => ({

      ...prev,

      [item.id]: {

        file: file,

        name: file.name,

        original_name: file.name,

        saved: false,

        session_id: sessionId,

      },

    }));

    // ==========================================
    // STORE CURRENT FILE FOR REPORT
    // ==========================================

    const reader =
      new FileReader();

    reader.onload = () => {

      try {

        const existingFiles =
          JSON.parse(
            sessionStorage.getItem(
              "criteria2_current_files"
            )
          ) || [];

        // Remove previous same document

        const filteredFiles =
          existingFiles.filter(
            (savedItem) =>
              !(
                String(savedItem.criteriaNo) === "2.8" &&
                savedItem.documentName?.trim() ===
                  item.documentName.trim()
              )
          );

        filteredFiles.push({

          criteriaNo: "2.8",

          documentName:
            item.documentName,

          description:
            item.description,

          fileName:
            file.name,

          fileType:
            file.type,

          fileData:
            reader.result,

          session_id:
            sessionId,

        });

        sessionStorage.setItem(
          "criteria2_current_files",
          JSON.stringify(
            filteredFiles
          )
        );

        console.log(
          "CURRENT 2.8 FILE ADDED:",
          file.name
        );

      }

      catch (error) {

        console.error(
          "CURRENT FILE STORAGE ERROR:",
          error
        );

      }

    };

    reader.readAsDataURL(file);

  };

  // ==========================================
  // View File
  // ==========================================

  const handleView = (item) => {

    const fileData =
      files[item.id];

    if (!fileData) {

      alert(
        "Please upload file first"
      );

      return;

    }

    let fileURL = "";

    if (fileData.saved) {

      fileURL =
        `http://localhost:5000/uploads/${fileData.file_name}`;

    }

    else if (fileData.file) {

      fileURL =
        URL.createObjectURL(
          fileData.file
        );

    }

    else {

      alert(
        "File not available"
      );

      return;

    }

    window.open(
      fileURL,
      "_blank"
    );

  };

  // ==========================================
  // Download File
  // ==========================================

  const handleDownload = (item) => {

    const fileData =
      files[item.id];

    if (!fileData) {

      alert(
        "Please upload file first"
      );

      return;

    }

    let fileURL = "";

    if (fileData.saved) {

      fileURL =
        `http://localhost:5000/uploads/${fileData.file_name}`;

    }

    else if (fileData.file) {

      fileURL =
        URL.createObjectURL(
          fileData.file
        );

    }

    else {

      alert(
        "File not available"
      );

      return;

    }

    const link =
      document.createElement("a");

    link.href =
      fileURL;

    link.download =
      fileData.original_name ||
      fileData.name ||
      "download";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

  };

  // ==========================================
  // Save Files
  // ==========================================

  const handleSave = async () => {

    try {

      const uploadedDocs =
        Object.keys(files);

      if (
        uploadedDocs.length === 0
      ) {

        alert(
          "Please upload file first"
        );

        return;

      }

      let sessionId =
        localStorage.getItem(
          "criteria2_session_id"
        );

      if (!sessionId) {

        sessionId =
          Date.now().toString();

        localStorage.setItem(
          "criteria2_session_id",
          sessionId
        );

      }

      let savedCount = 0;

      let alreadySavedCount = 0;

      for (
        const key of uploadedDocs
      ) {

        const fileData =
          files[key];

        if (fileData.saved) {

          alreadySavedCount++;

          continue;

        }

        const row =
          rows.find(
            (d) =>
              d.id === Number(key)
          );

        if (!row)
          continue;

        const formData =
          new FormData();

        formData.append(
          "file",
          fileData.file
        );

        formData.append(
          "criteriaNo",
          "2.8"
        );

        formData.append(
          "documentName",
          row.documentName
        );

        formData.append(
          "description",
          row.description
        );

        formData.append(
          "session_id",
          sessionId
        );

        const res =
          await axios.post(
            "http://localhost:5000/criteria/upload",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data"
              }
            }
          );

        if (
          res.data.success
        ) {

          setFiles(
            (prev) => ({

              ...prev,

              [key]: {

                ...prev[key],

                saved: true,

                file_name:
                  res.data.data.file_name,

                original_name:
                  fileData.file.name,

                session_id:
                  sessionId,

              },

            })
          );

          savedCount++;

        }

      }

      if (
        savedCount > 0
      ) {

        alert(
          "Files Saved Successfully"
        );

      }

      else if (
        alreadySavedCount > 0
      ) {

        alert(
          "Files Already Saved"
        );

      }

    }

    catch (err) {

      console.log(
        "SAVE ERROR",
        err
      );

      alert(
        "Save Failed"
      );

    }

  };

  // ==========================================
  // Delete Files
  // ==========================================

  const handleDelete = async () => {

    try {

      if (
        Object.keys(files).length === 0
      ) {

        alert(
          "No files available to delete."
        );

        return;

      }

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete all files?"
        );

      if (!confirmDelete)
        return;

      let sessionId =
        localStorage.getItem(
          "criteria2_session_id"
        );

      await axios.delete(
        "http://localhost:5000/criteria/deleteAll/2.8",
        {
          params: {
            session_id:
              sessionId
          }
        }
      );

      setFiles({});

      document
        .querySelectorAll(
          ".file-input"
        )
        .forEach(
          (input) =>
            input.value = ""
        );

      alert(
        "Deleted Successfully"
      );

    }

    catch (err) {

      console.log(err);

      alert(
        "Delete Failed"
      );

    }

  };

  // ==========================================================
  // CONVERT BLOB TO BASE64
  // ==========================================================

  const blobToBase64 = (blob) => {

    return new Promise(
      (resolve, reject) => {

        const reader =
          new FileReader();

        reader.onloadend = () =>
          resolve(
            reader.result
          );

        reader.onerror =
          reject;

        reader.readAsDataURL(
          blob
        );

      }
    );

  };

  // ==========================================================
  // GET CURRENT REPORT FILES
  //
  // IMPORTANT:
  // DATABASE ALL FILES ARE NOT USED.
  //
  // ONLY CURRENT SESSION / CURRENT TRACKED FILES.
  // ==========================================================

  const getCurrentReportFiles =
    async () => {

      const criteriaOrder = [
        "2.1",
        "2.2",
        "2.3",
        "2.4",
        "2.5",
        "2.6",
        "2.7",
        "2.8",
      ];

      const sessionId =
        localStorage.getItem(
          "criteria2_session_id"
        );

      // ==========================================
      // 1. SESSION STORAGE
      // ==========================================

      let sessionFiles =
        JSON.parse(
          sessionStorage.getItem(
            "criteria2_current_files"
          ) || "[]"
        );

      console.log(
        "SESSION STORAGE CURRENT FILES:",
        sessionFiles
      );

      // ==========================================
      // ONLY CURRENT CRITERIA
      // ==========================================

      sessionFiles =
        sessionFiles.filter(
          (item) =>
            criteriaOrder.includes(
              String(item.criteriaNo)
            ) &&
            item.fileData
        );

      // ==========================================
      // 2. LOCAL STORAGE CURRENT FILE TRACKING
      // ==========================================

      let recentFiles =
        JSON.parse(
          localStorage.getItem(
            "recentUploadedFiles"
          ) || "[]"
        );

      recentFiles =
        recentFiles.filter(
          (item) =>
            criteriaOrder.includes(
              String(item.criteriaNo)
            )
        );

      console.log(
        "RECENT CURRENT FILES:",
        recentFiles
      );

      // ==========================================
      // MERGE SESSION FILES
      // ==========================================

      const finalFiles = [
        ...sessionFiles
      ];

      // ==========================================
      // ADD CURRENT TRACKED FILES IF NOT PRESENT
      // ==========================================

      for (
        const recent of recentFiles
      ) {

        const criteriaNo =
          String(
            recent.criteriaNo
          );

        const documentName =
          (
            recent.documentName ||
            recent.document_name ||
            ""
          ).trim();

        const alreadyExists =
          finalFiles.some(
            (item) =>
              String(
                item.criteriaNo
              ) === criteriaNo &&
              (
                item.documentName ||
                ""
              ).trim() === documentName
          );

        if (
          alreadyExists
        ) {
          continue;
        }

        // ----------------------------------------
        // If recent item already contains data
        // ----------------------------------------

        if (
          recent.fileData
        ) {

          finalFiles.push({

            criteriaNo:
              criteriaNo,

            documentName:
              documentName,

            description:
              recent.description ||
              "",

            fileName:
              recent.fileName ||
              recent.file_name ||
              "Uploaded File",

            fileType:
              recent.fileType ||
              "",

            fileData:
              recent.fileData,

            session_id:
              sessionId,

          });

          continue;

        }

        // ----------------------------------------
        // If no fileData, use exact current
        // session file from backend.
        //
        // This does NOT take all DB files.
        // It only checks the current tracked file.
        // ----------------------------------------

        try {

          const endpoint =
            `http://localhost:5000/criteria/files/${criteriaNo}`;

          const response =
            await axios.get(
              endpoint,
              {
                params: {
                  session_id:
                    sessionId
                }
              }
            );

          const backendData =
            Array.isArray(
              response.data
            )
              ? response.data
              : response.data?.data || [];

          const matchedFile =
            backendData.find(
              (dbFile) => {

                const dbDocument =
                  (
                    dbFile.document_name ||
                    ""
                  ).trim();

                const recentDocument =
                  documentName;

                return (
                  dbDocument ===
                  recentDocument
                );

              }
            );

          if (
            matchedFile &&
            matchedFile.file_name
          ) {

            try {

              const fileURL =
                `http://localhost:5000/uploads/${matchedFile.file_name}`;

              const fileResponse =
                await fetch(
                  fileURL
                );

              if (
                fileResponse.ok
              ) {

                const blob =
                  await fileResponse.blob();

                const base64 =
                  await blobToBase64(
                    blob
                  );

                finalFiles.push({

                  criteriaNo:
                    criteriaNo,

                  documentName:
                    documentName,

                  description:
                    recent.description ||
                    matchedFile.description ||
                    "",

                  fileName:
                    recent.fileName ||
                    recent.file_name ||
                    matchedFile.original_file_name ||
                    matchedFile.file_name,

                  fileType:
                    recent.fileType ||
                    blob.type ||
                    "",

                  fileData:
                    base64,

                  session_id:
                    sessionId,

                });

              }

            }

            catch (
              fileError
            ) {

              console.error(
                "CURRENT FILE DOWNLOAD ERROR:",
                fileError
              );

            }

          }

        }

        catch (
          backendError
        ) {

          console.error(
            `CURRENT ${criteriaNo} FILE FETCH ERROR:`,
            backendError
          );

        }

      }

      // ==========================================
      // REMOVE DUPLICATES
      // ==========================================

      const uniqueFiles = [];

      finalFiles.forEach(
        (item) => {

          const key =
            `${String(
              item.criteriaNo
            )}_${(
              item.documentName ||
              ""
            ).trim()}`;

          const exists =
            uniqueFiles.some(
              (existing) =>
                `${String(
                  existing.criteriaNo
                )}_${(
                  existing.documentName ||
                  ""
                ).trim()}` === key
            );

          if (
            !exists
          ) {

            uniqueFiles.push(
              item
            );

          }

        }
      );

      // ==========================================
      // FINAL ORDER 2.1 TO 2.8
      // ==========================================

      uniqueFiles.sort(
        (a, b) => {

          const ca =
            criteriaOrder.indexOf(
              String(
                a.criteriaNo
              )
            );

          const cb =
            criteriaOrder.indexOf(
              String(
                b.criteriaNo
              )
            );

          return ca - cb;

        }
      );

      console.log(
        "FINAL CURRENT REPORT FILES:",
        uniqueFiles
      );

      return uniqueFiles;

    };

  // ==========================================================
  // GENERATE CURRENT FILE REPORT
  //
  // ONLY CURRENT 2.1 TO 2.8 FILES
  // ==========================================================

  const handleGenerateReport =
    async () => {

      let reportWindow = null;

      try {

        // ==========================================
        // OPEN WINDOW
        // ==========================================

        reportWindow =
          window.open(
            "",
            "_blank"
          );

        if (
          !reportWindow
        ) {

          alert(
            "Please disable your browser's Pop-up blocker!"
          );

          return;

        }

        // ==========================================
        // LOADING SCREEN
        // ==========================================

        reportWindow.document.write(`

          <!DOCTYPE html>

          <html>

          <head>

            <title>
              Criteria 2 Current Report
            </title>

          </head>

          <body
            style="
              font-family:Arial;
              text-align:center;
              margin-top:100px;
            "
          >

            <h2>
              Generating Criteria 2 Report...
            </h2>

            <p>
              Collecting current uploaded files
              from Criteria 2.1 to 2.8...
            </p>

          </body>

          </html>

        `);

        // ==========================================
        // GET CURRENT FILES
        // ==========================================

        const currentFiles =
          await getCurrentReportFiles();

        console.log(
          "REPORT CURRENT FILES:",
          currentFiles
        );

        // ==========================================
        // CHECK
        // ==========================================

        if (
          !currentFiles ||
          currentFiles.length === 0
        ) {

          reportWindow.close();

          alert(
            "No current uploaded files found for Criteria 2.1 to 2.8."
          );

          return;

        }

        // ==========================================
        // TITLES
        // ==========================================

        const criteriaTitles = {

          "2.1":
            "Quality of Teaching & Learning",

          "2.2":
            "Capstone Project",

          "2.3":
            "Internship",

          "2.4":
            "Seminar & Mini Project",

          "2.5":
            "Case Study & Real Life Example",

          "2.6":
            "NPTEL & SWAYAM",

          "2.7":
            "Solving Complex Engineering Problems",

          "2.8":
            "Industry Institute Partnership",

        };

        const criteriaOrder = [

          "2.1",
          "2.2",
          "2.3",
          "2.4",
          "2.5",
          "2.6",
          "2.7",
          "2.8",

        ];

        // ==========================================
        // MAIN REPORT HTML
        // ==========================================

        let reportHTML = "";

        reportHTML += `

          <div class="main-header">

            <h1>
              CRITERIA 2
            </h1>

            <h2>
              Teaching-Learning and Student Performance
            </h2>

            <p>
              Current Uploaded Files Report
            </p>

            <div class="total-files">

              Total Current Files:
              <strong>
                ${currentFiles.length}
              </strong>

            </div>

          </div>

        `;

        // ==========================================
        // CRITERIA LOOP
        // ==========================================

        for (
          const criteriaNo of criteriaOrder
        ) {

          const criteriaFiles =
            currentFiles.filter(
              (file) =>
                String(
                  file.criteriaNo
                ) === criteriaNo
            );

          if (
            criteriaFiles.length === 0
          ) {

            continue;

          }

          reportHTML += `

            <div class="criteria-section">

              <div class="criteria-header">

                <span class="criteria-number">

                  ${criteriaNo}

                </span>

                <span>

                  ${
                    criteriaTitles[
                      criteriaNo
                    ]
                  }

                </span>

              </div>

          `;

          // ==========================================
          // FILE LOOP
          // ==========================================

          for (
            let index = 0;
            index < criteriaFiles.length;
            index++
          ) {

            const item =
              criteriaFiles[index];

            const fileName =
              item.fileName ||
              item.file_name ||
              "Uploaded File";

            const fileData =
              item.fileData ||
              "";

            const extension =
              fileName
                .split(".")
                .pop()
                .toLowerCase();

            let previewHTML = "";

            // ==========================================
            // PDF
            // ==========================================

            if (
              extension === "pdf" &&
              fileData
            ) {

              previewHTML = `

                <div class="pdf-container">

                  <embed
                    src="${fileData}"
                    type="application/pdf"
                    class="pdf-preview"
                  />

                  <div class="pdf-note">

                    PDF file is included in the
                    current report.

                  </div>

                </div>

              `;

            }

            // ==========================================
            // IMAGE
            // ==========================================

            else if (

              [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "webp",
                "svg"
              ].includes(
                extension
              ) &&
              fileData

            ) {

              previewHTML = `

                <div class="image-container">

                  <img
                    src="${fileData}"
                    class="image-preview"
                    alt="${fileName}"
                  />

                </div>

              `;

            }

            // ==========================================
            // DOCX
            // ==========================================

            else if (

              extension === "docx" &&
              fileData

            ) {

              try {

                const base64 =
                  fileData
                    .split(",")[1];

                const binary =
                  atob(
                    base64
                  );

                const arrayBuffer =
                  new ArrayBuffer(
                    binary.length
                  );

                const uint8Array =
                  new Uint8Array(
                    arrayBuffer
                  );

                for (
                  let i = 0;
                  i < binary.length;
                  i++
                ) {

                  uint8Array[i] =
                    binary.charCodeAt(i);

                }

                const result =
                  await mammoth.convertToHtml({

                    arrayBuffer:
                      arrayBuffer,

                  });

                previewHTML = `

                  <div class="word-preview">

                    ${result.value}

                  </div>

                `;

              }

              catch (
                error
              ) {

                console.error(
                  "WORD PREVIEW ERROR:",
                  error
                );

                previewHTML = `

                  <div class="unsupported-file">

                    <strong>
                      Word File:
                    </strong>

                    ${fileName}

                    <br />

                    Unable to extract Word text.

                  </div>

                `;

              }

            }

            // ==========================================
            // XLSX / XLS / CSV
            // ==========================================

            else if (

              [
                "xlsx",
                "xls",
                "csv"
              ].includes(
                extension
              ) &&
              fileData

            ) {

              try {

                const base64 =
                  fileData
                    .split(",")[1];

                const binary =
                  atob(
                    base64
                  );

                const arrayBuffer =
                  new ArrayBuffer(
                    binary.length
                  );

                const uint8Array =
                  new Uint8Array(
                    arrayBuffer
                  );

                for (
                  let i = 0;
                  i < binary.length;
                  i++
                ) {

                  uint8Array[i] =
                    binary.charCodeAt(i);

                }

                const workbook =
                  XLSX.read(
                    arrayBuffer,
                    {
                      type:
                        "array"
                    }
                  );

                let allSheetsHTML =
                  "";

                workbook.SheetNames.forEach(
                  (
                    sheetName
                  ) => {

                    const sheet =
                      workbook.Sheets[
                        sheetName
                      ];

                    const html =
                      XLSX.utils.sheet_to_html(
                        sheet
                      );

                    allSheetsHTML += `

                      <div class="excel-sheet">

                        <div class="sheet-title">

                          Sheet:
                          ${sheetName}

                        </div>

                        ${html}

                      </div>

                    `;

                  }
                );

                previewHTML = `

                  <div class="excel-preview">

                    ${allSheetsHTML}

                  </div>

                `;

              }

              catch (
                error
              ) {

                console.error(
                  "EXCEL PREVIEW ERROR:",
                  error
                );

                previewHTML = `

                  <div class="unsupported-file">

                    <strong>
                      Excel File:
                    </strong>

                    ${fileName}

                    <br />

                    Unable to extract Excel data.

                  </div>

                `;

              }

            }

            // ==========================================
            // DOC / PPT / PPTX
            // ==========================================

            else {

              previewHTML = `

                <div class="unsupported-file">

                  <p>

                    <strong>
                      Current Uploaded File:
                    </strong>

                    ${fileName}

                  </p>

                  <p>

                    This file belongs to the
                    current Criteria ${criteriaNo}
                    upload session.

                  </p>

                  <p>

                    Browser text extraction is
                    not available for this file type.

                  </p>

                </div>

              `;

            }

            // ==========================================
            // FILE CARD
            // ==========================================

            reportHTML += `

              <div class="file-card">

                <div class="card-title">

                  ${index + 1}.
                  ${
                    item.documentName ||
                    item.document_name ||
                    "Document"
                  }

                </div>

                <div class="card-body">

                  <p>

                    <strong>
                      Description:
                    </strong>

                    ${
                      item.description ||
                      "No description provided"
                    }

                  </p>

                  <p>

                    <strong>
                      Uploaded Document:
                    </strong>

                    ${fileName}

                  </p>

                  <div class="content-preview">

                    <div class="preview-title">

                      Complete Document Content

                    </div>

                    ${previewHTML}

                  </div>

                </div>

              </div>

            `;

          }

          reportHTML += `

            </div>

          `;

        }

        // ==========================================
        // FINAL REPORT
        // ==========================================

        reportWindow.document.open();

        reportWindow.document.write(`

          <!DOCTYPE html>

          <html>

          <head>

            <title>
              Criteria 2 - Current Report
            </title>

            <style>

              @page {

                size:A4;

                margin:12mm 10mm;

              }

              * {

                box-sizing:border-box;

              }

              body {

                font-family:
                  "Segoe UI",
                  Arial,
                  sans-serif;

                color:#333;

                background:#fff;

                margin:0;

                padding:0;

              }

              .main-header {

                text-align:center;

                border-bottom:
                  3px solid #00133e;

                padding-bottom:15px;

                margin-bottom:20px;

              }

              .main-header h1 {

                margin:0;

                color:#00133e;

                font-size:22px;

              }

              .main-header h2 {

                margin:8px 0;

                color:#00133e;

                font-size:17px;

              }

              .main-header p {

                margin:5px 0;

                font-size:13px;

                color:#555;

              }

              .total-files {

                margin-top:12px;

                padding:8px;

                background:#f1f5f9;

                border:
                  1px solid #cbd5e1;

                border-radius:5px;

                font-size:13px;

              }

              .criteria-section {

                margin-bottom:25px;

              }

              .criteria-header {

                display:flex;

                align-items:center;

                gap:10px;

                background:#00133e;

                color:#fff;

                padding:10px 12px;

                border-radius:5px;

                font-size:15px;

                font-weight:600;

                margin-bottom:12px;

                page-break-after:avoid;

              }

              .criteria-number {

                background:#fff;

                color:#00133e;

                padding:4px 8px;

                border-radius:4px;

                font-weight:bold;

              }

              .file-card {

                border:
                  1px solid #cbd5e0;

                border-radius:6px;

                margin-bottom:15px;

                overflow:hidden;

                page-break-inside:auto;

              }

              .card-title {

                background:#edf2f7;

                color:#00133e;

                padding:9px 12px;

                font-weight:600;

                font-size:13px;

                border-bottom:
                  1px solid #cbd5e0;

              }

              .card-body {

                padding:11px;

                background:#fff;

              }

              .card-body p {

                margin:5px 0;

                font-size:12px;

                line-height:1.5;

              }

              .content-preview {

                margin-top:10px;

                padding-top:10px;

                border-top:
                  1px dashed #cbd5e1;

              }

              .preview-title {

                font-weight:600;

                font-size:12px;

                margin-bottom:8px;

                color:#00133e;

              }

              .pdf-container {

                width:100%;

              }

              .pdf-preview {

                width:100%;

                height:700px;

                border:
                  1px solid #cbd5e1;

                border-radius:4px;

              }

              .pdf-note {

                margin-top:6px;

                padding:7px;

                background:#f8fafc;

                border:
                  1px dashed #cbd5e1;

                font-size:10px;

                color:#64748b;

              }

              .image-container {

                text-align:center;

                width:100%;

              }

              .image-preview {

                max-width:100%;

                max-height:700px;

                display:block;

                margin:8px auto;

                border:
                  1px solid #cbd5e1;

                border-radius:4px;

              }

              .word-preview {

                padding:12px;

                border:
                  1px solid #cbd5e1;

                border-radius:4px;

                font-size:12px;

                line-height:1.6;

                background:#fff;

                overflow-wrap:break-word;

              }

              .word-preview p {

                font-size:12px;

                margin:7px 0;

              }

              .word-preview table {

                width:100%;

                border-collapse:collapse;

              }

              .word-preview table td,
              .word-preview table th {

                border:
                  1px solid #cbd5e1;

                padding:5px;

              }

              .word-preview img {

                max-width:100%;

                height:auto;

              }

              .excel-preview {

                width:100%;

                overflow-x:auto;

              }

              .excel-sheet {

                margin-bottom:20px;

                page-break-inside:auto;

              }

              .sheet-title {

                font-weight:600;

                font-size:12px;

                color:#00133e;

                background:#f1f5f9;

                padding:7px;

                border:
                  1px solid #cbd5e1;

                border-bottom:none;

              }

              .excel-sheet table {

                width:100%;

                border-collapse:collapse;

                font-size:10px;

              }

              .excel-sheet th,
              .excel-sheet td {

                border:
                  1px solid #cbd5e1;

                padding:4px 5px;

                text-align:left;

                vertical-align:top;

              }

              .excel-sheet th {

                font-weight:600;

                background:#f8fafc;

              }

              .unsupported-file {

                padding:12px;

                background:#f8fafc;

                border:
                  1px dashed #cbd5e1;

                border-radius:4px;

                font-size:12px;

                line-height:1.5;

              }

              @media print {

                body {

                  padding:0;

                }

                .criteria-header {

                  break-after:avoid;

                }

                .file-card {

                  break-inside:auto;

                }

                .pdf-preview {

                  height:90vh;

                }

              }

            </style>

          </head>

          <body>

            ${reportHTML}

          </body>

          </html>

        `);

        reportWindow.document.close();

        reportWindow.focus();

        // ==========================================
        // PRINT
        // ==========================================

        setTimeout(() => {

          try {

            reportWindow.focus();

            reportWindow.print();

          }

          catch (
            error
          ) {

            console.error(
              "PRINT ERROR:",
              error
            );

          }

        }, 4000);

      }

      catch (
        error
      ) {

        console.error(
          "CURRENT REPORT ERROR:",
          error
        );

        if (
          reportWindow &&
          !reportWindow.closed
        ) {

          reportWindow.close();

        }

        alert(
          "Failed to generate current Criteria 2 report."
        );

      }

    };

  // ==========================================
  // Clear Files
  // ==========================================

  const handleClear = async () => {

    try {

      if (
        Object.keys(files).length === 0
      ) {

        alert(
          "No files available to clear."
        );

        return;

      }

      const confirmClear =
        window.confirm(
          "Are you sure you want to clear all files?"
        );

      if (!confirmClear)
        return;

      let sessionId =
        localStorage.getItem(
          "criteria2_session_id"
        );

      await axios.delete(
        "http://localhost:5000/criteria/deleteAll/2.8",
        {
          params: {
            session_id:
              sessionId
          }
        }
      );

      // ==========================================
      // CLEAR STATE
      // ==========================================

      setFiles({});

      // ==========================================
      // CLEAR INPUT
      // ==========================================

      document
        .querySelectorAll(
          ".file-input"
        )
        .forEach(
          (input) => {

            input.value = "";

          }
        );

      // ==========================================
      // REMOVE RECENT FILES
      // ==========================================

      let recentFiles =
        JSON.parse(
          localStorage.getItem(
            "recentUploadedFiles"
          )
        ) || [];

      recentFiles =
        recentFiles.filter(
          (item) =>
            item.criteriaNo !==
            "2.8"
        );

      localStorage.setItem(
        "recentUploadedFiles",
        JSON.stringify(
          recentFiles
        )
      );

      // ==========================================
      // REMOVE CURRENT REPORT 2.8 FILES
      // ==========================================

      const currentReportFiles =
        JSON.parse(
          localStorage.getItem(
            "criteria2_current_report_files"
          ) || "[]"
        );

      const updatedReportFiles =
        currentReportFiles.filter(
          (item) =>
            item.criteriaNo !==
            "2.8"
        );

      localStorage.setItem(
        "criteria2_current_report_files",
        JSON.stringify(
          updatedReportFiles
        )
      );

      // ==========================================
      // REMOVE 2.8 FROM CURRENT SESSION REPORT
      // ==========================================

      const currentFiles =
        JSON.parse(
          sessionStorage.getItem(
            "criteria2_current_files"
          ) || "[]"
        );

      const updatedCurrentFiles =
        currentFiles.filter(
          (item) =>
            item.criteriaNo !==
            "2.8"
        );

      sessionStorage.setItem(
        "criteria2_current_files",
        JSON.stringify(
          updatedCurrentFiles
        )
      );

      alert(
        "Files Cleared Successfully"
      );

    }

    catch (err) {

      console.log(
        "CLEAR ERROR",
        err
      );

      alert(
        "Clear Failed"
      );

    }

  };

  return (

    <div className="main-container">

      <NBASidebar />

      <div className="industry-container">

        {/* Header */}

        <div className="industry-header">

          <div className="industry-title-section">

            <span className="industry-badge">

              2.8

            </span>

            <div>

              <h2>

                Steps Taken for Enhancing Industry Institute Partnership

              </h2>

              <p>

                Upload and manage industry institute partnership documents.

              </p>

            </div>

          </div>

        </div>

        {/* Table */}

        <div className="industry-card">

          <table className="industry-table">

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

              {rows.map(

                (item) => (

                  <tr

                    key={item.id}

                  >

                    <td>

                      {item.id}

                    </td>

                    <td>

                      {item.documentName}

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

                    <td>

                      <div className="attachment-box">

                        <input

                          type="file"

                          className="file-input"

                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"

                          onChange={(e) =>

                            handleUpload(

                              e,

                              item

                            )

                          }

                        />

                        {files[item.id] && (

                          <div

                            style={{

                              marginTop:
                                "8px",

                              color:
                                "green",

                              fontWeight:
                                "600",

                              fontSize:
                                "13px",

                              wordBreak:
                                "break-word",

                            }}

                          >

                            📄{" "}

                            {

                              files[
                                item.id
                              ].saved

                                ?

                                files[
                                  item.id
                                ].original_name

                                :

                                files[
                                  item.id
                                ].name

                            }

                          </div>

                        )}

                        <div className="industry-action-buttons">

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

                )

              )}

            </tbody>

          </table>

        </div>

        {/* =====================================================
            BOTTOM BUTTONS
        ===================================================== */}

        <div className="industry-bottom-buttons">

          <button
            type="button"
            className="industry-btn industry-previous-btn"
            onClick={handlePrevious}
          >
            Previous
          </button>

          <button

            type="button"

            className="industry-btn industry-back-btn"

            onClick={() =>

              navigate(

                "/criteria/2.1-quality-teaching-learning"

              )

            }

          >

            <FaArrowLeft />

            Back

          </button>

          <button

            type="button"

            className="industry-btn industry-save-btn"

            onClick={

              handleSave

            }

            disabled={

              loading

            }

          >

            <FaSave />

            {

              loading

                ? "Saving..."

                : "Save"

            }

          </button>

          <button

            type="button"

            className="industry-btn industry-delete-btn"

            onClick={

              handleDelete

            }

          >

            <FaTrash />

            Delete

          </button>

          <button

            type="button"

            className="industry-btn industry-clear-btn"

            onClick={

              handleClear

            }

          >

            <FaBroom />

            Clear

          </button>

          <button

            type="button"

            className="industry-btn industry-report-btn"

            onClick={

              handleGenerateReport

            }

          >

            Generate Report

          </button>

          <button

            type="button"

            className="industry-btn industry-next-btn"

            onClick={() =>

              navigate(

                "/criteria/2.8-industry-partnership"

              )

            }

          >

            Next

            <FaArrowRight />

          </button>

        </div>

      </div>

    </div>

  );

}

export default IndustryInstitutePartnership;