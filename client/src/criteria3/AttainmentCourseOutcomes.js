import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

import NBASidebar from "../Pages/NBASidebar";

import {
  FaEye,
  FaDownload,
  FaPrint,
  FaArrowLeft,
  FaSave,
  FaTrash,
  FaPaperPlane,
  FaArrowRight,
} from "react-icons/fa";

import "./AttainmentCourseOutcomes.css";

function AttainmentCourseOutcomes() {
  const navigate = useNavigate();

  // ==========================================================
  // API CONFIGURATION
  // ==========================================================

  const API_BASE = "http://localhost:5000";
  const CRITERIA_NO = "3.7.1";

  // ==========================================================
  // FILE STATE
  // ==========================================================

  
const [files, setFiles] = useState({});

// Database मधून आलेले सर्व saved records
const [savedDocuments, setSavedDocuments] = useState([]);



  // ==========================================================
  // TABLE DATA
  // ==========================================================

  const documents = [
    {
      id: 1,
      documentName: "Assessment Tools",
      description:
        "List of assessment tools and processes",
    },
    {
      id: 2,
      documentName: "Assessment Quality",
      description:
        "The quality/relevance of assessment tools/processes used",
    },
  ];

  // ==========================================================
  // ESCAPE HTML
  // ==========================================================

  const escapeHTML = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // ==========================================================
  // GET FILE URL
  // ==========================================================

  const getFileUrl = (filePath) => {
    if (!filePath) {
      return "";
    }

    let cleanPath = String(filePath).replace(/\\/g, "/");

    // Already complete URL
    if (
      cleanPath.startsWith("http://") ||
      cleanPath.startsWith("https://")
    ) {
      return cleanPath;
    }

    // Remove leading slash
    cleanPath = cleanPath.replace(/^\/+/, "");

    return `${API_BASE}/${cleanPath}`;
  };

  // ==========================================================
  // GET SAVED FILES
  // ==========================================================

  const getSavedFiles = async () => {
  try {
    const response = await axios.get(
      `${API_BASE}/criteria3/files/${CRITERIA_NO}`
    );

    const data = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.files)
      ? response.data.files
      : [];

    setSavedDocuments(data);

    return data;
  } catch (error) {
    console.error("GET SAVED FILES ERROR:", error);
    setSavedDocuments([]);
    return [];
  }
};

  // ==========================================================
  // LOAD BACKEND FILE
  // ==========================================================

  const loadBackendFile = async (filePath) => {
    try {
      if (!filePath) {
        return null;
      }

      const fileURL = getFileUrl(filePath);

      if (!fileURL) {
        return null;
      }

      const response = await fetch(fileURL);

      if (!response.ok) {
        throw new Error(
          `Unable to fetch file. Status: ${response.status}`
        );
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        return null;
      }

      const fileName =
        String(filePath)
          .split("/")
          .pop()
          ?.split("?")[0] || "document";

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
        "LOAD BACKEND FILE ERROR:",
        error
      );

      return null;
    }
  };

  // ==========================================================
  // UPLOAD
  // ==========================================================

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


  const handleClear = (row) => {
  setFiles((prev) => {
    const updated = { ...prev };

    delete updated[row.id];

    return updated;
  });

  const inputs =
    document.querySelectorAll(
      '.attainment-page input[type="file"]'
    );

  inputs.forEach((input) => {
    if (input.files?.length) {
      input.value = "";
    }
  });
};

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = async (row) => {
    try {
      // ------------------------------------------------------
      // CURRENTLY SELECTED FILE
      // ------------------------------------------------------

      if (files[row.id]) {
        const fileURL =
          URL.createObjectURL(
            files[row.id]
          );

        const newWindow =
          window.open(
            fileURL,
            "_blank"
          );

        if (!newWindow) {
          alert(
            "Please allow pop-ups in your browser."
          );
        }

        setTimeout(() => {
          try {
            URL.revokeObjectURL(
              fileURL
            );
          } catch (error) {
            console.error(
              "VIEW URL REVOKE ERROR:",
              error
            );
          }
        }, 60000);

        return;
      }

      // ------------------------------------------------------
      // BACKEND FILE
      // ------------------------------------------------------

      const savedFiles =
        await getSavedFiles();

      const savedFile =
        savedFiles.find(
          (file) =>
            String(
              file.document_name || ""
            )
              .trim()
              .toLowerCase() ===
            String(
              row.documentName || ""
            )
              .trim()
              .toLowerCase()
        );

      if (!savedFile) {
        alert("No File Found");
        return;
      }

      const fileURL =
        getFileUrl(
          savedFile.file_path
        );

      if (!fileURL) {
        alert(
          "File URL not available"
        );
        return;
      }

      const newWindow =
        window.open(
          fileURL,
          "_blank"
        );

      if (!newWindow) {
        alert(
          "Please allow pop-ups in your browser."
        );
      }
    } catch (error) {
      console.error(
        "VIEW ERROR:",
        error
      );

      alert(
        "Unable to View File"
      );
    }
  };

  // ==========================================================
  // DOWNLOAD
  // ==========================================================

  const handleDownload = async (row) => {
    let objectURL = null;

    try {
      // ------------------------------------------------------
      // CURRENTLY SELECTED FILE
      // ------------------------------------------------------

      if (files[row.id]) {
        objectURL =
          URL.createObjectURL(
            files[row.id]
          );

        const link =
          document.createElement("a");

        link.href = objectURL;

        link.download =
          files[row.id].name ||
          "document";

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        return;
      }

      // ------------------------------------------------------
      // BACKEND FILE
      // ------------------------------------------------------

      const savedFiles =
        await getSavedFiles();

      const savedFile =
        savedFiles.find(
          (file) =>
            String(
              file.document_name || ""
            )
              .trim()
              .toLowerCase() ===
            String(
              row.documentName || ""
            )
              .trim()
              .toLowerCase()
        );

      if (!savedFile) {
        alert("No File Found");
        return;
      }

      const fileURL =
        getFileUrl(
          savedFile.file_path
        );

      if (!fileURL) {
        alert(
          "File URL not available"
        );
        return;
      }

      const response =
        await fetch(fileURL);

      if (!response.ok) {
        throw new Error(
          "Unable to download file"
        );
      }

      const blob =
        await response.blob();

      objectURL =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = objectURL;

      link.download =
        savedFile.file_name ||
        String(
          savedFile.file_path || ""
        )
          .split("/")
          .pop() ||
        "document";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );
    } catch (error) {
      console.error(
        "DOWNLOAD ERROR:",
        error
      );

      alert(
        "Download Failed"
      );
    } finally {
      if (objectURL) {
        setTimeout(() => {
          try {
            URL.revokeObjectURL(
              objectURL
            );
          } catch (error) {
            console.error(
              "DOWNLOAD URL REVOKE ERROR:",
              error
            );
          }
        }, 2000);
      }
    }
  };

  // ==========================================================
  // SAVE
  // ==========================================================

