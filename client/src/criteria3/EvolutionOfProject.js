import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NBASidebar from "../Pages/NBASidebar";
import axios from "axios";
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

import "./EvolutionOfProject.css";

function EvolutionOfProject() {
  const navigate = useNavigate();

  const [files, setFiles] = useState({});

  // =========================================================
  // 3.5 DOCUMENTS
  // =========================================================

  const documents = [
    {
      id: 1,
      documentName: "Project Rubrics",
      description:
        "Rubrics for assessing project complexity, cost, relevance to environment and sustainability.",
    },
    {
      id: 2,
      documentName: "Teamwork Rubrics",
      description:
        "Rubrics for assessing individual student performance, team work, communication, team performance and use of project management concepts.",
    },
  ];

  // =========================================================
  // GET FILE URL
  // =========================================================

  const getFileUrl = (filePath) => {
    if (!filePath) return "";

    return `http://localhost:5000/${String(filePath).replace(
      /\\/g,
      "/"
    )}`;
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleView = async (row) => {
    try {
      // CURRENT SELECTED FILE FIRST
      if (files[row.id]) {
        const localURL = URL.createObjectURL(files[row.id]);

        window.open(localURL, "_blank");

        return;
      }

      const res = await axios.get(
        "http://localhost:5000/criteria3/files/3.5"
      );

      const savedFiles = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.files)
        ? res.data.files
        : [];

      const file = savedFiles.find(
        (f) =>
          String(f.document_name).trim() ===
          String(row.documentName).trim()
      );

      if (!file) {
        alert("No File Found");
        return;
      }

      const fileUrl = getFileUrl(file.file_path);

      if (!fileUrl) {
        alert("File Path Not Found");
        return;
      }

      window.open(fileUrl, "_blank");
    } catch (err) {
      console.log("View Error:", err);
      alert("Unable to View File");
    }
  };

  // =========================================================
  // DOWNLOAD
  // =========================================================

  const handleDownload = async (row) => {
    try {
      // CURRENT SELECTED FILE FIRST
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

      const res = await axios.get(
        "http://localhost:5000/criteria3/files/3.5"
      );

      const savedFiles = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.files)
        ? res.data.files
        : [];

      const file = savedFiles.find(
        (f) =>
          String(f.document_name).trim() ===
          String(row.documentName).trim()
      );

      if (!file) {
        alert("No File Found");
        return;
      }

      const fileUrl = getFileUrl(file.file_path);

      if (!fileUrl) {
        alert("File Path Not Found");
        return;
      }

      const link = document.createElement("a");

      link.href = fileUrl;

      link.download =
        file.file_name || row.documentName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (err) {
      console.log("Download Error:", err);
      alert("Download Failed");
    }
  };

  // =========================================================
  // UPLOAD
  // =========================================================

  const handleUpload = (e, row) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [row.id]: file,
    }));

    alert(file.name + " Selected Successfully");
  };

  // =========================================================
  // SAVE
  // =========================================================

// =========================================================
// SAVE
// =========================================================

