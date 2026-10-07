import React, { useState, useEffect } from "react";
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
  FaPaperPlane,
  FaArrowRight,
  FaBroom,
} from "react-icons/fa";

import "./Internship.css";

function Internship() {

  const navigate = useNavigate();

  const [files, setFiles] = useState({});

  // ===========================
  // Session ID
  // ===========================
  const sessionId = React.useMemo(() => {

    let id = localStorage.getItem(
      "criteria2_session_id"
    );

    if (!id) {

      id = Date.now().toString();

      localStorage.setItem(
        "criteria2_session_id",
        id
      );

    }

    return id;

  }, []);

  const rows = [
    {
      id: 1,
      documentName:
        "Process of Internship/Industrial Training for Students",
      description:
        "Internship process and training guidelines.",
    },
    {
      id: 2,
      documentName:
        "Mapping of Industrial Training/Internships with POs and PSOs ",
      description:
        "PO & PSO mapping for internships.",
    },
    {
      id: 3,
      documentName:
        "Student Feedback on Training/Internships and Its Analysis ",
      description:
        "Student feedback and analysis reports.",
    },
  ];

  // ===========================
  // Load Uploaded Files
  // ===========================

  useEffect(() => {
    loadUploadedFiles();
  }, []);

  const loadUploadedFiles = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/criteria/files/2.3",
        {
          params: {
            session_id: sessionId,
          },
        }
      );

      if (res.data.success) {

        const loadedFiles = {};

        res.data.files.forEach((item) => {

          const row = rows.find(
            (r) =>
              r.documentName.trim() ===
              item.document_name.trim()
          );

          if (row) {

            loadedFiles[row.id] = {

              file: null,
              saved: true,

              file_name:
                item.file_name,

              original_name:
                item.original_file_name,

              name:
                item.original_file_name,

              session_id:
                sessionId,

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

  // ===========================
  // Upload File
  // ===========================

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

      }

    }));


    // =========================================================
    // SAVE CURRENT 2.3 FILE FOR CRITERIA 2 REPORT GENERATION
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
        // REMOVE OLD FILE OF SAME 2.3 DOCUMENT
        // -------------------------------------------------------

        const filteredFiles =
          existingFiles.filter(
            (existingFile) =>
              !(
                String(existingFile.criteriaNo) === "2.3" &&
                existingFile.documentName ===
                  item.documentName
              )
          );

        // -------------------------------------------------------
        // ADD CURRENT 2.3 FILE
        // -------------------------------------------------------

        filteredFiles.push({

          criteriaNo: "2.3",

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
          "CURRENT 2.3 FILE ADDED:",
          file.name
        );

        console.log(
          "CURRENT CRITERIA 2 FILES:",
          filteredFiles
        );

      } catch (error) {

        console.error(
          "CURRENT 2.3 FILE STORAGE ERROR:",
          error
        );

      }

    };

    reader.readAsDataURL(file);

  };


  // ===========================
  // View File
  // ===========================

  const handleView = (item) => {

    const file = files[item.id];

    if (!file) {

      alert("Please upload file first");

      return;

    }

    const url = file.saved

      ? `http://localhost:5000/uploads/${file.file_name}`

      : URL.createObjectURL(file.file);

    window.open(url, "_blank");

  };


  // ===========================
  // Download File
  // ===========================

  const handleDownload = (item) => {

    const file = files[item.id];

    if (!file) {

      alert("Please upload file first");

      return;

    }

    const url = file.saved

      ? `http://localhost:5000/uploads/${file.file_name}`

      : URL.createObjectURL(file.file);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      file.original_name ||
      file.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };


  // ===========================
  // Save Files
  // ===========================

  const handleSave = async () => {

    try {

      const uploadedDocs =
        Object.keys(files);

      if (uploadedDocs.length === 0) {

        alert("Please upload file first");

        return;

      }

      const newFiles =
        uploadedDocs.filter(
          (key) => !files[key].saved
        );

      if (newFiles.length === 0) {

        alert("Files Already Saved");

        return;

      }

      let savedCount = 0;

      for (const key of newFiles) {

        const fileData = files[key];

        const row = rows.find(
          (d) =>
            d.id === Number(key)
        );

        if (!row) continue;

        const formData =
          new FormData();

        formData.append(
          "criteriaNo",
          "2.3"
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

        const res = await axios.post(

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
                res.data.data.original_file_name,

              name:
                res.data.data.original_file_name,

              session_id:
                sessionId

            }

          }));

          savedCount++;

        }

      }

      if (savedCount > 0) {

        alert(
          "Files Saved Successfully"
        );

      }
      else {

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


  // =========================================================
// CLEAR
// =========================================================

const handleClear = () => {
  const confirmed = window.confirm(
    "Clear all 2.3 files from the current screen?"
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
    "criteria2_3_files"
  );

  localStorage.removeItem(
    "criteria2_3_loaded_files"
  );

  // -------------------------------------------------------
  // REMOVE ONLY 2.3 FROM CURRENT REPORT FILES
  // -------------------------------------------------------

  const currentFiles = JSON.parse(
    sessionStorage.getItem(
      "criteria2_current_files"
    ) || "[]"
  );

  const updatedFiles = currentFiles.filter(
    (item) =>
      String(item.criteriaNo) !== "2.3"
  );

  sessionStorage.setItem(
    "criteria2_current_files",
    JSON.stringify(updatedFiles)
  );

  // -------------------------------------------------------
  // CLEAR SESSION DATA
  // -------------------------------------------------------

  sessionStorage.removeItem(
    "criteria2_3_files"
  );

  // -------------------------------------------------------
  // SUCCESS MESSAGE
  // -------------------------------------------------------

  alert(
    "All 2.3 files cleared successfully. You can upload new files now."
  );
};


  // ===========================
  // Delete Files
  // ===========================

  const handleDelete = async () => {

    if (
      !window.confirm(
        "Delete uploaded files?"
      )
    )
      return;

    try {

      await axios.delete(

        "http://localhost:5000/criteria/deleteAll/2.3",

        {

          data: {
            session_id: sessionId
          }

        }

      );

      setFiles({});

      document
        .querySelectorAll(".file-input")
        .forEach((input) => {

          input.value = "";

        });


      // =========================================================
      // REMOVE ONLY 2.3 FILES FROM CRITERIA 2 REPORT
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
            "2.3"
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
    Criterion 2.3 Internship
    </title>

    <style>

    body{
      font-family:Arial;
      padding:20px;
    }

    h2,h3{
      text-align:center;
    }

    embed{
      width:100%;
      height:700px;
      border:1px solid #ccc;
    }

    img{
      max-width:100%;
      max-height:700px;
    }

    table{
      width:100%;
      border-collapse:collapse;
    }

    table,td,th{
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
    2.3 Internship
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
        file.name ||
        file.file_name;

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

        />

        `;

      }


      // IMAGE

      else if (
        ["jpg", "jpeg", "png"].includes(ext)
      ) {

        previewHTML = `

        <img

        src="${fileURL}"

        />

        `;

      }


      // WORD

      else if (ext === "docx") {

        previewHTML =
          await readFileContentHTML(
            file,
            ext
          );

      }


      // EXCEL

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

        <div
        style="
        padding:20px;
        border:1px solid #ccc;
        ">

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

      <b>File :</b>

      ${fileName}

      </p>

      ${previewHTML}

      <br><br>

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
  // Read Word / Excel File
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

        <p style="color:red">

        Unable to load file preview

        </p>

        `;

      }

    }

    if (!blob) {

      return `

      <p>
      No file available
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

        <p style="color:red">

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

        const html =
          XLSX.utils.sheet_to_html(
            sheet
          );

        return `

        <div>

        ${html}

        </div>

        `;

      }

      catch (err) {

        console.log(err);

        return `

        <p style="color:red">

        Excel Preview Failed

        </p>

        `;

      }

    }


    return `

    <p>
    Preview not available
    </p>

    `;

  };


  return (
    <div className="main-container">

      <NBASidebar />

      <div className="internship-container">

        {/* Header */}

        <div className="internship-header">

          <div className="internship-title-section">

            <span className="internship-badge">
              2.3
            </span>

            <div>

              <h2>Internship</h2>

              <p>
                Upload and manage Internship related documents.
              </p>

            </div>

          </div>

        </div>


        {/* Table */}

        <div className="internship-card">

          <table className="internship-table">

            <thead>

              <tr>

                <th>Sr. No.</th>

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

                  <td>

                    <div className="attachment-box">

                      <input
                        type="file"
                        className="file-input"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                        onChange={(e) =>
                          handleUpload(e, item)
                        }
                      />

                      {files[item.id] && (

                        <div
                          style={{
                            marginTop: "8px",
                            color: "green",
                            fontWeight: "600",
                            fontSize: "13px",
                          }}
                        >

                          📄{" "}
                          {files[item.id]?.original_name ||
                            files[item.id]?.file_name}

                        </div>

                      )}

                      <div className="internship-action-buttons">

                        <button
                          type="button"
                          className="view-btn"
                          onClick={() =>
                            handleView(item)
                          }
                        >
                          <FaEye /> View
                        </button>

                        <button
                          type="button"
                          className="download-btn"
                          onClick={() =>
                            handleDownload(item)
                          }
                        >
                          <FaDownload /> Download
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

        <div className="internship-bottom-buttons">

          <button
            className="previous-btn"
            onClick={() =>
              navigate("/criteria/2.2-capstone-project")
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
            className="save-btn"
            onClick={handleSave}
          >
            <FaSave /> Save
          </button>

          <button
            className="delete-btn"
            onClick={handleDelete}
          >
            <FaTrash /> Delete
          </button>

          <button
            className="print-btn"
            onClick={handlePrint}
          >
            <FaPrint /> Print
          </button>

          <button
            className="capstone-clear-btn"
            onClick={handleClear}
          >
            <FaBroom /> Clear
          </button>

          <button
            className="next-btn"
            onClick={() =>
              navigate("/seminar-mini-project")
            }
          >
            Next <FaArrowRight />
          </button>

        </div>

      </div>

    </div>
  );

}

export default Internship;