import React, { useState } from "react";
import axios from "axios";
import NBASidebar from "../Pages/NBASidebar";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

import {
  FaEye,
  FaDownload,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTrash,
  FaPrint,
  FaBroom,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./LaboratoryWorkshop.css";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API = "http://localhost:5000";

const SESSION_KEY = "criteria3_session_id";

/* =========================================================
   COMPONENT
========================================================= */

function LaboratoryWorkshop() {
  const navigate = useNavigate();

  const [files, setFiles] = useState({});

  /* =========================================================
     DOCUMENTS
  ========================================================= */

  const documents = [
    {
      id: 1,
      documentName: "Lab Evaluation",
      description:
        "Evaluation of experiments conducted in workshops/laboratories",
    },
    {
      id: 2,
      documentName: "Rubrics Assessment",
      description:
        "Use of rubrics for assessing student performance with relevance to COs/POs",
    },
  ];

  /* =========================================================
     VIEW
  ========================================================= */

  const handleView = async (row) => {
    try {
      /* -----------------------------------------------------
         CURRENTLY SELECTED FILE
      ----------------------------------------------------- */

      if (files[row.id]) {
        const localURL = URL.createObjectURL(files[row.id]);

        window.open(localURL, "_blank");

        setTimeout(() => {
          URL.revokeObjectURL(localURL);
        }, 10000);

        return;
      }

      /* -----------------------------------------------------
         SESSION ID
      ----------------------------------------------------- */

      const session_id = localStorage.getItem(SESSION_KEY);

      if (!session_id) {
        alert("Session ID not found.");
        return;
      }

      /* -----------------------------------------------------
         GET SAVED FILES
      ----------------------------------------------------- */

      const res = await axios.get(
        `${API}/criteria3/files/3.3`,
        {
          params: {
            session_id,
          },
        }
      );

      const savedFiles = Array.isArray(res.data?.files)
        ? res.data.files
        : Array.isArray(res.data)
        ? res.data
        : [];

      /* -----------------------------------------------------
         FIND REQUIRED DOCUMENT
      ----------------------------------------------------- */

      const file = savedFiles.find(
        (f) =>
          String(f.document_name || "").trim() ===
          String(row.documentName || "").trim()
      );

      if (!file) {
        alert("No File Found");
        return;
      }

      /* -----------------------------------------------------
         OPEN BACKEND VIEW URL
      ----------------------------------------------------- */

      if (!file.file_name) {
        alert("File name not available.");
        return;
      }

      const viewURL =
        `${API}/criteria3/view/3.3/` +
        `${encodeURIComponent(file.file_name)}` +
        `?session_id=${encodeURIComponent(session_id)}`;

      window.open(viewURL, "_blank");
    } catch (err) {
      console.log("VIEW ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Unable to View File"
      );
    }
  };

  /* =========================================================
     DOWNLOAD
  ========================================================= */

  const handleDownload = async (row) => {
    try {
      /* -----------------------------------------------------
         CURRENTLY SELECTED FILE
      ----------------------------------------------------- */

      if (files[row.id]) {
        const localURL = URL.createObjectURL(files[row.id]);

        const link = document.createElement("a");

        link.href = localURL;
        link.download = files[row.id].name;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        setTimeout(() => {
          URL.revokeObjectURL(localURL);
        }, 1000);

        return;
      }

      /* -----------------------------------------------------
         SESSION ID
      ----------------------------------------------------- */

      const session_id = localStorage.getItem(SESSION_KEY);

      if (!session_id) {
        alert("Session ID not found.");
        return;
      }

      /* -----------------------------------------------------
         GET SAVED FILES
      ----------------------------------------------------- */

      const res = await axios.get(
        `${API}/criteria3/files/3.3`,
        {
          params: {
            session_id,
          },
        }
      );

      const savedFiles = Array.isArray(res.data?.files)
        ? res.data.files
        : Array.isArray(res.data)
        ? res.data
        : [];

      /* -----------------------------------------------------
         FIND FILE
      ----------------------------------------------------- */

      const file = savedFiles.find(
        (f) =>
          String(f.document_name || "").trim() ===
          String(row.documentName || "").trim()
      );

      if (!file) {
        alert("No File Found");
        return;
      }

      if (!file.file_name) {
        alert("File name not available.");
        return;
      }

      /* -----------------------------------------------------
         DOWNLOAD URL
      ----------------------------------------------------- */

      const downloadURL =
        `${API}/criteria3/download/3.3/` +
        `${encodeURIComponent(file.file_name)}` +
        `?session_id=${encodeURIComponent(session_id)}`;

      const link = document.createElement("a");

      link.href = downloadURL;

      link.download =
        file.original_file_name ||
        file.file_name;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (err) {
      console.log("DOWNLOAD ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Download Failed"
      );
    }
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    try {
      const uploadedDocs = Object.keys(files);

      if (uploadedDocs.length === 0) {
        alert("Please Upload File First");
        return;
      }

      const session_id = localStorage.getItem(SESSION_KEY);

      if (!session_id) {
        alert("Session ID not found.");
        return;
      }

      /* -----------------------------------------------------
         UPLOAD EACH FILE
      ----------------------------------------------------- */

      for (const key of uploadedDocs) {
        const file = files[key];

        const row = documents.find(
          (r) => r.id === parseInt(key, 10)
        );

        if (!row || !file) {
          continue;
        }

        const formData = new FormData();

        formData.append("file", file);

        formData.append(
          "criteriaNo",
          "3.3"
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
          session_id
        );

        await axios.post(
          `${API}/criteria3/upload/3.3`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      alert("Files Saved Successfully");

      /* -----------------------------------------------------
         CLEAR CURRENT FRONTEND FILES
      ----------------------------------------------------- */

      setFiles({});
    } catch (err) {
      console.log("SAVE ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Save Failed"
      );
    }
  };

  /* =========================================================
     UPLOAD
  ========================================================= */

  const handleUpload = (e, row) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [row.id]: file,
    }));

    alert(
      `${file.name} Uploaded Successfully`
    );
  };

  /* =========================================================
     CLEAR
  ========================================================= */

  const handleClear = () => {
    /* -------------------------------------------------------
       CLEAR FRONTEND STATE
    ------------------------------------------------------- */

    setFiles({});

    /* -------------------------------------------------------
       CLEAR FILE INPUTS
    ------------------------------------------------------- */

    const fileInputs =
      document.querySelectorAll(
        ".lab-table input[type='file']"
      );

    fileInputs.forEach((input) => {
      input.value = "";
    });

    /* -------------------------------------------------------
       CLEAR LOCAL STORAGE
    ------------------------------------------------------- */

    localStorage.removeItem(
      "criteria3_3_files"
    );
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {
    try {
      const session_id =
        localStorage.getItem(SESSION_KEY);

      if (!session_id) {
        alert("Session ID not found.");
        return;
      }

      await axios.delete(
        `${API}/criteria3/deleteAll/3.3`,
        {
          params: {
            session_id,
          },
        }
      );

      /* -----------------------------------------------------
         CLEAR FRONTEND STATE
      ----------------------------------------------------- */

      setFiles({});

      /* -----------------------------------------------------
         CLEAR FILE INPUTS
      ----------------------------------------------------- */

      const fileInputs =
        document.querySelectorAll(
          ".lab-table input[type='file']"
        );

      fileInputs.forEach((input) => {
        input.value = "";
      });

      alert("Deleted Successfully");
    } catch (err) {
      console.log("DELETE ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

  /* =========================================================
     ESCAPE HTML
  ========================================================= */

  const escapeHTML = (value) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  /* =========================================================
     GET SAVED FILES FOR PRINT
  ========================================================= */

  const getSavedFilesForPrint = async () => {
    try {
      const session_id =
        localStorage.getItem(SESSION_KEY);

      if (!session_id) {
        return [];
      }

      const res = await axios.get(
        `${API}/criteria3/files/3.3`,
        {
          params: {
            session_id,
          },
        }
      );

      if (Array.isArray(res.data?.files)) {
        return res.data.files;
      }

      if (Array.isArray(res.data)) {
        return res.data;
      }

      return [];
    } catch (error) {
      console.log(
        "PRINT SAVED FILE FETCH ERROR:",
        error
      );

      return [];
    }
  };

  /* =========================================================
     LOAD BACKEND FILE AS BLOB
  ========================================================= */

  const loadBackendFile = async (fileName) => {
    try {
      if (!fileName) {
        return null;
      }

      const session_id =
        localStorage.getItem(SESSION_KEY);

      if (!session_id) {
        return null;
      }

      /* -----------------------------------------------------
         IMPORTANT:
         fileName must be file.file_name
      ----------------------------------------------------- */

      const fileURL =
        `${API}/criteria3/view/3.3/` +
        `${encodeURIComponent(fileName)}` +
        `?session_id=${encodeURIComponent(
          session_id
        )}`;

      const response = await fetch(fileURL);

      if (!response.ok) {
        throw new Error(
          "Unable to load backend file"
        );
      }

      const blob = await response.blob();

      return new File(
        [blob],
        fileName,
        {
          type:
            blob.type ||
            "application/octet-stream",
        }
      );
    } catch (error) {
      console.error(
        "BACKEND FILE LOAD ERROR:",
        error
      );

      return null;
    }
  };

  /* =========================================================
     CREATE FILE CONTENT HTML
  ========================================================= */

  const createFileContent = async (file) => {
    const fileName =
      file?.name || "File";

    const extension =
      fileName
        .split(".")
        .pop()
        .toLowerCase();

    /* =======================================================
       PDF
    ======================================================= */

    if (extension === "pdf") {
      const fileURL =
        URL.createObjectURL(file);

      return {
        html: `
          <div class="pdf-container">

            <iframe
              src="${fileURL}"
              class="pdf-preview"
              title="${escapeHTML(fileName)}"
            ></iframe>

            <p class="pdf-note">
              PDF document is displayed above.
              Use browser print options if required.
            </p>

          </div>
        `,

        objectURL: fileURL,
      };
    }

    /* =======================================================
       IMAGE
    ======================================================= */

    if (
      [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
      ].includes(extension)
    ) {
      const fileURL =
        URL.createObjectURL(file);

      return {
        html: `
          <div class="image-container">

            <img
              src="${fileURL}"
              class="image-preview"
              alt="${escapeHTML(fileName)}"
            />

          </div>
        `,

        objectURL: fileURL,
      };
    }

    /* =======================================================
       WORD
    ======================================================= */

    if (
      ["doc", "docx"].includes(extension)
    ) {
      try {
        const arrayBuffer =
          await file.arrayBuffer();

        const result =
          await mammoth.convertToHtml({
            arrayBuffer,
          });

        return {
          html: `
            <div class="document-content">

              ${
                result.value ||
                "<p>No document content found.</p>"
              }

            </div>
          `,

          objectURL: null,
        };
      } catch (error) {
        console.error(
          "WORD PRINT ERROR:",
          error
        );

        return {
          html: `
            <div class="unsupported">

              <strong>
                ${escapeHTML(fileName)}
              </strong>

              <p>
                Unable to read the Word document content.
              </p>

            </div>
          `,

          objectURL: null,
        };
      }
    }

    /* =======================================================
       EXCEL
    ======================================================= */

    if (
      ["xls", "xlsx"].includes(extension)
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
              <div class="excel-sheet">

                <h3>
                  ${escapeHTML(
                    sheetName
                  )}
                </h3>

                <table class="excel-table">
            `;

            if (
              sheetData.length === 0
            ) {
              excelHTML += `
                <tr>
                  <td>
                    No data available
                  </td>
                </tr>
              `;
            }

            sheetData.forEach(
              (
                rowData,
                rowIndex
              ) => {
                excelHTML += "<tr>";

                if (
                  rowData.length === 0
                ) {
                  excelHTML +=
                    "<td></td>";
                }

                rowData.forEach(
                  (cell) => {
                    const cellValue =
                      escapeHTML(
                        cell
                      );

                    if (
                      rowIndex ===
                      0
                    ) {
                      excelHTML += `
                        <th>
                          ${cellValue}
                        </th>
                      `;
                    } else {
                      excelHTML += `
                        <td>
                          ${cellValue}
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

              </div>
            `;
          }
        );

        return {
          html: `
            <div class="document-content">

              ${excelHTML}

            </div>
          `,

          objectURL: null,
        };
      } catch (error) {
        console.error(
          "EXCEL PRINT ERROR:",
          error
        );

        return {
          html: `
            <div class="unsupported">

              <strong>
                ${escapeHTML(fileName)}
              </strong>

              <p>
                Unable to read Excel document content.
              </p>

            </div>
          `,

          objectURL: null,
        };
      }
    }

    /* =======================================================
       POWERPOINT
    ======================================================= */

    if (
      ["ppt", "pptx"].includes(extension)
    ) {
      const fileURL =
        URL.createObjectURL(file);

      return {
        html: `
          <div class="unsupported">

            <strong>
              ${escapeHTML(fileName)}
            </strong>

            <p>
              PowerPoint preview is not directly
              supported by the browser.
            </p>

            <p>
              The original PowerPoint file is
              available through the Download button.
            </p>

            <a
              href="${fileURL}"
              download="${escapeHTML(
                fileName
              )}"
              class="download-file-link"
            >
              Download ${escapeHTML(
                fileName
              )}
            </a>

          </div>
        `,

        objectURL: fileURL,
      };
    }

    /* =======================================================
       OTHER FILE TYPES
    ======================================================= */

    const fileURL =
      URL.createObjectURL(file);

    return {
      html: `
        <div class="unsupported">

          <strong>
            ${escapeHTML(fileName)}
          </strong>

          <p>
            Preview is not available for this
            file type in the browser.
          </p>

          <a
            href="${fileURL}"
            download="${escapeHTML(
              fileName
            )}"
            class="download-file-link"
          >
            Download File
          </a>

        </div>
      `,

      objectURL: fileURL,
    };
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = async () => {
    let printWindow = null;
    let objectURLs = [];

    try {
      /* -----------------------------------------------------
         GET BACKEND SAVED FILES
      ----------------------------------------------------- */

      const savedFiles =
        await getSavedFilesForPrint();

      /* -----------------------------------------------------
         BUILD PRINT FILE LIST
         CURRENT FILE HAS PRIORITY
      ----------------------------------------------------- */

      const printFiles = [];

      for (const row of documents) {
        /* ---------------------------------------------------
           CURRENT FRONTEND FILE
        --------------------------------------------------- */

        if (files[row.id]) {
          printFiles.push({
            row,
            file: files[row.id],
          });

          continue;
        }

        /* ---------------------------------------------------
           BACKEND SAVED FILE
        --------------------------------------------------- */

        const savedFile =
          savedFiles.find(
            (item) =>
              String(
                item.document_name || ""
              ).trim() ===
              String(
                row.documentName || ""
              ).trim()
          );

        if (
          savedFile &&
          savedFile.file_name
        ) {
          const backendFile =
            await loadBackendFile(
              savedFile.file_name
            );

          if (backendFile) {
            printFiles.push({
              row,
              file: backendFile,
            });
          }
        }
      }

      /* -----------------------------------------------------
         NO FILE
      ----------------------------------------------------- */

      if (
        printFiles.length === 0
      ) {
        alert(
          "No files available for printing. Please Upload or Save a File First."
        );

        return;
      }

      /* -----------------------------------------------------
         OPEN PRINT WINDOW
      ----------------------------------------------------- */

      printWindow =
        window.open(
          "",
          "_blank",
          "width=1200,height=900"
        );

      if (!printWindow) {
        alert(
          "Please allow pop-ups in your browser for printing."
        );

        return;
      }

      /* -----------------------------------------------------
         OPEN DOCUMENT
      ----------------------------------------------------- */

      printWindow.document.open();

      printWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

          <meta charset="UTF-8" />

          <title>
            Criteria 3.3 - Laboratory Work & Workshop
          </title>

          <style>

            @page {
              size: A4;
              margin: 12mm;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: #ffffff;
              color: #222222;
              font-family:
                Arial,
                Helvetica,
                sans-serif;
            }

            body {
              padding: 18px;
            }

            /* =============================================
               REPORT HEADER
            ============================================= */

            .report-header {
              text-align: center;
              border-bottom:
                3px solid #14579e;
              padding-bottom: 14px;
              margin-bottom: 22px;
            }

            .report-header h1 {
              margin: 0;
              color: #14579e;
              font-size: 25px;
              font-weight: 700;
            }

            .report-header h2 {
              margin:
                7px 0 10px;
              color: #14579e;
              font-size: 18px;
              font-weight: 600;
            }

            .report-header p {
              margin: 5px 0;
              font-size: 13px;
              color: #444444;
            }

            /* =============================================
               FILE CARD
            ============================================= */

            .file-card {
              border:
                1px solid #cfcfcf;
              border-radius: 6px;
              margin-bottom: 22px;
              overflow: hidden;
              background: #ffffff;
            }

            .file-title {
              background: #eef4fa;
              color: #14579e;
              padding:
                11px 13px;
              border-bottom:
                1px solid #cccccc;
              font-size: 15px;
              font-weight: 700;
            }

            .file-body {
              padding: 14px;
            }

            .file-body p {
              font-size: 12px;
              line-height: 1.55;
              margin: 6px 0;
            }

            .file-name {
              color: #15803d;
              font-weight: 600;
              word-break: break-word;
            }

            /* =============================================
               DOCUMENT CONTENT
            ============================================= */

            .document-content {
              margin-top: 15px;
              padding: 14px;
              border:
                1px solid #dddddd;
              background: #ffffff;
              font-size: 12px;
              line-height: 1.55;
              overflow-wrap: break-word;
            }

            .document-content h1,
            .document-content h2,
            .document-content h3,
            .document-content h4,
                        .document-content h1,
            .document-content h2,
            .document-content h3,
            .document-content h4,
            .document-content h5,
            .document-content h6 {
              color: #14579e;
              margin-top: 13px;
              margin-bottom: 7px;
            }

            .document-content p {
              margin: 6px 0;
            }

            .document-content ul,
            .document-content ol {
              margin-top: 6px;
              margin-bottom: 6px;
            }

            .document-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 12px 0;
              page-break-inside: auto;
            }

            .document-content tr {
              page-break-inside: avoid;
            }

            .document-content th,
            .document-content td {
              border: 1px solid #999999;
              padding: 6px;
              font-size: 10px;
              vertical-align: top;
              word-break: break-word;
            }

            .document-content th {
              background: #eef4fa;
              font-weight: 700;
            }

            .document-content img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 10px auto;
            }

            /* =============================================
               PDF
            ============================================= */

            .pdf-container {
              margin-top: 15px;
              page-break-inside: auto;
            }

            .pdf-preview {
              width: 100%;
              height: 850px;
              border: 1px solid #cccccc;
              display: block;
            }

            .pdf-note {
              font-size: 10px !important;
              color: #777777 !important;
              text-align: center;
            }

            /* =============================================
               IMAGE
            ============================================= */

            .image-container {
              margin-top: 15px;
              text-align: center;
            }

            .image-preview {
              max-width: 100%;
              max-height: 900px;
              width: auto;
              height: auto;
              border: 1px solid #cccccc;
              display: inline-block;
            }

            /* =============================================
               EXCEL
            ============================================= */

            .excel-sheet {
              margin-bottom: 20px;
            }

            .excel-sheet h3 {
              color: #14579e;
              font-size: 14px;
              margin: 8px 0;
            }

            .excel-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }

            .excel-table th,
            .excel-table td {
              border: 1px solid #999999;
              padding: 5px;
              font-size: 9px;
              text-align: left;
              vertical-align: top;
              word-break: break-word;
            }

            .excel-table th {
              background: #eef4fa;
              font-weight: 700;
            }

            /* =============================================
               UNSUPPORTED
            ============================================= */

            .unsupported {
              margin-top: 15px;
              padding: 18px;
              background: #f8f8f8;
              border: 1px dashed #aaaaaa;
              text-align: center;
            }

            .unsupported strong {
              display: block;
              margin-bottom: 8px;
              color: #14579e;
            }

            .unsupported p {
              color: #555555;
            }

            .download-file-link {
              display: inline-block;
              margin-top: 8px;
              padding: 8px 12px;
              background: #14579e;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
              font-size: 11px;
            }

            /* =============================================
               FOOTER
            ============================================= */

            .footer {
              margin-top: 25px;
              padding-top: 10px;
              border-top: 1px solid #dddddd;
              text-align: center;
              font-size: 10px;
              color: #777777;
            }

            /* =============================================
               PRINT
            ============================================= */

            @media print {

              body {
                padding: 0;
              }

              .file-card {
                page-break-inside: auto;
              }

              .document-content table,
              .excel-table {
                page-break-inside: auto;
              }

              .document-content tr,
              .excel-table tr {
                page-break-inside: avoid;
              }

              .file-title {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

            }

          </style>

        </head>

        <body>

          <div class="report-header">

            <h1>
              CRITERIA 3
            </h1>

            <h2>
              3.3 Laboratory Work & Workshop
            </h2>

            <p>
              <strong>
                Evaluation of Experiments and Rubrics Assessment
              </strong>
            </p>

            <p>
              <strong>
                Total Documentary Evidence:
              </strong>
              ${printFiles.length}
            </p>

          </div>
      `);

      /* =====================================================
         PROCESS EVERY FILE
      ===================================================== */

      for (
        let index = 0;
        index < printFiles.length;
        index++
      ) {

        const item = printFiles[index];

        const row = item.row;
        const file = item.file;

        const fileName =
          file?.name || "Document";

        let contentHTML = "";

        try {

          const result =
            await createFileContent(file);

          contentHTML =
            result.html;

          if (result.objectURL) {

            objectURLs.push(
              result.objectURL
            );

          }

        } catch (error) {

          console.error(
            "FILE CONTENT PRINT ERROR:",
            error
          );

          contentHTML = `
            <div class="unsupported">

              <strong>
                ${escapeHTML(fileName)}
              </strong>

              <p>
                Unable to display the content of this file.
              </p>

            </div>
          `;
        }

        /* ===================================================
           WRITE FILE CARD
        =================================================== */

        printWindow.document.write(`

          <div class="file-card">

            <div class="file-title">

              ${row.id}.
              ${escapeHTML(
                row.documentName
              )}

            </div>

            <div class="file-body">

              <p>

                <strong>
                  Description:
                </strong>

                ${escapeHTML(
                  row.description
                )}

              </p>

              <p>

                <strong>
                  File Name:
                </strong>

                <span class="file-name">

                  ${escapeHTML(
                    fileName
                  )}

                </span>

              </p>

              ${contentHTML}

            </div>

          </div>

        `);
      }

      /* =====================================================
         FOOTER
      ===================================================== */

      printWindow.document.write(`

          <div class="footer">

            Criteria 3.3 -
            Laboratory Work & Workshop

            <br />

            NBA Documentary Evidence Report

          </div>

        </body>

        </html>

      `);

      printWindow.document.close();

      /* =====================================================
         WAIT FOR DOCUMENT TO LOAD
      ===================================================== */

      setTimeout(() => {

        try {

          printWindow.focus();

          printWindow.print();

          /* -----------------------------------------------
             RELEASE OBJECT URLS
          ----------------------------------------------- */

          setTimeout(() => {

            objectURLs.forEach(
              (url) => {

                try {

                  URL.revokeObjectURL(
                    url
                  );

                } catch (error) {

                  console.log(
                    "URL REVOKE ERROR:",
                    error
                  );

                }

              }
            );

          }, 5000);

        } catch (error) {

          console.error(
            "PRINT WINDOW ERROR:",
            error
          );

          alert(
            "Unable to print report."
          );

        }

      }, 2500);

    } catch (err) {

      console.error(
        "PRINT ERROR:",
        err
      );

      /* -----------------------------------------------------
         CLOSE PRINT WINDOW IF ERROR OCCURS
      ----------------------------------------------------- */

      if (
        printWindow &&
        !printWindow.closed
      ) {

        try {
          printWindow.close();
        } catch (error) {
          console.log(
            "PRINT WINDOW CLOSE ERROR:",
            error
          );
        }

      }

      /* -----------------------------------------------------
         RELEASE OBJECT URLS
      ----------------------------------------------------- */

      objectURLs.forEach(
        (url) => {

          try {

            URL.revokeObjectURL(
              url
            );

          } catch (error) {

            console.log(
              "URL REVOKE ERROR:",
              error
            );

          }

        }
      );

      alert(
        err?.response?.data?.message ||
        "Print Failed"
      );
    }
  };

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="main-container">

      <NBASidebar />

      <div className="content-container">

        <div className="lab-wrapper">

          {/* =================================================
             HEADER CARD
          ================================================= */}

          <div className="lab-header-card">

            
                          <div className="lab-title">

              <div className="lab-number">
                3.3
              </div>

              <div className="lab-title-text">

                <h2>
                  Laboratory Work & Workshop
                </h2>

                <p>
                  Upload and manage laboratory work and
                  workshop related documents.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
             TABLE CARD
          ================================================= */}

          <div className="lab-card">

            <div className="lab-table-wrapper">

              <table className="lab-table">

                <thead>

                  <tr>

                    <th>
                      Sr.No.
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

                  {documents.map((item) => (

                    <tr key={item.id}>

                      {/* -------------------------------------
                         SR NO
                      ------------------------------------- */}

                      <td className="lab-sr">

                        {item.id}

                      </td>

                      {/* -------------------------------------
                         DOCUMENT NAME
                      ------------------------------------- */}

                      <td>

                        {item.documentName}

                      </td>

                      {/* -------------------------------------
                         DESCRIPTION
                      ------------------------------------- */}

                      <td>

                        <textarea
                          className="description-box"
                          value={item.description}
                          readOnly
                        />

                      </td>

                      {/* -------------------------------------
                         ACTION
                      ------------------------------------- */}

                      <td className="attachment-cell">

                        {/* FILE INPUT */}

                        <input
                          type="file"
                          className="file-input"
                          accept="
                            .pdf,
                            .doc,
                            .docx,
                            .xls,
                            .xlsx,
                            .ppt,
                            .pptx,
                            .jpg,
                            .jpeg,
                            .png
                          "
                          onChange={(e) =>
                            handleUpload(e, item)
                          }
                        />

                        {/* ---------------------------------
                           SELECTED FILE NAME
                        --------------------------------- */}

                        {files[item.id] && (

                          <div className="file-name">

                            {files[item.id].name}

                          </div>

                        )}

                        {/* ---------------------------------
                           VIEW / DOWNLOAD
                        --------------------------------- */}

                        <div className="lab-actions">

                          <button
                            type="button"
                            className="view-btn"
                            onClick={() =>
                              handleView(item)
                            }
                          >

                            <FaEye />

                            <span>
                              View
                            </span>

                          </button>

                          <button
                            type="button"
                            className="download-btn"
                            onClick={() =>
                              handleDownload(item)
                            }
                          >

                            <FaDownload />

                            <span>
                              Download
                            </span>

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* =================================================
             BOTTOM BUTTONS
          ================================================= */}

          <div className="lab-bottom-buttons">

            {/* -----------------------------------------------
               PREVIOUS
            ----------------------------------------------- */}

            <button
              type="button"
              className="previous-btn"
              onClick={() =>
                navigate("/criteria/3.2")
              }
            >

              <FaArrowLeft />

              <span>
                Previous
              </span>

            </button>

            {/* -----------------------------------------------
               BACK
            ----------------------------------------------- */}

            <button
              type="button"
              className="back-btn"
              onClick={() =>
                navigate("/criteria/3.1")
              }
            >

              <FaArrowLeft />

              <span>
                Back
              </span>

            </button>

            {/* -----------------------------------------------
               SAVE
            ----------------------------------------------- */}

            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
            >

              <FaSave />

              <span>
                Save
              </span>

            </button>

            {/* -----------------------------------------------
               DELETE
            ----------------------------------------------- */}

            <button
              type="button"
              className="delete-btn"
              onClick={handleDelete}
            >

              <FaTrash />

              <span>
                Delete
              </span>

            </button>

            {/* -----------------------------------------------
               PRINT
            ----------------------------------------------- */}

            <button
              type="button"
              className="print-btn"
              onClick={handlePrint}
            >

              <FaPrint />

              <span>
                Print
              </span>

            </button>

            {/* -----------------------------------------------
               CLEAR
            ----------------------------------------------- */}

            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
            >

              <FaBroom />

              <span>
                Clear
              </span>

            </button>

            {/* -----------------------------------------------
               NEXT
            ----------------------------------------------- */}

            <button
              type="button"
              className="next-btn"
              onClick={() =>
                navigate("/criteria/3.4")
              }
            >

              <span>
                Next
              </span>

              <FaArrowRight />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LaboratoryWorkshop;
