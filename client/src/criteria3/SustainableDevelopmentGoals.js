import React, { useEffect, useState } from "react";
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
  FaPrint,
} from "react-icons/fa";

import "./SustainableDevelopmentGoals.css";

function SustainableDevelopmentGoals() {
  const navigate = useNavigate();

  // ==========================================================
  // API CONFIGURATION
  // ==========================================================

  const API_BASE = "http://localhost:5000";
  const CRITERIA_NO = "3.6";

  // ==========================================================
  // DOCUMENT DATA
  // ==========================================================

  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentName: "SDG Evidence",
      description:
        "Evidence of addressing sustainable development goals relevant to the program",
      file: null,
      savedFile: null,
    },
  ]);

  const [loading, setLoading] = useState(false);

  // ==========================================================
  // SESSION ID
  // ==========================================================

  const getSessionId = () => {
    return localStorage.getItem("criteria3_session_id");
  };

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

    let cleanPath = String(filePath)
      .replace(/\\/g, "/")
      .trim();

    if (
      cleanPath.startsWith("http://") ||
      cleanPath.startsWith("https://")
    ) {
      return cleanPath;
    }

    cleanPath = cleanPath.replace(/^\/+/, "");

    return `${API_BASE}/${cleanPath}`;
  };

  // ==========================================================
  // GET SAVED FILES
  // ==========================================================

  const getSavedFiles = async () => {
    try {
      const sessionId = getSessionId();

      const config = sessionId
        ? {
            params: {
              session_id: sessionId,
            },
          }
        : {};

      const response = await axios.get(
        `${API_BASE}/criteria3/files/${CRITERIA_NO}`,
        config
      );

      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (Array.isArray(response.data?.files)) {
        return response.data.files;
      }

      return [];
    } catch (error) {
      console.error("GET SAVED FILES ERROR:", error);
      return [];
    }
  };

  // ==========================================================
  // LOAD SAVED FILE INFORMATION
  // ==========================================================

  const loadSavedFiles = async () => {
    try {
      const savedFiles = await getSavedFiles();

      setDocuments((previousDocuments) =>
        previousDocuments.map((doc) => {
          const savedFile = savedFiles.find(
            (item) =>
              String(item.document_name || "")
                .trim()
                .toLowerCase() ===
              String(doc.documentName || "")
                .trim()
                .toLowerCase()
          );

          return {
            ...doc,
            savedFile: savedFile || null,
          };
        })
      );
    } catch (error) {
      console.error("LOAD SAVED FILES ERROR:", error);
    }
  };

  // ==========================================================
  // LOAD SAVED DATA WHEN PAGE OPENS
  // ==========================================================

  useEffect(() => {
    loadSavedFiles();
  }, []);

  // ==========================================================
  // LOAD BACKEND FILE AS FILE OBJECT
  // ==========================================================

  const loadBackendFile = async (filePath) => {
    try {
      if (!filePath) {
        return null;
      }

      const fileURL = getFileUrl(filePath);

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

      return new File([blob], fileName, {
        type: blob.type || "application/octet-stream",
      });
    } catch (error) {
      console.error("LOAD BACKEND FILE ERROR:", error);
      return null;
    }
  };

  // ==========================================================
  // FILE CHANGE
  // ==========================================================

  const handleFileChange = (index, file) => {
    if (!file) {
      return;
    }

    setDocuments((previousDocuments) =>
      previousDocuments.map((doc, i) =>
        i === index
          ? {
              ...doc,
              file,
            }
          : doc
      )
    );
  };

  // ==========================================================
  // FIND SAVED FILE
  // ==========================================================

  const findSavedFile = async (doc) => {
    const savedFiles = await getSavedFiles();

    return (
      savedFiles.find(
        (item) =>
          String(item.document_name || "")
            .trim()
            .toLowerCase() ===
          String(doc.documentName || "")
            .trim()
            .toLowerCase()
      ) || null
    );
  };

  // ==========================================================
  // VIEW FILE
  // ==========================================================

  const handleView = async (doc) => {
    try {
      // --------------------------------------------------------
      // NEWLY SELECTED FILE
      // --------------------------------------------------------

      if (doc.file) {
        const fileURL = URL.createObjectURL(doc.file);

        const newWindow = window.open(fileURL, "_blank");

        if (!newWindow) {
          alert("Please allow pop-ups in your browser.");
          URL.revokeObjectURL(fileURL);
          return;
        }

        setTimeout(() => {
          URL.revokeObjectURL(fileURL);
        }, 60000);

        return;
      }

      // --------------------------------------------------------
      // SAVED BACKEND FILE
      // --------------------------------------------------------

      const savedFile = await findSavedFile(doc);

      if (!savedFile) {
        alert("No File Found");
        return;
      }

      const fileURL = getFileUrl(savedFile.file_path);

      if (!fileURL) {
        alert("File URL not available");
        return;
      }

      const newWindow = window.open(fileURL, "_blank");

      if (!newWindow) {
        alert("Please allow pop-ups in your browser.");
      }
    } catch (error) {
      console.error("VIEW ERROR:", error);
      alert("Unable to View File");
    }
  };

  // ==========================================================
  // DOWNLOAD FILE
  // ==========================================================

  const handleDownload = async (doc) => {
    let objectURL = null;

    try {
      // --------------------------------------------------------
      // CURRENTLY SELECTED FILE
      // --------------------------------------------------------

      if (doc.file) {
        objectURL = URL.createObjectURL(doc.file);

        const link = document.createElement("a");

        link.href = objectURL;
        link.download = doc.file.name || "document";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return;
      }

      // --------------------------------------------------------
      // SAVED BACKEND FILE
      // --------------------------------------------------------

      const savedFile = await findSavedFile(doc);

      if (!savedFile) {
        alert("No File Found");
        return;
      }

      const fileURL = getFileUrl(savedFile.file_path);

      if (!fileURL) {
        alert("File URL not available");
        return;
      }

      const response = await fetch(fileURL);

      if (!response.ok) {
        throw new Error("Unable to download file");
      }

      const blob = await response.blob();

      objectURL = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = objectURL;

      link.download =
        savedFile.file_name ||
        String(savedFile.file_path || "")
          .split("/")
          .pop() ||
        "document";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("DOWNLOAD ERROR:", error);
      alert("Download Failed");
    } finally {
      if (objectURL) {
        setTimeout(() => {
          URL.revokeObjectURL(objectURL);
        }, 2000);
      }
    }
  };

  // ==========================================================
  // SAVE FILE
  // ==========================================================
