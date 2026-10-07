import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import "./IndustrialTrainingInternship.css";

function IndustrialTrainingInternship() {
  const navigate = useNavigate();

  const [files, setFiles] = useState({});



const sessionId =
  localStorage.getItem("criteria3_session_id") ||
  localStorage.getItem("session_id") ||
  "";
  // =========================================================
  // API BASE URL
  // =========================================================

  const API_URL = "http://localhost:5000";

  // =========================================================
  // CRITERIA 3.4 DOCUMENTS
  // =========================================================

  const documents = [
    {
      id: 1,
      documentName: "Internship Relevance",
      description:
        "Relevance of internships/industrial training",
    },
    {
      id: 2,
      documentName: "Internship Rubrics",
      description:
        "Rubrics used for assessing student industrial training/internships and appropriateness of mapping with POs",
    },
  ];

 
  // =========================================================
  // VIEW FILE
  // =========================================================

  const handleView = async (row) => {
    try {
      // -----------------------------------------------------
      // CURRENT SELECTED FILE FIRST
      // -----------------------------------------------------

      if (files[row.id]) {
        const localURL = URL.createObjectURL(
          files[row.id]
        );

        window.open(localURL, "_blank");

        setTimeout(() => {
          URL.revokeObjectURL(localURL);
        }, 5000);

        return;
      }

      // -----------------------------------------------------
      // GET SAVED BACKEND FILES
      // -----------------------------------------------------

      const savedFiles = await getSavedFiles();

      const file = savedFiles.find(
        (item) =>
          String(item.document_name).trim() ===
          String(row.documentName).trim()
      );

      if (!file) {
        alert("No File Found");
        return;
      }

      // -----------------------------------------------------
      // OPEN BACKEND FILE
      // -----------------------------------------------------

      const fileURL =
        `${API_URL}/` +
        String(file.file_path).replace(/\\/g, "/");

      window.open(fileURL, "_blank");

    } catch (error) {
      console.error(
        "VIEW FILE ERROR:",
        error
      );

      alert("Unable to View File");
    }
  };

  // =========================================================
  // DOWNLOAD FILE
  // =========================================================

  const handleDownload = async (row) => {
    try {
      // -----------------------------------------------------
      // CURRENT SELECTED FILE FIRST
      // -----------------------------------------------------

      if (files[row.id]) {
        const localURL = URL.createObjectURL(
          files[row.id]
        );

        const link =
          document.createElement("a");

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

      // -----------------------------------------------------
      // GET SAVED FILES
      // -----------------------------------------------------

      const savedFiles = await getSavedFiles();

      const file = savedFiles.find(
        (item) =>
          String(item.document_name).trim() ===
          String(row.documentName).trim()
      );

      if (!file) {
        alert("No File Found");
        return;
      }

      // -----------------------------------------------------
      // DOWNLOAD BACKEND FILE
      // -----------------------------------------------------

      const fileURL =
        `${API_URL}/` +
        String(file.file_path).replace(/\\/g, "/");

      const link =
        document.createElement("a");

      link.href = fileURL;
      link.download =
        file.original_file_name ||
        file.file_name ||
        "document";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error(
        "DOWNLOAD ERROR:",
        error
      );

      alert("Download Failed");
    }
  };

  // =========================================================
  // SAVE FILES
  // =========================================================
// =========================================================
// SAVE FILES
// =========================================================

const handleSave = async () => {
  try {
    const currentSessionId =
      localStorage.getItem("criteria3_session_id") ||
      localStorage.getItem("session_id") ||
      localStorage.getItem("nba_session_id") ||
      "";

    console.log(
      "3.4 SESSION ID:",
      currentSessionId
    );

    if (
      !currentSessionId ||
      currentSessionId === "null" ||
      currentSessionId === "undefined"
    ) {
      alert(
        "Session ID not found. Please login again."
      );
      return;
    }

    const uploadedDocs = Object.keys(files);

    if (uploadedDocs.length === 0) {
      alert("Please Upload File First");
      return;
    }

    for (const key of uploadedDocs) {
      const file = files[key];

      const row = documents.find(
        (item) =>
          item.id === parseInt(key, 10)
      );

      if (!row || !file) {
        continue;
      }

      const formData = new FormData();

      formData.append("file", file);
      formData.append("criteriaNo", "3.4");
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
        String(currentSessionId)
      );

      console.log(
        "Saving Criteria 3.4:",
        {
          session_id: currentSessionId,
          criteriaNo: "3.4",
          documentName: row.documentName,
          fileName: file.name,
        }
      );

      const response = await axios.post(
        `${API_URL}/criteria3/upload`,
        formData
      );

      console.log(
        "SAVE RESPONSE:",
        response.data
      );
    }

    alert("File Saved Successfully");

    setFiles({});

    const fileInputs =
      document.querySelectorAll(
        ".intern-container input[type='file']"
      );

    fileInputs.forEach((input) => {
      input.value = "";
    });

  } catch (error) {
    console.error(
      "CRITERIA 3.4 SAVE ERROR:",
      error
    );

    console.error(
      "BACKEND ERROR:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Save Failed"
    );
  }
};
  // =========================================================
  // DELETE ALL SAVED FILES
  // =========================================================
const handleDelete = async () => {
  try {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all Criteria 3.4 files?"
    );

    if (!confirmDelete) {
      return;
    }

    const currentSessionId =
      localStorage.getItem("criteria3_session_id") ||
      localStorage.getItem("session_id") ||
      localStorage.getItem("nba_session_id") ||
      "";

    if (!currentSessionId) {
      alert("Session ID not found. Please login again.");
      return;
    }

    await axios.delete(
      `${API_URL}/criteria3/deleteAll/3.4`,
      {
        params: {
          session_id: currentSessionId,
        },
      }
    );

    // Clear frontend state
    setFiles({});

    // Clear file inputs
    const fileInputs = document.querySelectorAll(
      ".intern-container input[type='file']"
    );

    fileInputs.forEach((input) => {
      input.value = "";
    });

    // Clear localStorage
    localStorage.removeItem("criteria3_4_files");

    alert("Deleted Successfully");
  } catch (error) {
    console.error(
      "CRITERIA 3.4 DELETE ERROR:",
      error.response?.data || error
    );

    alert(
      error.response?.data?.message ||
      "Delete Failed"
    );
  }
};
  // =========================================================
  // UPLOAD / SELECT FILE
  // =========================================================

  const handleUpload = (
    e,
    row
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setFiles(
      (previousFiles) => ({
        ...previousFiles,
        [row.id]: file,
      })
    );

    alert(
      `${file.name} Uploaded Successfully`
    );
  };

  // =========================================================
  // CLEAR FRONTEND ONLY
  // =========================================================

  const handleClear = () => {
    // -------------------------------------------------------
    // Clear React state
    // -------------------------------------------------------

    setFiles({});

    // -------------------------------------------------------
    // Clear selected file inputs
    // -------------------------------------------------------

    const fileInputs =
      document.querySelectorAll(
        ".intern-container input[type='file']"
      );

    fileInputs.forEach(
      (input) => {
        input.value = "";
      }
    );

    // -------------------------------------------------------
    // Clear displayed file names
    // -------------------------------------------------------

    const fileNames =
      document.querySelectorAll(
        ".intern-container .file-name"
      );

    fileNames.forEach(
      (element) => {
        element.textContent = "";
      }
    );

    // -------------------------------------------------------
    // Clear frontend localStorage if present
    // -------------------------------------------------------

    localStorage.removeItem(
      "criteria3_4_files"
    );
  };

  // =========================================================
  // ESCAPE HTML
  // =========================================================

  const escapeHTML = (
    value
  ) => {
    return String(value ?? "")
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  };

  // =========================================================
  // GET SAVED FILES FOR PRINT
  // =========================================================

  const getSavedFiles = async () => {
  try {
    const currentSessionId =
      localStorage.getItem("criteria3_session_id") ||
      localStorage.getItem("session_id") ||
      localStorage.getItem("nba_session_id") ||
      "";

    if (!currentSessionId) {
      console.error("Session ID not found");
      return [];
    }

    const res = await axios.get(
      `${API_URL}/criteria3/files/3.4`,
      {
        params: {
          session_id: currentSessionId,
        },
      }
    );

    if (Array.isArray(res.data)) {
      return res.data;
    }

    if (Array.isArray(res.data?.files)) {
      return res.data.files;
    }

    return [];
  } catch (error) {
    console.error(
      "GET CRITERIA 3.4 FILES ERROR:",
      error.response?.data || error
    );

    return [];
  }
};

  // =========================================================
  // CREATE FILE CONTENT HTML
  // =========================================================

  const createFileContent =
    async (file) => {
      const fileName =
        file?.name ||
        "File";

      const extension =
        fileName
          .split(".")
          .pop()
          .toLowerCase();

      // =====================================================
      // PDF
      // =====================================================

      if (
        extension === "pdf"
      ) {
        const fileURL =
          URL.createObjectURL(
            file
          );

        return {
          html: `
            <div class="pdf-container">

              <iframe
                src="${fileURL}"
                class="pdf-preview"
              ></iframe>

              <p class="pdf-note">
                PDF document is displayed above.
                Use browser print options if the PDF
                viewer requires direct printing.
              </p>

            </div>
          `,

          objectURL:
            fileURL,
        };
      }

      // =====================================================
      // IMAGE
      // =====================================================

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
          URL.createObjectURL(
            file
          );

        return {
          html: `
            <div class="image-container">

              <img
                src="${fileURL}"
                class="image-preview"
                alt="${escapeHTML(
                  fileName
                )}"
              />

            </div>
          `,

          objectURL:
            fileURL,
        };
      }

      // =====================================================
      // DOC / DOCX
      // =====================================================

      if (
        ["doc", "docx"].includes(
          extension
        )
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

          return {
            html: `
              <div class="document-content">

                ${
                  result.value ||
                  "<p>No document content found.</p>"
                }

              </div>
            `,

            objectURL:
              null,
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
                  ${escapeHTML(
                    fileName
                  )}
                </strong>

                <p>
                  Unable to read the Word document content.
                </p>

              </div>
            `,

            objectURL:
              null,
          };
        }
      }

      // =====================================================
      // EXCEL
      // =====================================================

      if (
        ["xls", "xlsx"].includes(
          extension
        )
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
                  excelHTML +=
                    "<tr>";

                  if (
                    rowData.length ===
                    0
                  ) {
                    excelHTML += `
                      <td></td>
                    `;
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

            objectURL:
              null,
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
                  ${escapeHTML(
                    fileName
                  )}
                </strong>

                <p>
                  Unable to read Excel document content.
                </p>

              </div>
            `,

            objectURL:
              null,
          };
        }
      }

      // =====================================================
      // POWERPOINT
      // =====================================================

      if (
        ["ppt", "pptx"].includes(
          extension
        )
      ) {
        const fileURL =
          URL.createObjectURL(
            file
          );

        return {
          html: `
            <div class="unsupported">

              <strong>
                ${escapeHTML(
                  fileName
                )}
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

          objectURL:
            fileURL,
        };
      }

      // =====================================================
      // OTHER FILES
      // =====================================================

      const fileURL =
        URL.createObjectURL(
          file
        );

      return {
        html: `
          <div class="unsupported">

            <strong>
              ${escapeHTML(
                fileName
              )}
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

        objectURL:
          fileURL,
      };
    };


    // =========================================================