// ==========================================================
// SAVE
// EVERY SAVE CREATES NEW ROW
// ==========================================================

const handleSave = async () => {
  try {
    const uploadedDocs =
      Object.keys(files);

    if (uploadedDocs.length === 0) {
      alert("Please Upload File First");
      return;
    }

    const sessionId =
      localStorage.getItem(
        "criteria3_session_id"
      ) || "default-session";

    // --------------------------------------------------------
    // SAVE EACH SELECTED FILE
    // --------------------------------------------------------

    for (const key of uploadedDocs) {
      const file = files[key];

      const row = documents.find(
        (item) =>
          item.id === parseInt(key)
      );

      if (!row || !file) {
        continue;
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "criteriaNo",
        CRITERIA_NO
      );

      formData.append(
        "documentName",
        row.documentName
      );

      formData.append(
        "description",
        row.description || ""
      );

      formData.append(
        "session_id",
        sessionId
      );

      await axios.post(
        `${API_BASE}/criteria3/upload`,
        formData
      );
    }

    // --------------------------------------------------------
    // VERY IMPORTANT
    // GET OLD + NEW RECORDS AGAIN
    // --------------------------------------------------------

    await getSavedFiles();

    alert(
      "Files Saved Successfully"
    );

    // --------------------------------------------------------
    // CLEAR ONLY CURRENT FILE SELECTION
    //
    // Database records remain safe.
    // --------------------------------------------------------

    setFiles({});

    document
      .querySelectorAll(
        '.attainment-page input[type="file"]'
      )
      .forEach((input) => {
        input.value = "";
      });

  } catch (error) {
    console.error(
      "SAVE ERROR:",
      error
    );

    if (
      error.response?.data?.message
    ) {
      alert(
        error.response.data.message
      );
    } else {
      alert("Save Failed");
    }
  }
};


  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE}/criteria3/deleteAll/${CRITERIA_NO}`
      );

      setFiles({});

      document
        .querySelectorAll(
          '.attainment-page input[type="file"]'
        )
        .forEach(
          (input) => {
            input.value = "";
          }
        );

      alert(
        "Deleted Successfully"
      );
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        "Delete Failed"
      );
    }
  };

  // ==========================================================
  // CREATE FILE CONTENT FOR PRINT
  // ==========================================================

  const createFileContent = async (
    file
  ) => {
    if (!file) {
      return {
        html: "",
        objectURL: null,
      };
    }

    const fileName =
      file.name || "Document";

    const lowerName =
      fileName.toLowerCase();

    const mimeType =
      file.type || "";

    // ========================================================
    // PDF
    // ========================================================

    if (
      mimeType ===
        "application/pdf" ||
      lowerName.endsWith(".pdf")
    ) {
      const objectURL =
        URL.createObjectURL(
          file
        );

      return {
        objectURL,

        html: `
          <div class="pdf-container">

            <iframe
              class="pdf-preview"
              src="${objectURL}"
              title="${escapeHTML(
                fileName
              )}"
            ></iframe>

            <p class="pdf-note">
              PDF document preview.
              If the preview does not appear,
              use the original PDF file.
            </p>

          </div>
        `,
      };
    }

    // ========================================================
    // IMAGE
    // ========================================================

    if (
      mimeType.startsWith(
        "image/"
      ) ||
      /\.(jpg|jpeg|png)$/i.test(
        lowerName
      )
    ) {
      const objectURL =
        URL.createObjectURL(
          file
        );

      return {
        objectURL,

        html: `
          <div class="image-container">

            <img
              class="image-preview"
              src="${objectURL}"
              alt="${escapeHTML(
                fileName
              )}"
            />

          </div>
        `,
      };
    }

    // ========================================================
    // DOCX
    // ========================================================

    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lowerName.endsWith(".docx")
    ) {
      const arrayBuffer =
        await file.arrayBuffer();

      const result =
        await mammoth.convertToHtml({
          arrayBuffer,
        });

      return {
        objectURL: null,

        html: `
          <div class="document-content">

            ${
              result.value ||
              "<p>No readable content found.</p>"
            }

          </div>
        `,
      };
    }

    // ========================================================
    // DOC
    // ========================================================

    if (
      mimeType ===
        "application/msword" ||
      lowerName.endsWith(".doc")
    ) {
      return {
        objectURL: null,

        html: `
          <div class="unsupported">

            <strong>
              Word Document
            </strong>

            <p>
              The .doc format cannot be directly
              rendered in the browser print preview.
            </p>

            <p>
              File:
              ${escapeHTML(
                fileName
              )}
            </p>

          </div>
        `,
      };
    }

    // ========================================================
    // EXCEL
    // ========================================================

    if (
      mimeType.includes(
        "spreadsheet"
      ) ||
      mimeType.includes(
        "excel"
      ) ||
      /\.(xls|xlsx)$/i.test(
        lowerName
      )
    ) {
      const arrayBuffer =
        await file.arrayBuffer();

      const workbook =
        XLSX.read(
          arrayBuffer,
          {
            type: "array",
          }
        );

      let html = "";

      if (
        !workbook.SheetNames ||
        workbook.SheetNames.length ===
          0
      ) {
        return {
          objectURL: null,

          html: `
            <div class="unsupported">

              <strong>
                Excel File
              </strong>

              <p>
                No sheets found.
              </p>

            </div>
          `,
        };
      }

      workbook.SheetNames.forEach(
        (sheetName) => {
          const worksheet =
            workbook.Sheets[
              sheetName
            ];

          const rows =
            XLSX.utils.sheet_to_json(
              worksheet,
              {
                header: 1,
                defval: "",
              }
            );

          if (
            !rows ||
            rows.length === 0
          ) {
            html += `
              <div class="excel-sheet">

                <h3>
                  ${escapeHTML(
                    sheetName
                  )}
                </h3>

                <p>
                  No data available.
                </p>

              </div>
            `;

            return;
          }

          html += `
            <div class="excel-sheet">

              <h3>
                Sheet:
                ${escapeHTML(
                  sheetName
                )}
              </h3>

              <table class="excel-table">

                <tbody>
          `;

          rows.forEach(
            (
              row,
              rowIndex
            ) => {
              html += "<tr>";

              const safeRow =
                Array.isArray(row)
                  ? row
                  : [];

              if (
                safeRow.length === 0
              ) {
                html +=
                  "<td></td>";
              }

              safeRow.forEach(
                (cell) => {
                  const tag =
                    rowIndex === 0
                      ? "th"
                      : "td";

                  html += `
                    <${tag}>
                      ${escapeHTML(
                        cell
                      )}
                    </${tag}>
                  `;
                }
              );

              html += "</tr>";
            }
          );

          html += `
                </tbody>

              </table>

            </div>
          `;
        }
      );

      return {
        objectURL: null,

        html: `
          <div class="document-content">

            ${html}

          </div>
        `,
      };
    }

    // ========================================================
    // POWERPOINT
    // ========================================================

    if (
      mimeType.includes(
        "presentation"
      ) ||
      /\.(ppt|pptx)$/i.test(
        lowerName
      )
    ) {
      return {
        objectURL: null,

        html: `
          <div class="unsupported">

            <strong>
              PowerPoint Presentation
            </strong>

            <p>
              PowerPoint content cannot be directly
              rendered inside the browser print preview.
            </p>

            <p>
              File:
              ${escapeHTML(
                fileName
              )}
            </p>

          </div>
        `,
      };
    }

    // ========================================================
    // DEFAULT
    // ========================================================

    return {
      objectURL: null,

      html: `
        <div class="unsupported">

          <strong>
            Unsupported File Type
          </strong>

          <p>
            Unable to display this file
            directly in the print preview.
          </p>

          <p>
            File:
            ${escapeHTML(
              fileName
            )}
          </p>

        </div>
      `,
    };
  };

  // ==========================================================
  // PRINT
  // ==========================================================

  const handlePrint = async () => {
    let printWindow = null;

    const objectURLs = [];

    try {
      // ------------------------------------------------------
      // GET SAVED BACKEND FILES
      // ------------------------------------------------------

      const savedFiles =
        await getSavedFiles();

      const printFiles = [];

      // ------------------------------------------------------
      // CURRENT FILE FIRST PRIORITY
      // ------------------------------------------------------

      for (
        const row of documents
      ) {
        const currentFile =
          files[row.id];

        if (currentFile) {
          printFiles.push({
            row,
            file: currentFile,
          });

          continue;
        }

        // ----------------------------------------------------
        // BACKEND SAVED FILE
        // ----------------------------------------------------

        const savedFile =
          savedFiles.find(
            (item) =>
              String(
                item.document_name ||
                  ""
              )
                .trim()
                .toLowerCase() ===
              String(
                row.documentName ||
                  ""
              )
                .trim()
                .toLowerCase()
          );

        if (savedFile) {
          const backendFile =
            await loadBackendFile(
              savedFile.file_path
            );

          if (backendFile) {
            printFiles.push({
              row,
              file: backendFile,
            });
          }
        }
      }

      // ------------------------------------------------------
      // NO FILE
      // ------------------------------------------------------

      if (
        printFiles.length === 0
      ) {
        alert(
          "No files available for printing. Please Upload or Save a File First."
        );

        return;
      }

      // ------------------------------------------------------
      // OPEN PRINT WINDOW
      // ------------------------------------------------------

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

      // ------------------------------------------------------
      // START PRINT DOCUMENT
      // ------------------------------------------------------

      printWindow.document.open();

      printWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

          <meta charset="UTF-8" />

          <title>
            Criteria 3.7.1 - Attainment of Course Outcomes
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

            /* ================================================
               REPORT HEADER
            ================================================ */

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

            /* ================================================
               FILE CARD
            ================================================ */

            .file-card {
              border:
                1px solid #cfcfcf;

              border-radius: 6px;

              margin-bottom: 22px;

              overflow: hidden;

              page-break-inside: auto;

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

            /* ================================================
               DOCUMENT CONTENT
            ================================================ */

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

              border-collapse:
                collapse;

              margin: 12px 0;

              page-break-inside:
                auto;
            }

            .document-content tr {
              page-break-inside:
                avoid;
            }

            .document-content th,
            .document-content td {
              border:
                1px solid #999999;

              padding: 6px;

              font-size: 10px;

              vertical-align: top;
            }

            .document-content th {
              background: #eef4fa;

              font-weight: 700;
            }

            .document-content img {
              max-width: 100%;

              height: auto;

              display: block;

              margin:
                10px auto;
            }

            /* ================================================
               PDF
            ================================================ */

            .pdf-container {
              margin-top: 15px;

              page-break-inside: auto;
            }

            .pdf-preview {
              width: 100%;

              height: 850px;

              border:
                1px solid #cccccc;

              display: block;
            }

            .pdf-note {
              font-size:
                10px !important;

              color:
                #777777 !important;

              text-align: center;
            }

            /* ================================================
               IMAGE
            ================================================ */

            .image-container {
              margin-top: 15px;

              text-align: center;
            }

            .image-preview {
              max-width: 100%;

              max-height: 900px;

              width: auto;

              height: auto;

              border:
                1px solid #cccccc;

              display: inline-block;
            }

            /* ================================================
               EXCEL
            ================================================ */

            .excel-sheet {
              margin-bottom: 20px;
            }

            .excel-sheet h3 {
              color: #14579e;

              font-size: 14px;

              margin:
                8px 0;
            }

            .excel-table {
              width: 100%;

              border-collapse:
                collapse;

              margin-bottom: 15px;
            }

            .excel-table th,
            .excel-table td {
              border:
                1px solid #999999;

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

            /* ================================================
               UNSUPPORTED
            ================================================ */

            .unsupported {
              margin-top: 15px;

              padding: 18px;

              background: #f8f8f8;

              border:
                1px dashed #aaaaaa;

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

            /* ================================================
               FOOTER
            ================================================ */

            .footer {
              margin-top: 25px;

              padding-top: 10px;

              border-top:
                1px solid #dddddd;

              text-align: center;

              font-size: 10px;

              color: #777777;
            }

            /* ================================================
               PRINT
            ================================================ */

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
                page-break-inside:
                  avoid;
              }

              .file-title {
                -webkit-print-color-adjust:
                  exact;

                print-color-adjust:
                  exact;
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
              3.7.1 Attainment of Course Outcomes
            </h2>

            <p>
              <strong>
                Course Outcomes Documentary Evidence
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

      // ======================================================
      // PROCESS FILES
      // ======================================================

      for (
        let index = 0;
        index < printFiles.length;
        index++
      ) {
        const item =
          printFiles[index];

        const row =
          item.row;

        const file =
          item.file;

        const fileName =
          file?.name ||
          "Document";

        let contentHTML =
          "";

        try {
          const result =
            await createFileContent(
              file
            );

          contentHTML =
            result?.html || "";

          if (
            result?.objectURL
          ) {
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
                ${escapeHTML(
                  fileName
                )}
              </strong>

              <p>
                Unable to display the content of this file.
              </p>

            </div>
          `;
        }

        // ====================================================
        // FILE CARD
        // ====================================================

        printWindow.document.write(`

          <div class="file-card">

            <div class="file-title">

              ${escapeHTML(
                row.id
              )}.
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

      // ======================================================
      // FOOTER
      // ======================================================

      printWindow.document.write(`

          <div class="footer">

            Criteria 3.7.1 -
            Attainment of Course Outcomes

            <br />

            NBA Documentary Evidence Report

          </div>

        </body>

        </html>

      `);

      printWindow.document.close();

      // ======================================================
      // PRINT AFTER CONTENT LOAD
      // ======================================================

      setTimeout(() => {
        try {
          printWindow.focus();

          printWindow.print();

          setTimeout(() => {
            objectURLs.forEach(
              (url) => {
                try {
                  URL.revokeObjectURL(
                    url
                  );
                } catch (error) {
                  console.error(
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
      }, 3000);
    } catch (error) {
      console.error(
        "PRINT ERROR:",
        error
      );

      // ------------------------------------------------------
      // CLOSE PRINT WINDOW
      // ------------------------------------------------------

      if (
        printWindow &&
        !printWindow.closed
      ) {
        try {
          printWindow.close();
        } catch (closeError) {
          console.error(
            "PRINT WINDOW CLOSE ERROR:",
            closeError
          );
        }
      }

      // ------------------------------------------------------
      // CLEANUP OBJECT URLS
      // ------------------------------------------------------

      objectURLs.forEach(
        (url) => {
          try {
            URL.revokeObjectURL(
              url
            );
          } catch (error) {
            console.error(
              "OBJECT URL CLEANUP ERROR:",
              error
            );
          }
        }
      );

      alert(
        "Print Failed"
      );
    }
  };

  // ==========================================================
  // JSX
  // ==========================================================

  return (
    <div className="main-container">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <NBASidebar />

      <div className="course-container">

        <div className="attainment-page">

          {/* ====================================================
              HEADER
          ==================================================== */}

          <div className="page-header">

            <div className="header-left">

              <div className="criteria-circle">
                3.7.1
              </div>

              <div className="header-content">

                <h2>
                  Attainment of Course Outcomes
                </h2>

                <p>
                  Upload and manage attainment of
                  course outcomes related documents.
                </p>

              </div>

            </div>

          </div>

          {/* ====================================================
              TABLE
          ==================================================== */}

          <div className="course-card">

            <table className="course-table">

              <thead>

                <tr>

                  <th
                    style={{
                      width: "8%",
                    }}
                  >
                    Sr.No.
                  </th>

                  <th
                    style={{
                      width: "25%",
                    }}
                  >
                    Document Name
                  </th>

                  <th
                    style={{
                      width: "32%",
                    }}
                  >
                    Description
                  </th>

                  <th
                    style={{
                      width: "35%",
                    }}
                  >
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {documents.map(
                  (doc) => (

                    <tr
                      key={
                        doc.id
                      }
                    >

                      {/* SR NO */}

                      <td>
                        {doc.id}
                      </td>

                      {/* PARTICULARS */}

                      <td>
                        {
                          doc.documentName
                        }
                      </td>

                      {/* DESCRIPTION */}

                      <td>

                        <div className="description-box">

                          {
                            doc.description
                          }

                        </div>

                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="attachment-box">

                          {/* FILE INPUT */}

                          <input
                            type="file"
                            className="file-input"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                            onChange={(
                              e
                            ) =>
                              handleUpload(
                                e,
                                doc
                              )
                            }
                          />

                          {/* ACTION BUTTONS */}

                          <div className="attachment-buttons">

                            <button
                              type="button"
                              className="view-btn"
                              onClick={() =>
                                handleView(
                                  doc
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
                                  doc
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

          {/* ====================================================
              BOTTOM BUTTONS
          ==================================================== */}

          <div className="bottom-buttons">

            {/* PREVIOUS */}

            <button
              type="button"
              className="previous-btn"
              onClick={() =>
                navigate(
                  "/criteria/3.6"
                )
              }
            >

              <FaArrowLeft />

              Previous

            </button>

            {/* BACK */}

            <button
              type="button"
              className="back-btn"
              onClick={() =>
                navigate(
                  "/criteria/3.1"
                )
              }
            >

              <FaArrowLeft />

              Back

            </button>

            <div className="right-buttons">

              {/* SAVE */}

              <button
                type="button"
                className="save-btn"
                onClick={
                  handleSave
                }
              >

                <FaSave />

                Save

              </button>

              {/* DELETE */}

              <button
                type="button"
                className="delete-btn"
                onClick={
                  handleDelete
                }
              >

                <FaTrash />

                Delete

              </button>

             

             

              {/* PRINT */}

              <button
                type="button"
                className="print-btn"
                onClick={
                  handlePrint
                }
              >

                <FaPrint />

                Print

              </button>

{/*Clear */}
             {/* CLEAR */}

<button
  type="button"
  className="clear-btn"
  onClick={handleClear}
>
  Clear
</button>

            {/* NEXT */}

<button
  type="button"
  className="next-btn"
  onClick={() => navigate("/criteria/3.7.2")}
>
  <span>Next</span>
  <FaArrowRight />
</button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AttainmentCourseOutcomes;