const handleSave = async () => {
  try {

    setLoading(true);

    const uploadedDocs = documents.filter(
      (doc) => doc.file instanceof File
    );

    if (uploadedDocs.length === 0) {
      alert("Please Upload File First");
      return;
    }

    const sessionId = getSessionId();

    for (const doc of uploadedDocs) {

      const formData = new FormData();

      // File
      formData.append(
        "file",
        doc.file
      );

      // Criteria
      formData.append(
        "criteriaNo",
        CRITERIA_NO
      );

      // Document name
      formData.append(
        "documentName",
        doc.documentName
      );

      // Description
      formData.append(
        "description",
        doc.description || ""
      );

      // Session
      if (sessionId) {
        formData.append(
          "session_id",
          sessionId
        );
      }

      const response = await axios.post(
        `${API_BASE}/criteria3/3.6/upload`,
        formData
      );

      console.log(
        "CRITERIA 3.6 SAVE RESPONSE:",
        response.data
      );
    }

    await loadSavedFiles();

    alert(
      "Criteria 3.6 data saved successfully"
    );

  } catch (error) {

    console.error(
      "CRITERIA 3.6 SAVE ERROR:",
      error
    );

    console.error(
      "SERVER ERROR:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Save Failed"
    );

  } finally {

    setLoading(false);

  }
};

  // ==========================================================
  // DELETE ALL SAVED FILES
  // ==========================================================

  const handleDelete = async () => {
    try {
      const sessionId = getSessionId();

      const config = sessionId
        ? {
            params: {
              session_id: sessionId,
            },
          }
        : {};

      await axios.delete(
  `${API_BASE}/criteria3/3.6/delete`,
  {
    params: {
      session_id: getSessionId(),
    },
  }
);

      setDocuments((previousDocuments) =>
        previousDocuments.map((doc) => ({
          ...doc,
          file: null,
          savedFile: null,
        }))
      );

      document
        .querySelectorAll(
          '.sdg-page input[type="file"]'
        )
        .forEach((input) => {
          input.value = "";
        });

      alert("Deleted Successfully");
    } catch (error) {
      console.error("DELETE ERROR:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Delete Failed"
      );
    }
  };

  // ==========================================================
  // CLEAR
  // ==========================================================
  // IMPORTANT:
  // Clear only clears the current frontend selection.
  // It DOES NOT delete saved files from backend/database.
  // ==========================================================

  const handleClear = () => {
    // --------------------------------------------------------
    // CLEAR CURRENTLY SELECTED FILES FROM FRONTEND
    // --------------------------------------------------------

    setDocuments((previousDocuments) =>
      previousDocuments.map((doc) => ({
        ...doc,
        file: null,
      }))
    );

    // --------------------------------------------------------
    // CLEAR FILE INPUTS
    // --------------------------------------------------------

    document
      .querySelectorAll(
        '.sdg-page input[type="file"]'
      )
      .forEach((input) => {
        input.value = "";
      });

    // --------------------------------------------------------
    // CLEAR ONLY TEMPORARY FRONTEND LOCALSTORAGE
    // --------------------------------------------------------

    localStorage.removeItem("criteria3_6_files");
    localStorage.removeItem(
      "criteria3_6_uploadedFiles"
    );

    // --------------------------------------------------------
    // IMPORTANT:
    // savedFile IS NOT CLEARED.
    // Backend/database data remains safe.
    // --------------------------------------------------------

    alert("Current selected files cleared successfully.");
  };

  // ==========================================================
  // CREATE FILE CONTENT FOR PRINT
  // ==========================================================

  const createFileContent = async (file) => {
    if (!file) {
      return {
        html: "",
        objectURL: null,
      };
    }

    const fileName = file.name || "Document";
    const lowerName = fileName.toLowerCase();
    const mimeType = file.type || "";

    // --------------------------------------------------------
    // PDF
    // --------------------------------------------------------

    if (
      mimeType === "application/pdf" ||
      lowerName.endsWith(".pdf")
    ) {
      const objectURL = URL.createObjectURL(file);

      return {
        objectURL,

        html: `
          <div class="pdf-container">
            <iframe
              class="pdf-preview"
              src="${objectURL}"
              title="${escapeHTML(fileName)}"
            ></iframe>

            <p class="pdf-note">
              PDF document preview.
            </p>
          </div>
        `,
      };
    }

    // --------------------------------------------------------
    // IMAGE
    // --------------------------------------------------------

    if (
      mimeType.startsWith("image/") ||
      /\.(jpg|jpeg|png)$/i.test(lowerName)
    ) {
      const objectURL = URL.createObjectURL(file);

      return {
        objectURL,

        html: `
          <div class="image-container">
            <img
              class="image-preview"
              src="${objectURL}"
              alt="${escapeHTML(fileName)}"
            />
          </div>
        `,
      };
    }

    // --------------------------------------------------------
    // DOCX
    // --------------------------------------------------------

    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lowerName.endsWith(".docx")
    ) {
      const arrayBuffer = await file.arrayBuffer();

      const result = await mammoth.convertToHtml({
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

    // --------------------------------------------------------
    // DOC
    // --------------------------------------------------------

    if (
      mimeType === "application/msword" ||
      lowerName.endsWith(".doc")
    ) {
      return {
        objectURL: null,

        html: `
          <div class="unsupported">
            <strong>Word Document</strong>

            <p>
              The .doc format cannot be directly
              rendered in the browser.
            </p>

            <p>
              File: ${escapeHTML(fileName)}
            </p>
          </div>
        `,
      };
    }

    // --------------------------------------------------------
    // EXCEL
    // --------------------------------------------------------

    if (
      mimeType.includes("spreadsheet") ||
      mimeType.includes("excel") ||
      /\.(xls|xlsx)$/i.test(lowerName)
    ) {
      const arrayBuffer = await file.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
      });

      let html = "";

      if (
        !workbook.SheetNames ||
        workbook.SheetNames.length === 0
      ) {
        return {
          objectURL: null,

          html: `
            <div class="unsupported">
              <strong>Excel File</strong>
              <p>No sheets found.</p>
            </div>
          `,
        };
      }

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet =
          workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(
          worksheet,
          {
            header: 1,
            defval: "",
          }
        );

        html += `
          <div class="excel-sheet">

            <h3>
              Sheet: ${escapeHTML(sheetName)}
            </h3>

            <table class="excel-table">
              <tbody>
        `;

        if (!rows || rows.length === 0) {
          html += `
            <tr>
              <td>No data available.</td>
            </tr>
          `;
        } else {
          rows.forEach((row, rowIndex) => {
            html += "<tr>";

            const safeRow = Array.isArray(row)
              ? row
              : [];

            if (safeRow.length === 0) {
              html += "<td></td>";
            }

            safeRow.forEach((cell) => {
              const tag =
                rowIndex === 0 ? "th" : "td";

              html += `
                <${tag}>
                  ${escapeHTML(cell)}
                </${tag}>
              `;
            });

            html += "</tr>";
          });
        }

        html += `
              </tbody>
            </table>

          </div>
        `;
      });

      return {
        objectURL: null,

        html: `
          <div class="document-content">
            ${html}
          </div>
        `,
      };
    }

    // --------------------------------------------------------
    // POWERPOINT
    // --------------------------------------------------------

    if (
      mimeType.includes("presentation") ||
      /\.(ppt|pptx)$/i.test(lowerName)
    ) {
      return {
        objectURL: null,

        html: `
          <div class="unsupported">
            <strong>PowerPoint Presentation</strong>

            <p>
              PowerPoint content cannot be directly
              rendered inside browser print preview.
            </p>

            <p>
              File: ${escapeHTML(fileName)}
            </p>
          </div>
        `,
      };
    }

    // --------------------------------------------------------
    // DEFAULT
    // --------------------------------------------------------

    return {
      objectURL: null,

      html: `
        <div class="unsupported">
          <strong>Unsupported File Type</strong>

          <p>
            Unable to display this file
            directly in print preview.
          </p>

          <p>
            File: ${escapeHTML(fileName)}
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
      const savedFiles = await getSavedFiles();

      const printFiles = [];

      for (const row of documents) {
        // Current uploaded file has priority
        if (row.file) {
          printFiles.push({
            row,
            file: row.file,
          });

          continue;
        }

        // Backend saved file
        const savedFile = savedFiles.find(
          (item) =>
            String(item.document_name || "")
              .trim()
              .toLowerCase() ===
            String(row.documentName || "")
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

      if (printFiles.length === 0) {
        alert(
          "No files available for printing. Please Upload or Save a File First."
        );

        return;
      }

      printWindow = window.open(
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

      printWindow.document.open();

      printWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

          <meta charset="UTF-8">

          <title>
            Criteria 3.6 - Sustainable Development Goals
          </title>

          <style>

            @page {
              size: A4;
              margin: 12mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 18px;
              background: #fff;
              color: #222;
              font-family: Arial, Helvetica, sans-serif;
            }

            .report-header {
              text-align: center;
              border-bottom: 3px solid #14579e;
              padding-bottom: 14px;
              margin-bottom: 22px;
            }

            .report-header h1 {
              margin: 0;
              color: #14579e;
              font-size: 25px;
            }

            .report-header h2 {
              margin: 7px 0 10px;
              color: #14579e;
              font-size: 18px;
            }

            .report-header p {
              margin: 5px 0;
              font-size: 13px;
            }

            .file-card {
              border: 1px solid #ccc;
              border-radius: 6px;
              margin-bottom: 22px;
              overflow: hidden;
              background: #fff;
            }

            .file-title {
              background: #eef4fa;
              color: #14579e;
              padding: 11px 13px;
              border-bottom: 1px solid #ccc;
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
              border: 1px solid #ddd;
              font-size: 12px;
              line-height: 1.55;
              overflow-wrap: break-word;
            }

            .document-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 12px 0;
            }

            .document-content th,
            .document-content td {
              border: 1px solid #999;
              padding: 6px;
              font-size: 10px;
              vertical-align: top;
            }

            .document-content th {
              background: #eef4fa;
            }

            .document-content img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 10px auto;
            }

            .pdf-preview {
              width: 100%;
              height: 850px;
              border: 1px solid #ccc;
            }

            .pdf-note {
              font-size: 10px !important;
              color: #777;
              text-align: center;
            }

            .image-container {
              text-align: center;
              margin-top: 15px;
            }

            .image-preview {
              max-width: 100%;
              max-height: 900px;
            }

            .excel-sheet {
              margin-bottom: 20px;
            }

            .excel-table {
              width: 100%;
              border-collapse: collapse;
            }

            .excel-table th,
            .excel-table td {
              border: 1px solid #999;
              padding: 5px;
              font-size: 9px;
              text-align: left;
            }

            .excel-table th {
              background: #eef4fa;
            }

            .unsupported {
              margin-top: 15px;
              padding: 18px;
              background: #f8f8f8;
              border: 1px dashed #aaa;
              text-align: center;
            }

            .footer {
              margin-top: 25px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 10px;
              color: #777;
            }

            @media print {

              body {
                padding: 0;
              }

              .file-title {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              tr {
                page-break-inside: avoid;
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
              3.6 Sustainable Development Goals
            </h2>

            <p>
              <strong>
                SDG Evidence
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
      // PRINT FILES
      // ======================================================

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
            result?.html || "";

          if (result?.objectURL) {
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

        printWindow.document.write(`

          <div class="file-card">

            <div class="file-title">

              ${escapeHTML(row.id)}.
              ${escapeHTML(row.documentName)}

            </div>

            <div class="file-body">

              <p>

                <strong>
                  Description:
                </strong>

                ${escapeHTML(row.description)}

              </p>

              <p>

                <strong>
                  File Name:
                </strong>

                <span class="file-name">
                  ${escapeHTML(fileName)}
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

            Criteria 3.6 -
            Sustainable Development Goals

            <br>

            NBA Documentary Evidence Report

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
            "PRINT WINDOW ERROR:",
            error
          );

          alert("Unable to print report.");
        }

        setTimeout(() => {
          objectURLs.forEach((url) => {
            try {
              URL.revokeObjectURL(url);
            } catch (error) {
              console.error(
                "URL REVOKE ERROR:",
                error
              );
            }
          });
        }, 5000);
      }, 3000);
    } catch (error) {
      console.error("PRINT ERROR:", error);

      if (
        printWindow &&
        !printWindow.closed
      ) {
        try {
          printWindow.close();
        } catch (closeError) {
          console.error(closeError);
        }
      }

      objectURLs.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error(error);
        }
      });

      alert("Print Failed");
    }
  };

  // ==========================================================
  // JSX
  // ==========================================================

  return (
    <div className="main-container">

      {/* SIDEBAR */}

      <NBASidebar />

      <div className="sdg-page">

        {/* HEADER */}

        <div className="page-header">

          <div className="header-left">

            <div className="criteria-circle">
              3.6
            </div>

            <div className="header-content">

              <h2>
                Sustainable Development Goals
              </h2>

              <p>
                Upload and manage Sustainable Development
                Goals related documents.
              </p>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="table-card">

          <table className="sdg-table">

            <thead>

              <tr>

                <th style={{ width: "8%" }}>
                  Sr. No.
                </th>

                <th style={{ width: "28%" }}>
                  Document Name
                </th>

                <th style={{ width: "34%" }}>
                  Description
                </th>

                <th style={{ width: "30%" }}>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {documents.map((doc, index) => (

                <tr key={doc.id}>

                  {/* SR NO */}

                  <td>
                    {doc.id}
                  </td>

                  {/* DOCUMENT NAME */}

                  <td>
                    {doc.documentName}
                  </td>

                  {/* DESCRIPTION */}

                  <td>

                    <textarea
                      className="description-box"
                      value={doc.description}
                      readOnly
                    />

                  </td>

                  {/* ACTION */}

                  <td>

                    <div className="action-area">

                      {/* FILE INPUT */}

                      <input
                        type="file"
                        className="file-input"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file =
                            e.target.files?.[0] ||
                            null;

                          handleFileChange(
                            index,
                            file
                          );
                        }}
                      />

                      {/* SHOW SELECTED/SAVED FILE */}

                      {(doc.file ||
                        doc.savedFile) && (

                        <div className="selected-file-name">

                          {doc.file
                            ? doc.file.name
                            : doc.savedFile?.file_name ||
                              doc.savedFile?.file_path
                                ?.split("/")
                                .pop() ||
                              "Saved File"}

                        </div>

                      )}

                      {/* BUTTONS */}

                      <div className="action-buttons">

                        <button
                          type="button"
                          className="view-btn"
                          onClick={() =>
                            handleView(doc)
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
                            handleDownload(doc)
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

        {/* BOTTOM BUTTONS */}

        <div className="bottom-buttons">

          {/* PREVIOUS */}

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/criteria/3.5")
            }
          >

            <FaArrowLeft />

            <span>
              Previous
            </span>

          </button>

          {/* BACK */}

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

          {/* RIGHT BUTTONS */}

          <div className="right-buttons">

            {/* SAVE */}

            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
              disabled={loading}
            >

              <FaSave />

              <span>
                {loading ? "Saving..." : "Save"}
              </span>

            </button>

            {/* DELETE */}

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

            {/* PRINT */}

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

            {/* CLEAR */}

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

            {/* NEXT */}

            <button
              type="button"
              className="next-btn"
              onClick={() =>
                navigate("/criteria/3.7")
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

export default SustainableDevelopmentGoals;