const handleSave = async () => {
  try {
    const uploadedDocs = Object.keys(files);

    if (uploadedDocs.length === 0) {
      alert("Please Upload File First");
      return;
    }

    const sessionId =
      localStorage.getItem("criteria3_session_id") ||
      localStorage.getItem("session_id");

    if (!sessionId) {
      alert("Session ID not found. Please login/start session again.");
      return;
    }

    for (const key of uploadedDocs) {
      const file = files[key];

      const row = documents.find(
        (r) => r.id === Number(key)
      );

      if (!row || !file) {
        continue;
      }

      const formData = new FormData();

      formData.append("file", file);
      formData.append("criteriaNo", "3.5");
      formData.append("documentName", row.documentName);

      // IMPORTANT:
      // document.document_id ❌
      // row.id ✅
      formData.append(
        "documentId",
        String(row.id)
      );

      formData.append(
        "description",
        row.description
      );

      formData.append(
        "session_id",
        String(sessionId)
      );

      console.log("3.5 Upload Data:", {
        session_id: sessionId,
        criteriaNo: "3.5",
        documentName: row.documentName,
        document_id: row.id,
        description: row.description,
        fileName: file.name,
      });

      const response = await axios.post(
        "http://localhost:5000/criteria3/upload/3.5",
        formData
      );

      console.log(
        "Upload Success:",
        response.data
      );
    }

    alert("Files Saved Successfully");

    // Clear selected files after successful save
    setFiles({});

    const fileInputs =
      document.querySelectorAll(
        ".document-table input[type='file']"
      );

    fileInputs.forEach((input) => {
      input.value = "";
    });

  } catch (err) {
    console.log("Save Error:", err);

    console.log(
      "Status:",
      err.response?.status
    );

    console.log(
      "Server Response:",
      err.response?.data
    );

    alert(
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Save Failed"
    );
  }
};
  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async () => {
    try {
      await axios.delete(
        "http://localhost:5000/criteria3/deleteAll/3.5"
      );

      setFiles({});

      const fileInputs =
        document.querySelectorAll(
          ".document-table input[type='file']"
        );

      fileInputs.forEach((input) => {
        input.value = "";
      });

      alert("Deleted Successfully");
    } catch (err) {
      console.log("Delete Error:", err);
      alert("Delete Failed");
    }
  };

  // =========================================================
  // CLEAR
  // =========================================================

  const handleClear = () => {
    // Clear selected files from frontend state
    setFiles({});

    // Clear all file inputs
    const fileInputs =
      document.querySelectorAll(
        ".document-table input[type='file']"
      );

    fileInputs.forEach((input) => {
      input.value = "";
    });

    // Clear temporary localStorage
    localStorage.removeItem(
      "criteria3_5_files"
    );
  };

  // =========================================================
  // ESCAPE HTML
  // =========================================================

  const escapeHTML = (value) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // =========================================================
  // GET SAVED FILES FOR PRINT
  // =========================================================

  const getSavedFilesForPrint = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/criteria3/files/3.5"
      );

      return Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.files)
        ? res.data.files
        : [];
    } catch (error) {
      console.log(
        "PRINT SAVED FILE FETCH ERROR:",
        error
      );

      return [];
    }
  };

  // =========================================================
  // LOAD BACKEND FILE AS BLOB
  // =========================================================

  const loadBackendFile = async (filePath) => {
    try {
      if (!filePath) {
        return null;
      }

      const fileUrl = getFileUrl(filePath);

      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(
          "Unable to load backend file"
        );
      }

      const blob = await response.blob();

      const fileName =
        String(filePath)
          .split("/")
          .pop() || "document";

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

  // =========================================================
  // CREATE FILE CONTENT HTML
  // =========================================================

  const createFileContent = async (file) => {
    const fileName =
      file?.name || "File";

    const extension = fileName
      .split(".")
      .pop()
      .toLowerCase();

    // =====================================================
    // PDF
    // =====================================================

    if (extension === "pdf") {
      const fileURL =
        URL.createObjectURL(file);

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
        objectURL: fileURL,
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
        URL.createObjectURL(file);

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
        objectURL: fileURL,
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
                ${escapeHTML(
                  fileName
                )}
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
                ${escapeHTML(
                  fileName
                )}
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

    // =====================================================
    // POWERPOINT
    // =====================================================

    if (
      ["ppt", "pptx"].includes(
        extension
      )
    ) {
      const fileURL =
        URL.createObjectURL(file);

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
        objectURL: fileURL,
      };
    }

    // =====================================================
    // OTHER FILES
    // =====================================================

    const fileURL =
      URL.createObjectURL(file);

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
      objectURL: fileURL,
    };
  };



  

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = async () => {
    try {
      // =====================================================
      // GET SAVED FILES
      // =====================================================

      const savedFiles =
        await getSavedFilesForPrint();

      // =====================================================
      // BUILD FILE LIST
      // CURRENT FILE HAS FIRST PRIORITY
      // =====================================================

      const printFiles = [];

      for (const row of documents) {
        // ---------------------------------------------------
        // CURRENT SELECTED FILE
        // ---------------------------------------------------

        if (files[row.id]) {
          printFiles.push({
            row,
            file: files[row.id],
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

      // =====================================================
      // NO FILE
      // =====================================================

      if (
        printFiles.length ===
        0
      ) {
        alert(
          "No files available for printing. Please Upload or Save a File First."
        );

        return;
      }

      // =====================================================
      // OPEN PRINT WINDOW
      // =====================================================

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

      // =====================================================
      // WRITE PRINT HTML
      // =====================================================

      printWindow.document.open();

      printWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

          <meta charset="UTF-8" />

          <title>
            Criteria 3.5 - Evaluation of Projects
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

            /* =================================================
               REPORT HEADER
            ================================================= */

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

            /* =================================================
               FILE CARD
            ================================================= */

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

            /* =================================================
               DOCUMENT CONTENT
            ================================================= */

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

            /* =================================================
               PDF
            ================================================= */

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

            /* =================================================
               IMAGE
            ================================================= */

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

            /* =================================================
               EXCEL
            ================================================= */

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

            /* =================================================
               UNSUPPORTED
            ================================================= */

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

            /* =================================================
               FOOTER
            ================================================= */

            .footer {
              margin-top: 25px;
              padding-top: 10px;
              border-top:
                1px solid #dddddd;
              text-align: center;
              font-size: 10px;
              color: #777777;
            }

            /* =================================================
               PRINT
            ================================================= */

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
              3.5 Evaluation of Projects
            </h2>

            <p>
              <strong>
                Project Rubrics and Teamwork Rubrics
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

      // =====================================================
      // PROCESS EVERY FILE
      // =====================================================

      const objectURLs = [];

      for (
        let index = 0;
        index < printFiles.length;
        index++
      ) {
        const item =
          printFiles[index];

        const row = item.row;
        const file = item.file;

        const fileName =
          file.name || "Document";

        let contentHTML = "";

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

        // ===================================================
        // WRITE FILE CARD
        // ===================================================

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

      // =====================================================
      // REPORT FOOTER
      // =====================================================

      printWindow.document.write(`

          <div class="footer">

            Criteria 3.5 -
            Evaluation of Projects

            <br />

            NBA Documentary Evidence Report

          </div>

        </body>

        </html>
      `);

      printWindow.document.close();

      // =====================================================
      // WAIT FOR CONTENT TO LOAD
      // =====================================================

      setTimeout(() => {
        try {
          printWindow.focus();

          printWindow.print();

          // Release object URLs after print
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
      console.log(
        "Print Error:",
        err
      );

      alert("Print Failed");
    }
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="main-container">

      <NBASidebar />

      <div className="evolution-container">

        {/* =================================================
            HEADER CARD
        ================================================= */}

        <div className="project-header-card">

          <div className="project-title">

            <div className="project-number">
              3.5
            </div>

            <div className="project-title-text">

              <h2>
                Evaluation of Projects
              </h2>

              <p>
                Evaluation of project rubrics,
                teamwork, communication and
                project management.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            DOCUMENT CARD
        ================================================= */}

        <div className="document-card">

          <div className="project-table-wrapper">

            <table className="document-table">

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

                {documents.map(
                  (item) => (

                    <tr
                      key={item.id}
                    >

                      {/* Sr No */}

                      <td className="project-sr">

                        {item.id}

                      </td>

                      {/* Document Name */}

                      <td>

                        {item.documentName}

                      </td>

                      {/* Description */}

                      <td>

                        <textarea
                          className="description-box"
                          value={
                            item.description
                          }
                          readOnly
                        />

                      </td>

                      {/* Action */}

                      <td className="attachment-cell">

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

                        {/* CURRENT FILE NAME */}

                        {files[
                          item.id
                        ] && (

                          <div className="file-name">

                            {
                              files[
                                item.id
                              ].name
                            }

                          </div>

                        )}

                        <div className="project-actions">

                          {/* View */}

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

                          {/* Download */}

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

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =================================================
            BUTTON AREA
        ================================================= */}

        <div className="page-buttons">

          <div className="navigation-buttons">

            {/* Previous */}

            <button
              type="button"
              className="previous-btn"
              onClick={() =>
                navigate(
                  "/criteria/3.4"
                )
              }
            >

              <FaArrowLeft />

              Previous

            </button>

            {/* Back */}

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

            {/* Save */}

            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
            >

              <FaSave />

              Save

            </button>

            {/* Delete */}

            <button
              type="button"
              className="delete-btn"
              onClick={handleDelete}
            >

              <FaTrash />

              Delete

            </button>

            {/* Print */}

            <button
              type="button"
              className="print-btn"
              onClick={handlePrint}
            >

              <FaPrint />

              Print

            </button>

            {/* Clear */}

            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
            >

              <FaBroom />

              Clear

            </button>

            {/* Next */}

            <button
              type="button"
              className="next-btn"
              onClick={() =>
                navigate(
                  "/criteria/3.6"
                )
              }
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

export default EvolutionOfProject;