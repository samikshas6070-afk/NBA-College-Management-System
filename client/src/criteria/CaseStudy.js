import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import NBASidebar from "../Pages/NBASidebar";

import {
  FaEye,
  FaDownload,
  FaPrint,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTrash,
  FaPaperPlane,
} from "react-icons/fa";

import "./CaseStudy.css";

function CaseStudy() {

  const navigate = useNavigate();

  // ==========================================
  // SESSION ID
  // ==========================================

  const [sessionId] = useState(() => {

    let id =
      localStorage.getItem(
        "criteria2_session_id"
      );

    if (!id) {

      id =
        Date.now().toString();

      localStorage.setItem(
        "criteria2_session_id",
        id
      );

    }

    return id;

  });

  // ==========================================
  // Rows
  // ==========================================

  const rows = [
    {
      id: 1,
      documentName:
        "Case Study Mapping",
      description:
        "Case studies, real-life examples and PO & PSO Mapping.",
    },
  ];

  // ==========================================
  // States
  // ==========================================

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Load Saved Files
  // ==========================================

  useEffect(() => {

    loadFiles();

  }, [sessionId]);

  const loadFiles = async () => {

    try {

      if (!sessionId) {
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/criteria/files/2.5",
        {
          params: {
            session_id: sessionId
          }
        }
      );

      const serverFiles =
        Array.isArray(res.data?.files)
          ? res.data.files
          : Array.isArray(res.data)
          ? res.data
          : [];

      const loadedFiles = {};

      serverFiles.forEach((item) => {

        const row = rows.find(
          (r) =>
            r.documentName.trim() ===
            (item.document_name || "").trim()
        );

        if (row) {

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
              sessionId

          };

        }

      });

      setFiles(loadedFiles);

    }
    catch (err) {

      console.log(
        "Load Files Error:",
        err
      );

    }

  };

  // ==========================================
  // Upload
  // ==========================================

  const handleUpload = (e, item) => {

    const file = e.target.files[0];

    if (!file) return;

    let currentSessionId =
      localStorage.getItem(
        "criteria2_session_id"
      );

    if (!currentSessionId) {

      currentSessionId =
        Date.now().toString();

      localStorage.setItem(
        "criteria2_session_id",
        currentSessionId
      );

    }

    setFiles(prev => ({

      ...prev,

      [item.id]: {

        file: file,

        name: file.name,

        original_name: file.name,

        saved: false,

        session_id: currentSessionId

      }

    }));


    // =========================================================
    // SAVE CURRENT 2.5 FILE FOR CRITERIA 2 REPORT GENERATION
    // =========================================================

    const reader = new FileReader();

    reader.onload = () => {

      try {

        const existingFiles =
          JSON.parse(
            sessionStorage.getItem(
              "criteria2_current_files"
            ) || "[]"
          );

        // -------------------------------------------------------
        // REMOVE OLD FILE OF SAME 2.5 DOCUMENT
        // -------------------------------------------------------

        const filteredFiles =
          existingFiles.filter(
            (existingFile) =>
              !(
                String(existingFile.criteriaNo) === "2.5" &&
                existingFile.documentName ===
                  item.documentName
              )
          );

        // -------------------------------------------------------
        // ADD CURRENT 2.5 FILE
        // -------------------------------------------------------

        filteredFiles.push({

          criteriaNo: "2.5",

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
          "CURRENT 2.5 FILE ADDED:",
          file.name
        );

        console.log(
          "CURRENT CRITERIA 2 FILES:",
          filteredFiles
        );

      }
      catch (error) {

        console.error(
          "CURRENT 2.5 FILE STORAGE ERROR:",
          error
        );

      }

    };

    reader.readAsDataURL(file);


    alert(
      `${file.name} Selected Successfully`
    );

  };

  // ==========================================
  // Save
  // ==========================================

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
          rows.find(
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
          "2.5"
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

          const savedFileName =
            response.data.data
              ?.file_name ||
            "";

          const originalFileName =
            response.data.data
              ?.original_file_name ||
            fileData.original_name ||
            fileData.name ||
            fileData.file.name;

          // -------------------------------------------------------
          // UPDATE FILE STATE
          // -------------------------------------------------------

          setFiles((previous) => ({

            ...previous,

            [key]: {

              ...previous[key],

              file:
                fileData.file,

              saved:
                true,

              file_name:
                savedFileName,

              original_name:
                originalFileName,

              name:
                originalFileName,

              session_id:
                sessionId,

            },

          }));

          savedCount++;

        }

      }

      // -------------------------------------------------------
      // SUCCESS MESSAGE
      // -------------------------------------------------------

      if (
        savedCount > 0
      ) {

        alert(
          `${savedCount} file(s) saved successfully.`
        );

      }
      else {

        alert(
          "All selected files are already saved."
        );

      }

    }
    catch (error) {

      console.error(
        "SAVE 2.5 ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Save Failed."
      );

    }
    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // View
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

    let url = "";

    if (fileData.saved) {

      url =
        `http://localhost:5000/uploads/${encodeURIComponent(
          fileData.file_name
        )}`;

    }
    else {

      url =
        URL.createObjectURL(
          fileData.file
        );

    }

    window.open(
      url,
      "_blank"
    );

  };

  // ==========================================
  // Download
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

    let url = "";

    let name = "";

    if (fileData.saved) {

      url =
        `http://localhost:5000/uploads/${encodeURIComponent(
          fileData.file_name
        )}`;

      name =
        fileData.original_name ||
        fileData.file_name;

    }
    else {

      url =
        URL.createObjectURL(
          fileData.file
        );

      name =
        fileData.name;

    }

    const link =
      document.createElement("a");

    link.href = url;

    link.download = name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };

  // ==========================================
  // Delete From Database
  // ==========================================

  const handleDelete = async () => {

    try {

      const confirm =
        window.confirm(
          "Are you sure you want to delete?"
        );

      if (!confirm) return;

      const currentSessionId =
        localStorage.getItem(
          "criteria2_session_id"
        );

      await axios.delete(

        "http://localhost:5000/criteria/deleteAll/2.5",

        {
          params: {
            session_id:
              currentSessionId
          }
        }

      );

      setFiles({});

      document
        .querySelectorAll(".file-input")
        .forEach(input => {

          input.value = "";

        });


      // =========================================================
      // REMOVE ONLY 2.5 FILES FROM CRITERIA 2 REPORT
      // =========================================================

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
            "2.5"
        );

      sessionStorage.setItem(
        "criteria2_current_files",
        JSON.stringify(
          updatedFiles
        )
      );


      let recentFiles =
        JSON.parse(
          localStorage.getItem(
            "recentUploadedFiles"
          )
        ) || [];

      recentFiles =
        recentFiles.filter(
          item =>
            item.criteriaNo !==
            "2.5"
        );

      localStorage.setItem(

        "recentUploadedFiles",

        JSON.stringify(
          recentFiles
        )

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

  // =========================================================
  // CLEAR
  // =========================================================

  const handleClear = () => {

    const confirmClear =
      window.confirm(
        "Are you sure you want to clear selected files?"
      );

    if (!confirmClear) return;

    // Clear React State
    setFiles({});

    // Clear File Input Fields
    document
      .querySelectorAll(".file-input")
      .forEach((input) => {
        input.value = "";
      });

    // =========================================================
    // REMOVE ONLY 2.5 FILES FROM CRITERIA 2 REPORT
    // =========================================================

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
          "2.5"
      );

    sessionStorage.setItem(
      "criteria2_current_files",
      JSON.stringify(updatedFiles)
    );

    alert(
      "Files Cleared Successfully"
    );

  };

  // ==========================================
  // Print Uploaded Files
  // ==========================================

  const handlePrint = async () => {

    const uploadedFiles =
      Object.values(files);

    if (uploadedFiles.length === 0) {

      alert(
        "No uploaded files found."
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
        "Please allow popup for printing."
      );

      return;

    }

    printWindow.document.write(`

    <html>

    <head>

    <title>
    Criteria 2.5 Report
    </title>

    <style>

    body{

      font-family:Arial;
      padding:30px;

    }

    h3{

      margin-top:30px;

      color:#1f2937;

    }

    embed{

      width:100%;

      height:600px;

    }

    img{

      max-width:90%;

      max-height:600px;

    }

    table{

      border-collapse:collapse;

      width:100%;

    }

    td,th{

      border:1px solid #999;

      padding:8px;

    }

    hr{

      margin:30px 0;

    }

    </style>

    </head>

    <body>

    <h2>
    Criteria 2.5 Case Study & Real Life Example
    </h2>

    `);

    for (const key of Object.keys(files)) {

      const row =
        rows.find(
          (d) =>
            d.id === Number(key)
        );

      const file =
        files[key];

      if (!row || !file)
        continue;

      const fileName =
        file.original_name ||
        file.name ||
        file.file_name;

      const fileURL =
        file.saved

          ?

        `http://localhost:5000/uploads/${encodeURIComponent(
          file.file_name
        )}`

          :

        URL.createObjectURL(
          file.file
        );

      const ext =
        fileName
          .split(".")
          .pop()
          .toLowerCase();

      let previewHTML = "";

      // ==========================
      // PDF
      // ==========================

      if (ext === "pdf") {

        previewHTML = `

        <embed

        src="${fileURL}"

        type="application/pdf"

        />

        `;

      }

      // ==========================
      // IMAGE
      // ==========================

      else if (
        [
          "jpg",
          "jpeg",
          "png"
        ].includes(ext)
      ) {

        previewHTML = `

        <img

        src="${fileURL}"

        />

        `;

      }

      // ==========================
      // WORD
      // ==========================

      else if (ext === "docx") {

        previewHTML =
          await readFileContentHTML(
            file,
            ext
          );

      }

      // ==========================
      // EXCEL
      // ==========================

      else if (
        ext === "xls" ||
        ext === "xlsx"
      ) {

        previewHTML =
          await readFileContentHTML(
            file,
            ext
          );

      }

      else {

        previewHTML = `

        <div>

        <h4>
        ${fileName}
        </h4>

        <p>
        Preview not available
        </p>

        </div>

        `;

      }

      printWindow.document.write(`

      <hr>

      <h3>

      ${row.id}.
      ${row.documentName}

      </h3>

      <p>

      <b>Description :</b>

      ${row.description}

      </p>

      <p>

      <b>File Name :</b>

      ${fileName}

      </p>

      ${previewHTML}

      `);

    }

    printWindow.document.write(`

    </body>

    </html>

    `);

    printWindow.document.close();

    setTimeout(() => {

      printWindow.focus();

      printWindow.print();

    }, 1500);

  };

  // ==========================================
  // Read Word / Excel Content
  // ==========================================

  const readFileContentHTML = async (
    file,
    ext
  ) => {

    let blob =
      file.file;

    // Saved file fetch

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

        blob =
          await response.blob();

      }

      catch (err) {

        console.log(
          "FETCH ERROR",
          err
        );

        return `

        <p>

        Unable to load preview

        </p>

        `;

      }

    }

    if (!blob) {

      return "";

    }

    // ======================
    // DOCX
    // ======================

    if (ext === "docx") {

      try {

        const buffer =
          await blob.arrayBuffer();

        const result =
          await mammoth.convertToHtml({

            arrayBuffer:
              buffer

          });

        return `

        <div>

        ${result.value}

        </div>

        `;

      }

      catch (err) {

        console.log(err);

        return `

        <p>

        Word Preview Failed

        </p>

        `;

      }

    }

    // ======================
    // EXCEL
    // ======================

    if (
      ext === "xls" ||
      ext === "xlsx"
    ) {

      try {

        const buffer =
          await blob.arrayBuffer();

        const workbook =
          XLSX.read(
            buffer,
            {
              type: "array"
            }
          );

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        const html =
          XLSX.utils.sheet_to_html(
            sheet
          );

        return html;

      }

      catch (err) {

        console.log(err);

        return `

        <p>

        Excel Preview Failed

        </p>

        `;

      }

    }

    return "";

  };

  return (

    <div className="main-container">

      <NBASidebar />

      <div className="case-container">

        {/* Header */}

        <div className="case-header">

          <div className="case-title-section">

            <span className="case-badge">
              2.5
            </span>

            <div>

              <h2>
                Case Study & Real Life Example
              </h2>

              <p>
                Upload and manage Case Study documents.
              </p>

            </div>

          </div>

        </div>

        {/* Table */}

        <div className="case-card">

          <table className="case-table">

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

              {rows.map((item) => (

                <tr key={item.id}>

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
                            marginTop: "8px",
                            color: "green",
                            fontWeight: "600",
                            fontSize: "13px",
                            wordBreak:
                              "break-word",
                          }}
                        >

                          📄{" "}

                          {files[item.id].saved
                            ? files[item.id]
                                .original_name
                            : files[item.id]
                                .name}

                        </div>

                      )}

                      <div className="attachment-buttons">

                        <button
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

              ))}

            </tbody>

          </table>

        </div>

        {/* Bottom Buttons */}

        <div className="bottom-buttons">

          <button
            className="previous-btn"
            onClick={() =>
              navigate(
                "/seminar-mini-project"
              )
            }
          >

            <FaArrowLeft />
            Previous

          </button>

          <button
            className="back-btn"
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
            className="save-btn"
            onClick={handleSave}
            disabled={loading}
          >

            <FaSave />

            {loading
              ? " Saving..."
              : " Save"}

          </button>

          <button
            className="delete-btn"
            onClick={handleDelete}
          >

            <FaTrash />
            Delete

          </button>

          <button
            className="print-btn"
            onClick={handlePrint}
          >

            <FaPrint />
            Print

          </button>

          <button
            className="clear-btn"
            onClick={handleClear}
          >

            Clear

          </button>

          <button
            className="next-btn"
            onClick={() =>
              navigate("/nptel")
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

export default CaseStudy;