// GET SAVED FILES FOR PRINT
// =========================================================

const getSavedFilesForPrint = async () => {
  try {
    const currentSessionId =
      localStorage.getItem("criteria3_session_id") ||
      localStorage.getItem("session_id") ||
      localStorage.getItem("nba_session_id") ||
      "";

    if (!currentSessionId) {
      console.error("Session ID not found");
      return [];
    }

    const res = await axios.get(
      `${API_URL}/criteria3/files/3.4`,
      {
        params: {
          session_id: currentSessionId,
        },
      }
    );

    if (Array.isArray(res.data)) {
      return res.data;
    }

    if (Array.isArray(res.data?.files)) {
      return res.data.files;
    }

    return [];
  } catch (error) {
    console.error(
      "GET SAVED FILES FOR PRINT ERROR:",
      error.response?.data || error
    );

    return [];
  }
};


// =========================================================
// LOAD BACKEND FILE
// =========================================================

const loadBackendFile = async (filePath) => {
  try {
    if (!filePath) {
      return null;
    }

    const cleanPath = String(filePath)
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

    const fileURL = `${API_URL}/${cleanPath}`;

    const response = await fetch(fileURL);

    if (!response.ok) {
      throw new Error(
        `Unable to load file: ${response.status}`
      );
    }

    const blob = await response.blob();

    const fileName =
      cleanPath.split("/").pop() || "document";

    return new File(
      [blob],
      fileName,
      {
        type: blob.type || "application/octet-stream",
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

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = async () => {
    try {
      // -----------------------------------------------------
      // GET SAVED BACKEND FILES
      // -----------------------------------------------------

      const savedFiles =
        await getSavedFilesForPrint();

      // -----------------------------------------------------
      // BUILD PRINT FILE LIST
      // -----------------------------------------------------

      const printFiles = [];

      for (
        const row of documents
      ) {
        // ---------------------------------------------------
        // CURRENT SELECTED FILE
        // ---------------------------------------------------

        if (
          files[row.id]
        ) {
          printFiles.push({
            row,
            file:
              files[row.id],
          });

          continue;
        }

        // ---------------------------------------------------
        // SAVED BACKEND FILE
        // ---------------------------------------------------

        const savedFile =
          savedFiles.find(
            (item) =>
              String(
                item.document_name
              ).trim() ===
              String(
                row.documentName
              ).trim()
          );

        if (
          savedFile
        ) {
          const backendFile =
            await loadBackendFile(
              savedFile.file_path
            );

          if (
            backendFile
          ) {
            printFiles.push({
              row,
              file:
                backendFile,
            });
          }
        }
      }

      // -----------------------------------------------------
      // NO FILE
      // -----------------------------------------------------

      if (
        printFiles.length === 0
      ) {
        alert(
          "No files available for printing. Please Upload or Save a File First."
        );

        return;
      }

      // -----------------------------------------------------
      // OPEN PRINT WINDOW
      // -----------------------------------------------------

      const printWindow =
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

      // -----------------------------------------------------
      // START DOCUMENT
      // -----------------------------------------------------

      printWindow.document.open();

      printWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

          <meta charset="UTF-8" />

          <title>
            Criteria 3.4 - Industrial Training / Internship
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
              padding: 11px 13px;
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
              border-collapse: collapse;
              margin:
                12px 0;
              page-break-inside: auto;
            }

            .document-content tr {
              page-break-inside: avoid;
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
              font-size: 10px !important;
              color: #777777 !important;
              text-align: center;
            }

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
              border-collapse: collapse;
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

            .download-file-link {
              display: inline-block;
              margin-top: 8px;
              padding:
                8px 12px;
              background: #14579e;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
              font-size: 11px;
            }

            .footer {
              margin-top: 25px;
              padding-top: 10px;
              border-top:
                1px solid #dddddd;
              text-align: center;
              font-size: 10px;
              color: #777777;
            }

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
              3.4 Industrial Training / Internship
            </h2>

            <p>
              <strong>
                Internship Relevance and Internship Rubrics
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

      // -----------------------------------------------------
      // PROCESS FILES
      // -----------------------------------------------------

      const objectURLs = [];

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
          file.name ||
          "Document";

        let contentHTML =
          "";

        try {
          const result =
            await createFileContent(
              file
            );

          contentHTML =
            result.html;

          if (
            result.objectURL
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

        // ---------------------------------------------------
        // FILE CARD
        // ---------------------------------------------------

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

      // -----------------------------------------------------
      // FOOTER
      // -----------------------------------------------------

      printWindow.document.write(`

          <div class="footer">

            Criteria 3.4 -
            Industrial Training / Internship

            <br />

            NBA Documentary Evidence Report

          </div>

        </body>

        </html>

      `);

      printWindow.document.close();

      // -----------------------------------------------------
      // PRINT
      // -----------------------------------------------------

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

    } catch (error) {
      console.error(
        "PRINT ERROR:",
        error
      );

      alert(
        "Print Failed"
      );
    }
  };

  // =========================================================
  // JSX
  // =========================================================
    // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="main-container">

      {/* =====================================================
          NBA SIDEBAR
      ===================================================== */}

      <NBASidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="content-container">

        <div className="intern-container">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="intern-header-card">

            <div className="intern-title">

              <div className="intern-number">
                3.4
              </div>

              <div className="intern-title-text">

                <h2>
                  Industrial Training / Internship
                </h2>

                <p>
                  Upload and manage industrial training and
                  internship related documents.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              TABLE CARD
          ================================================= */}

          <div className="intern-card">

            <div className="intern-table-wrapper">

              <table className="intern-table">

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

                      {/* =====================================
                          SR NO
                      ===================================== */}

                      <td className="intern-sr">

                        {item.id}

                      </td>

                      {/* =====================================
                          DOCUMENT NAME
                      ===================================== */}

                      <td>

                        {item.documentName}

                      </td>

                      {/* =====================================
                          DESCRIPTION
                      ===================================== */}

                      <td>

                        <textarea
                          className="description-box"
                          value={item.description}
                          readOnly
                        />

                      </td>

                      {/* =====================================
                          ACTION
                      ===================================== */}

                      <td className="attachment-cell">

                        {/* =================================
                            FILE INPUT
                        ================================= */}

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

                        {/* =================================
                            CURRENT SELECTED FILE NAME
                        ================================= */}

                        {files[item.id] && (

                          <div className="file-name">

                            {files[item.id].name}

                          </div>

                        )}

                        {/* =================================
                            VIEW / DOWNLOAD
                        ================================= */}

                        <div className="intern-actions">

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

          <div className="intern-bottom-buttons">

            {/* ===============================================
                PREVIOUS
            =============================================== */}

            <button
              type="button"
              className="previous-btn"
              onClick={() =>
                navigate("/criteria/3.3")
              }
            >

              <FaArrowLeft />

              <span>
                Previous
              </span>

            </button>

            {/* ===============================================
                BACK
            =============================================== */}

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

            {/* ===============================================
                SAVE
            =============================================== */}

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

            {/* ===============================================
                DELETE
            =============================================== */}

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

            {/* ===============================================
                PRINT
            =============================================== */}

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

            {/* ===============================================
                CLEAR
            =============================================== */}

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

            {/* ===============================================
                NEXT
            =============================================== */}

            <button
              type="button"
              className="next-btn"
              onClick={() =>
                navigate("/criteria/3.5")
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

export default IndustrialTrainingInternship;