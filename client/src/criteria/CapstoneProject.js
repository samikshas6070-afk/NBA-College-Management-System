import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NBASidebar from "../Pages/NBASidebar";
import axios from "axios";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import {
  FaEye,
  FaDownload,
  FaPrint,
  FaArrowLeft,
  FaSave,
  FaTrash,
  FaArrowRight,
  FaBroom,
} from "react-icons/fa";

import "./CapstoneProject.css";

function CapstoneProject() {

  const navigate = useNavigate();

  // ===========================
  // Session ID
  // ===========================
  const sessionId = useMemo(() => {
    let id = localStorage.getItem("criteria2_session_id");

    if (!id) {
      id = Date.now().toString();
      localStorage.setItem("criteria2_session_id", id);
    }

    return id;
  }, []);

  // ===========================
  // States
  // ===========================
  const [files, setFiles] = useState({});

  // ===========================
  // Rows
  // ===========================
  const rows = [
    {
      id: 1,
      documentName:
        "Project & Guide Allocation",
      description:
        "Project allocation and guide assignment records.",
    },
    {
      id: 2,
      documentName:
        "Project Relevance & PO/PSO Contribution",
      description:
        "Project relevance and PO/PSO mapping documents.",
    },
    {
      id: 3,
      documentName:
        "Continuous Monitoring Process",
      description:
        "Project review, progress, and monitoring records.",
    },
    {
      id: 4,
      documentName:
        "Project Quality & Prototypes",
      description:
        "Completed projects with sustainability, safety, ethics and cost aspects.",
    },
  ];

  // ==========================================
  // Load Uploaded Files
  // ==========================================

  useEffect(() => {
    loadUploadedFiles();
  }, []);

  const loadUploadedFiles = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/criteria/files/2.2",
        {
          params: {
            session_id: sessionId,
          },
        }
      );

      if (res.data.success) {

        const loadedFiles = {};

        res.data.files.forEach((item) => {

          const doc = rows.find(
            (d) =>
              d.documentName.trim() ===
              item.document_name.trim()
          );

          if (doc) {

            loadedFiles[doc.id] = {

              file: null,

              saved: true,

              file_name: item.file_name,

              original_name:
                item.original_file_name,

              name:
                item.original_file_name,

              session_id: sessionId,

            };

          }

        });

        setFiles(loadedFiles);

      }

    } catch (err) {

      console.log(
        "LOAD FILE ERROR",
        err
      );

    }

  };

  // ==========================================
  // Upload File
  // ==========================================

  const handleUpload = (e, item) => {

    const file = e.target.files[0];

    if (!file) return;

    setFiles((prev) => ({

      ...prev,

      [item.id]: {

        file,

        name: file.name,

        original_name: file.name,

        saved: false,

        session_id: sessionId,

      },

    }));


    // =========================================================
    // SAVE CURRENT 2.2 FILE FOR CRITERIA 2 REPORT GENERATION
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
        // REMOVE OLD FILE OF SAME 2.2 DOCUMENT
        // -------------------------------------------------------

        const filteredFiles =
          existingFiles.filter(
            (existingFile) =>
              !(
                String(existingFile.criteriaNo) === "2.2" &&
                existingFile.documentName ===
                  item.documentName
              )
          );

        // -------------------------------------------------------
        // ADD CURRENT 2.2 FILE
        // -------------------------------------------------------

        filteredFiles.push({

          criteriaNo: "2.2",

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
          "CURRENT 2.2 FILE ADDED:",
          file.name
        );

        console.log(
          "CURRENT CRITERIA 2 FILES:",
          filteredFiles
        );

      } catch (error) {

        console.error(
          "CURRENT 2.2 FILE STORAGE ERROR:",
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

    const file = files[item.id];

    if (!file) {

      alert("Please upload file first");

      return;

    }

    let fileURL = "";

    if (file.saved) {

      fileURL =
        `http://localhost:5000/uploads/${file.file_name}`;

    }
    else {

      fileURL =
        URL.createObjectURL(file.file);

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

    const file = files[item.id];

    if (!file) {

      alert("Please upload file first");

      return;

    }

    let fileURL = "";

    if (file.saved) {

      fileURL =
        `http://localhost:5000/uploads/${file.file_name}`;

    }
    else {

      fileURL =
        URL.createObjectURL(file.file);

    }

    const link =
      document.createElement("a");

    link.href = fileURL;

    link.download =
      file.original_name ||
      file.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };

  // ==========================================
  // Save Files
  // ==========================================

  const handleSave = async () => {

    try {

      const uploadedDocs =
        Object.keys(files);

      if (uploadedDocs.length === 0) {

        alert("Please upload file first");

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

      for (const key of uploadedDocs) {

        const fileData =
          files[key];

        // Already saved

        if (fileData.saved === true) {

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
          "criteriaNo",
          "2.2"
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

        if (res.data.success) {

          setFiles((prev) => ({

            ...prev,

            [key]: {

              ...prev[key],

              saved: true,

              file_name:
                res.data.data.file_name,

              original_name:
                res.data.data.original_file_name ||
                fileData.file.name,

              name:
                res.data.data.original_file_name ||
                fileData.file.name,

              session_id:
                sessionId

            }

          }));

          savedCount++;

        }

      }

      // Messages

      if (savedCount > 0) {

        alert(
          "Files Saved Successfully"
        );

      }

      else if (alreadySavedCount > 0) {

        alert(
          "Files Already Saved"
        );

      }

      else {

        alert(
          "No new files to save"
        );

      }

    }

    catch (err) {

      console.log(
        "SAVE ERROR",
        err
      );

      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Save Failed"
      );

    }

  };

  // ==========================================
  // Delete Files
  // ==========================================

  const handleDelete = async () => {

    if (
      !window.confirm(
        "Delete all uploaded files?"
      )
    )
      return;

    try {

      await axios.delete(

        "http://localhost:5000/criteria/deleteAll/2.2",

        {

          data: {

            session_id:
              sessionId,

          }

        }

      );

      setFiles({});

      document
        .querySelectorAll(".file-input")
        .forEach((input) => {

          input.value = "";

        });

      localStorage.removeItem(
        "criteria2_2_files"
      );


      // =========================================================
      // REMOVE ONLY 2.2 FILES FROM CRITERIA 2 REPORT
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
            "2.2"
        );

      sessionStorage.setItem(
        "criteria2_current_files",
        JSON.stringify(
          updatedFiles
        )
      );


      alert(
        "Deleted Successfully"
      );

    }

    catch (err) {

      console.log(
        "DELETE ERROR",
        err
      );

      alert(
        "Delete Failed"
      );

    }

  };
// =========================================================
// CLEAR
// =========================================================

const handleClear = () => {
  const confirmed = window.confirm(
    "Clear all 2.2 data from the current screen?"
  );

  if (!confirmed) {
    return;
  }

  // -------------------------------------------------------
  // CLEAR FILES FROM FRONTEND
  // -------------------------------------------------------

  setFiles({});

  
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
    "criteria2_2_files"
  );

  localStorage.removeItem(
    "criteria2_2_loaded_files"
  );

  // -------------------------------------------------------
  // REMOVE ONLY 2.2 FROM CURRENT REPORT FILES
  // -------------------------------------------------------

  const currentFiles = JSON.parse(
    sessionStorage.getItem(
      "criteria2_current_files"
    ) || "[]"
  );

  const updatedFiles = currentFiles.filter(
    (item) =>
      String(item.criteriaNo) !== "2.2"
  );

  sessionStorage.setItem(
    "criteria2_current_files",
    JSON.stringify(updatedFiles)
  );

  // -------------------------------------------------------
  // CLEAR SESSION DATA
  // -------------------------------------------------------

  sessionStorage.removeItem(
    "criteria2_2_files"
  );

  // -------------------------------------------------------
  // SUCCESS MESSAGE
  // -------------------------------------------------------

  alert(
    "All 2.2 data cleared successfully. You can upload new files now."
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
      Capstone Project Report
      </title>

      <style>

      body{

        font-family:Arial;

        padding:20px;

      }

      h2{

        text-align:center;

      }

      .pdf-view{

        width:100%;

        height:700px;

      }

      .img-view{

        width:500px;

      }

      table{

        border-collapse:collapse;

        width:100%;

      }

      td,th{

        border:1px solid #999;

        padding:8px;

      }

      </style>

      </head>

      <body>

      <h2>
      CRITERION 2
      </h2>

      <h3>
      2.2 Capstone Project
      </h3>

    `);

    for (const key of Object.keys(files)) {

      const row = rows.find(
        (d) =>
          d.id === Number(key)
      );

      const file = files[key];

      if (!row || !file)
        continue;

      const fileName =
        file.original_name ||
        file.name;

      const fileURL = file.saved

        ?
        `http://localhost:5000/uploads/${file.file_name}`

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

      // Image

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

        class="img-view"

        />

        `;

      }

      // Word

      else if (ext === "docx") {

        previewHTML =
          await readFileContentHTML(
            file,
            ext
          );

      }

      // Excel

      else if (
        ext === "xlsx" ||
        ext === "xls"
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
        Preview not available.
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

      <b>
      Description :
      </b>

      ${row.description}

      </p>

      <p>

      <b>
      File :
      </b>

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

    }, 1200);

  };

  // ==========================================
  // Read Word / Excel Preview
  // ==========================================

  const readFileContentHTML = async (
    file,
    ext
  ) => {

    let blob = file.file;

    if (!blob && file.file_name) {

      try {

        const response =
          await fetch(

            `http://localhost:5000/uploads/${file.file_name}`

          );

        blob =
          await response.blob();

      }

      catch (err) {

        console.log(
          "FILE FETCH ERROR",
          err
        );

        return `

        <p>
        Unable to load file preview.
        </p>

        `;

      }

    }

    if (!blob) {

      return `

      <p>
      No file available.
      </p>

      `;

    }

    // DOCX

    if (ext === "docx") {

      try {

        const arrayBuffer =
          await blob.arrayBuffer();

        const result =
          await mammoth.convertToHtml({

            arrayBuffer

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

    // EXCEL

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
              type: "array"
            }
          );

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        return XLSX.utils.sheet_to_html(
          sheet
        );

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

    return `

    <p>
    Preview not available.
    </p>

    `;

  };

  return (
    <div className="main-container">

      <NBASidebar />

      <div className="capstone-container">

        <div className="capstone-header">

          <div className="capstone-title-section">

            <span className="capstone-badge">
              2.2
            </span>

            <div>

              <h2>Capstone Project</h2>

              <p>
                Upload and manage Capstone Project related documents.
              </p>

            </div>

          </div>

        </div>

        <div className="capstone-card">

          <table className="capstone-table">

            <thead>

              <tr>

                <th>Sr.No.</th>

                <th>Document Name</th>

                <th>Description</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {rows.map((item) => (

                <tr key={item.id}>

                  <td>{item.id}</td>

                  <td>{item.documentName}</td>

                  <td>

                    <textarea
                      className="description-box"
                      value={item.description}
                      readOnly
                    />

                  </td>

                  <td className="attachment-cell">

                    <input
                      type="file"
                      className="file-input"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleUpload(e, item)
                      }
                    />

                    {files[item.id] && (

                      <div
                        style={{
                          marginTop: "8px",
                          color: "green",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >

                        📄{" "}
                        {files[item.id].original_name ||
                          files[item.id].name ||
                          files[item.id].file_name}

                      </div>

                    )}

                    <div className="capstone-action-buttons">

                      <button
                        className="view-btn"
                        onClick={() =>
                          handleView(item)
                        }
                      >
                        <FaEye /> View
                      </button>

                      <button
                        className="download-btn"
                        onClick={() =>
                          handleDownload(item)
                        }
                      >
                        <FaDownload /> Download
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div className="capstone-bottom-buttons">

          <button
            className="previous-btn"
            onClick={() =>
              navigate("/criteria/2.1-quality-teaching-learning")
            }
          >
            <FaArrowLeft /> Previous
          </button>

          <button
            className="back-btn"
            onClick={() =>
              navigate("/criteria/2.1-quality-teaching-learning")
            }
          >
            <FaArrowLeft /> Back
          </button>

          <button
            className="capstone-save-btn"
            onClick={handleSave}
          >
            <FaSave /> Save
          </button>

          <button
            className="capstone-delete-btn"
            onClick={handleDelete}
          >
            <FaTrash /> Delete
          </button>

          <button
            className="capstone-clear-btn"
            onClick={handleClear}
          >
            <FaBroom /> Clear
          </button>

          <button
            className="capstone-print-btn"
            onClick={handlePrint}
          >
            <FaPrint /> Print
          </button>

          <button
            className="capstone-next-btn"
            onClick={() =>
              navigate("/internship")
            }
          >
            Next <FaArrowRight />
          </button>

        </div>

      </div>

    </div>
  );

}

export default CapstoneProject;