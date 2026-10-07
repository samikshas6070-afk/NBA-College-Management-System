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
  FaBroom,
} from "react-icons/fa";

import "./SolvingComplexProblems.css";

function SolvingComplexProblems() {

  const navigate = useNavigate();

  // ==========================================
  // Rows
  // ==========================================

  const rows = [
    {
      id: 1,
      documentName:
        "Complex Problems & SDG Mapping",
      description:
        "Complex engineering problems with targeted SDGs.",
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

          "http://localhost:5000/criteria/files/2.7",

          {

            params: {

              session_id:
                sessionId

            }

          }

        );


      const loadedFiles = {};


      res.data.forEach((item) => {

        const row =
          rows.find(

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
              item.original_name ||
              item.file_name,

            name:
              item.original_file_name ||
              item.original_name ||
              item.file_name,

            session_id:
              sessionId

          };

        }

      });


      setFiles(
        loadedFiles
      );


    }
    catch (err) {

      console.log(err);

    }

  };


  // ==========================================
  // Upload
  // ==========================================

  const handleUpload = (e, item) => {

    const file =
      e.target.files[0];


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


    setFiles((prev) => ({

      ...prev,

      [item.id]: {

        file: file,

        name:
          file.name,

        original_name:
          file.name,

        saved: false,

        session_id:
          sessionId

      }

    }));


    // =========================================================
    // SAVE CURRENT 2.7 FILE FOR CRITERIA 2 REPORT GENERATION
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
        // REMOVE OLD FILE OF SAME 2.7 DOCUMENT
        // -------------------------------------------------------

        const filteredFiles =
          existingFiles.filter(
            (existingFile) =>
              !(
                String(
                  existingFile.criteriaNo
                ) === "2.7" &&

                existingFile.documentName ===
                  item.documentName
              )
          );


        // -------------------------------------------------------
        // ADD CURRENT 2.7 FILE
        // -------------------------------------------------------

        filteredFiles.push({

          criteriaNo:
            "2.7",

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
          "CURRENT 2.7 FILE ADDED:",
          file.name
        );


        console.log(
          "CURRENT CRITERIA 2 FILES:",
          filteredFiles
        );

      }
      catch (error) {

        console.error(
          "CURRENT 2.7 FILE STORAGE ERROR:",
          error
        );

      }

    };


    reader.readAsDataURL(file);

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


    const url =

      fileData.saved

        ?

        `http://localhost:5000/uploads/${fileData.file_name}`

        :

        URL.createObjectURL(
          fileData.file
        );


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


    const url =

      fileData.saved

        ?

        `http://localhost:5000/uploads/${fileData.file_name}`

        :

        URL.createObjectURL(
          fileData.file
        );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;


    link.download =

      fileData.original_name ||

      fileData.name;


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


      // =========================================================
      // GET EXISTING RECENT FILES
      // =========================================================

      let recentFiles =
        JSON.parse(
          localStorage.getItem(
            "recentUploadedFiles"
          )
        ) || [];


      for (
        const key of uploadedDocs
      ) {

        const fileData =
          files[key];


        if (
          fileData.saved
        ) {

          alreadySavedCount++;

          continue;

        }


        const row =
          rows.find(
            (d) =>
              d.id ===
              Number(key)
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
          "2.7"
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


          // =====================================================
          // REMOVE OLD 2.7 FILE OF SAME DOCUMENT
          // =====================================================

          recentFiles =
            recentFiles.filter(
              (item) =>
                !(
                  String(
                    item.criteriaNo
                  ) === "2.7" &&

                  item.documentName ===
                    row.documentName
                )
            );


          // =====================================================
          // ADD CURRENT 2.7 FILE
          // =====================================================

          recentFiles.push({

            criteriaNo:
              "2.7",

            documentName:
              row.documentName,

            description:
              row.description,

            file_name:
              res.data.data.file_name,

            original_name:
              res.data.data.original_file_name ||
              fileData.file.name,

            session_id:
              sessionId

          });

        }

      }


      // =========================================================
      // SAVE RECENT FILES
      // =========================================================

      localStorage.setItem(

        "recentUploadedFiles",

        JSON.stringify(
          recentFiles
        )

      );


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
  // Delete
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

        "http://localhost:5000/criteria/deleteAll/2.7",

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


      // =========================================================
      // REMOVE ONLY 2.7 FILES FROM CURRENT CRITERIA 2 REPORT
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
            String(
              item.criteriaNo
            ) !== "2.7"
        );


      sessionStorage.setItem(

        "criteria2_current_files",

        JSON.stringify(
          updatedFiles
        )

      );


      // =========================================================
      // REMOVE ONLY 2.7 FILES FROM RECENT UPLOADED FILES
      // =========================================================

      let recentFiles =
        JSON.parse(
          localStorage.getItem(
            "recentUploadedFiles"
          )
        ) || [];


      recentFiles =
        recentFiles.filter(
          (item) =>
            String(
              item.criteriaNo
            ) !== "2.7"
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


  // ==========================================
  // Print Uploaded Files - Criteria 2.7
  // ==========================================

  const handlePrint = async () => {

    const uploadedFiles =
      Object.values(files);


    if (
      uploadedFiles.length === 0
    ) {

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
Solving Complex Engineering Problems Report
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

.page-break{

page-break-after:always;

}

</style>

</head>

<body>

<h2>
CRITERION 2
</h2>

<h3>
2.7 Solving Complex Engineering Problems
</h3>

`);


    for (
      const key of Object.keys(files)
    ) {

      const row =
        rows.find(
          (d) =>
            d.id ===
            Number(key)
        );


      const file =
        files[key];


      if (
        !row ||
        !file
      )
        continue;


      const fileName =

        file.original_name ||

        file.name;


      const fileURL =

        file.saved

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

      if (
        ext === "pdf"
      ) {

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

      else if (
        ext === "docx"
      ) {

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

<p>

Preview not available

</p>

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

<div class="page-break"></div>

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
  // Word / Excel Preview
  // ==========================================

  const readFileContentHTML = async (
    file,
    ext
  ) => {

    let blob =
      file.file;


    if (
      !blob &&
      file.file_name
    ) {

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
Unable to load preview.
</p>

`;

      }

    }


    if (!blob)
      return "";


    // DOCX

    if (
      ext === "docx"
    ) {

      try {

        const arrayBuffer =
          await blob.arrayBuffer();


        const result =
          await mammoth.convertToHtml({

            arrayBuffer

          });


        return result.value;

      }

      catch (err) {

        console.log(err);

        return "";

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

              type:
                "array"

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

        return "";

      }

    }


    return "";

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


      // Delete Current Criteria Files From Database

      await axios.delete(

        "http://localhost:5000/criteria/deleteAll/2.7",

        {

          params: {

            session_id:
              sessionId

          }

        }

      );


      // Clear React State

      setFiles({});


      // Clear File Input

      document
        .querySelectorAll(
          ".file-input"
        )
        .forEach(
          (input) => {

            input.value = "";

          }
        );


      // =========================================================
      // REMOVE ONLY 2.7 FILES FROM CURRENT CRITERIA 2 REPORT
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

            String(
              item.criteriaNo
            ) !== "2.7"

        );


      sessionStorage.setItem(

        "criteria2_current_files",

        JSON.stringify(
          updatedFiles
        )

      );


      // =========================================================
      // REMOVE ONLY 2.7 FILES FROM RECENT UPLOADED FILES
      // =========================================================

      let recentFiles =

        JSON.parse(

          localStorage.getItem(
            "recentUploadedFiles"
          )

        ) || [];


      recentFiles =

        recentFiles.filter(

          (item) =>

            String(
              item.criteriaNo
            ) !== "2.7"

        );


      localStorage.setItem(

        "recentUploadedFiles",

        JSON.stringify(
          recentFiles
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

      <div className="complex-container">

        {/* Header */}

        <div className="complex-header">

          <div className="complex-title-section">

            <span className="complex-badge">
              2.7
            </span>

            <div>

              <h2>
                Solving Complex Engineering Problems
              </h2>

              <p>
                Upload and manage documents related to solving complex engineering problems.
              </p>

            </div>

          </div>

        </div>


        {/* Table */}

        <div className="complex-card">

          <table className="complex-table">

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

                          {files[item.id].saved

                            ?

                            files[item.id]
                              .original_name

                            :

                            files[item.id]
                              .name}

                        </div>

                      )}


                      <div className="complex-action-buttons">

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

              ))}

            </tbody>

          </table>

        </div>


        {/* Bottom Buttons */}

        <div className="bottom-buttons">

          <button

            className="previous-btn"

            onClick={() =>
              navigate("/nptel")
            }

          >

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

            Back

          </button>


          <button

            className="save-btn"

            onClick={handleSave}

            disabled={loading}

          >

            {loading
              ? "Saving..."
              : "Save"}

          </button>


          <button

            className="delete-btn"

            onClick={handleDelete}

          >

            Delete

          </button>


          <button

            className="print-btn"

            onClick={handlePrint}

          >

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
              navigate(
                "/industry-partnership"
              )
            }

          >

            Next

          </button>

        </div>

      </div>

    </div>

  );

}

export default SolvingComplexProblems;