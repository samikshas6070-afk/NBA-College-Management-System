import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import mammoth from "mammoth";

import NBASidebar from "../Pages/NBASidebar";
import {
FaBroom
} from "react-icons/fa";
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

import "./SeminarMiniProject.css";

function SeminarMiniProject() {

  const navigate = useNavigate();



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

  // ==========================
  // Rows
  // ==========================

  const rows = [
    {
      id: 1,
      documentName:
        "Seminar Mapping ",
      description:
        "Seminar PO & PSO mapping.",
    },
    {
      id: 2,
      documentName:
        "Mini Project Mapping",
      description:
        "Mini/Micro Project PO & PSO mapping.",
    },
  ];

  // ==========================
  // States
  // ==========================

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Load Uploaded Files
  // ==========================================

  useEffect(() => {
    loadUploadedFiles();
  }, []);


  const loadUploadedFiles = async () => {

  try {

  const res = await axios.get(
  "http://localhost:5000/criteria/files/2.4",
  {
  params:{
  session_id: sessionId
  }
  }
  );


  const loadedFiles = {};


  (res.data.files || []).forEach((item)=>{


  const row = rows.find(
  (r)=>
  r.documentName.trim() ===
  item.document_name.trim()
  );



  if(row){

  loadedFiles[row.id]={

  file:null,

  saved:true,

  file_name:item.file_name,

  original_name:item.original_file_name,

  name:item.original_file_name,

  session_id:sessionId

  };


  }


  });


  setFiles(loadedFiles);



  }

  catch(err){

  console.log(
  "LOAD ERROR",
  err
  );

  }

  };

  // ==========================================
  // Upload
  // ==========================================

  const handleUpload = (e,item)=>{


  const file=e.target.files[0];


  if(!file) return;



  setFiles((prev)=>({


  ...prev,


  [item.id]:{

  file,

  name:file.name,

  original_name:file.name,

  saved:false,

  session_id:sessionId

  }


  }));


  // =========================================================
  // SAVE CURRENT 2.4 FILE FOR CRITERIA 2 REPORT GENERATION
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
      // REMOVE OLD FILE OF SAME 2.4 DOCUMENT
      // -------------------------------------------------------

      const filteredFiles =
        existingFiles.filter(
          (existingFile) =>
            !(
              String(existingFile.criteriaNo) === "2.4" &&
              existingFile.documentName ===
                item.documentName
            )
        );

      // -------------------------------------------------------
      // ADD CURRENT 2.4 FILE
      // -------------------------------------------------------

      filteredFiles.push({

        criteriaNo: "2.4",

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
        "CURRENT 2.4 FILE ADDED:",
        file.name
      );

      console.log(
        "CURRENT CRITERIA 2 FILES:",
        filteredFiles
      );

    } catch (error) {

      console.error(
        "CURRENT 2.4 FILE STORAGE ERROR:",
        error
      );

    }

  };

  reader.readAsDataURL(file);


  };

  // ==========================================
  // View
  // ==========================================

  const handleView=(item)=>{


  const file=files[item.id];


  if(!file){

  alert("Please upload file first");

  return;

  }



  const url=file.saved

  ?

  `http://localhost:5000/uploads/${file.file_name}`

  :

  URL.createObjectURL(file.file);



  window.open(
  url,
  "_blank"
  );


  };

  // ==========================================
  // Download
  // ==========================================

  const handleDownload=(item)=>{


  const file=files[item.id];


  if(!file){

  alert("Please upload file first");

  return;

  }



  const url=file.saved

  ?

  `http://localhost:5000/uploads/${file.file_name}`

  :

  URL.createObjectURL(file.file);



  const link=document.createElement("a");


  link.href=url;


  link.download=

  file.original_name ||
  file.name;



  document.body.appendChild(link);


  link.click();


  document.body.removeChild(link);



  };

  // ==========================================
  // Save
  // ==========================================

  const handleSave=async()=>{


  try{


  const uploadedDocs=Object.keys(files);



  if(uploadedDocs.length===0){

  alert("Please upload file first");

  return;

  }



  let savedCount=0;



  for(const key of uploadedDocs){



  const fileData=files[key];



  if(fileData.saved)
  continue;



  const row=rows.find(
  (d)=>d.id===Number(key)
  );



  if(!row)
  continue;



  const formData=new FormData();



  formData.append(
  "criteriaNo",
  "2.4"
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



  const res=await axios.post(

  "http://localhost:5000/criteria/upload",

  formData,

  {

  headers:{

  "Content-Type":
  "multipart/form-data"

  }

  }

  );



  setFiles((prev)=>({


  ...prev,


  [key]:{

  ...prev[key],

  saved:true,

  file_name:
  res.data.data.file_name,

  original_name:
  res.data.data.original_file_name,

  name:
  res.data.data.original_file_name,

  session_id:sessionId

  }


  }));


  savedCount++;



  }



  if(savedCount>0)

  alert("Files Saved Successfully");

  else

  alert("Files Already Saved");



  loadUploadedFiles();



  }


  catch(err){

  console.log(
  "SAVE ERROR",
  err
  );


  alert("Save Failed");


  }

  };

  // ==========================================
  // Delete
  // ==========================================

  const handleDelete=async()=>{


  if(!window.confirm(
  "Delete all uploaded files?"
  ))

  return;



  try{


  await axios.delete(

  "http://localhost:5000/criteria/deleteAll/2.4",

  {

  data:{
  session_id:sessionId
  }

  }

  );



  setFiles({});



  document
  .querySelectorAll(".file-input")
  .forEach((input)=>{

  input.value="";

  });



  // =========================================================
  // REMOVE ONLY 2.4 FILES FROM CRITERIA 2 REPORT
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
        "2.4"
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


  catch(err){

  console.log(err);

  alert(
  "Delete Failed"
  );

  }

  };

  // ==========================================
  // Clear
  // ==========================================

const handleClear = () => {
  const confirmed = window.confirm(
    "Clear all 2.4 files from the current screen?"
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
    "criteria2_4_files"
  );

  localStorage.removeItem(
    "criteria2_4_loaded_files"
  );

  // -------------------------------------------------------
  // REMOVE ONLY 2.4 FROM CURRENT REPORT FILES
  // -------------------------------------------------------

  const currentFiles = JSON.parse(
    sessionStorage.getItem(
      "criteria2_current_files"
    ) || "[]"
  );

  const updatedFiles = currentFiles.filter(
    (item) =>
      String(item.criteriaNo) !== "2.4"
  );

  sessionStorage.setItem(
    "criteria2_current_files",
    JSON.stringify(updatedFiles)
  );

  // -------------------------------------------------------
  // CLEAR SESSION DATA
  // -------------------------------------------------------

  sessionStorage.removeItem(
    "criteria2_4_files"
  );

  // -------------------------------------------------------
  // SUCCESS MESSAGE
  // -------------------------------------------------------

  alert(
    "All 2.4 files cleared successfully. You can upload new files now."
  );
};

  // ==========================================
  // Print Uploaded Files
  // ==========================================

  const handlePrint = async () => {

  const uploadedFiles = Object.values(files);


  if(uploadedFiles.length === 0){

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



  if(!printWindow){

  alert(
  "Please allow popup for printing."
  );

  return;

  }



  printWindow.document.write(`

  <html>

  <head>

  <title>
  Seminar & Mini Project Report
  </title>


  <style>

  body{

  font-family:Arial;
  padding:20px;

  }


  h2,h3{

  text-align:center;

  }


  .pdf-view{

  width:100%;
  height:700px;

  }


  .img-view{

  max-width:100%;
  max-height:700px;

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
  2.4 Seminar & Mini Project
  </h3>


  `);




  for(const key of Object.keys(files)){


  const row = rows.find(
  (d)=>
  d.id === Number(key)
  );



  const file = files[key];



  if(!row || !file)
  continue;




  const fileName =

  file.original_name ||

  file.name ||

  file.file_name;




  const fileURL = file.saved

  ?

  `http://localhost:5000/uploads/${file.file_name}`

  :

  URL.createObjectURL(file.file);





  const ext =

  fileName
  .split(".")
  .pop()
  .toLowerCase();




  let previewHTML="";



  // PDF

  if(ext==="pdf"){


  previewHTML=`

  <embed

  src="${fileURL}"

  type="application/pdf"

  class="pdf-view"

  />

  `;

  }



  // Image

  else if(
  [
  "jpg",
  "jpeg",
  "png"
  ].includes(ext)

  ){


  previewHTML=`

  <img

  src="${fileURL}"

  class="img-view"

  />

  `;

  }



  // Word

  else if(ext==="docx"){


  previewHTML =

  await readFileContentHTML(
  file,
  ext
  );


  }



  // Excel

  else if(
  ext==="xlsx" ||
  ext==="xls"
  ){


  previewHTML =

  await readFileContentHTML(
  file,
  ext
  );


  }



  // Other

  else{


  previewHTML=`

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



  <br><br>


  `);



  }



  printWindow.document.write(`


  </body>

  </html>


  `);



  printWindow.document.close();



  setTimeout(()=>{


  printWindow.focus();

  printWindow.print();


  },1200);



  };





  // ==========================================
  // Read Word / Excel Preview
  // ==========================================

  const readFileContentHTML = async (
  file,
  ext
  )=>{


  let blob=file.file;




  if(!blob && file.file_name){


  try{


  const response =
  await fetch(

  `http://localhost:5000/uploads/${file.file_name}` 

  ); 



  blob = 
  await response.blob(); 


  } 

  catch(err){ 


  console.log( 
  "FILE FETCH ERROR", 
  err 
  ); 



  return ` 



  <p style="color:red"> 



  Unable to load file preview. 



  </p> 



  `; 



  } 



  } 



  if(!blob){ 



  return ` 



  <p> 



  No file available 



  </p> 



  `; 



  } 



  // DOCX 



  if(ext==="docx"){ 



  try{ 



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



  catch(err){ 



  console.log(err); 



  return ` 



  <p style="color:red"> 



  Word Preview Failed 



  </p> 



  `; 



  } 



  } 





  // EXCEL 



  if( 
  ext==="xlsx" || 
  ext==="xls" 
  ){ 



  try{ 



  const arrayBuffer = 
  await blob.arrayBuffer(); 



  const workbook = 
  XLSX.read( 



  arrayBuffer, 



  { 
  type:"array" 
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



  catch(err){ 



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

    <div className="seminar-container"> 

      {/* Header */} 
      <div className="seminar-header"> 
        <div className="seminar-title-section"> 
          <span className="seminar-badge">2.4</span> 

          <div> 
            <h2>Seminar, Mini Project</h2> 
            <p> 
              Upload and manage Seminar & Mini Project documents. 
            </p> 
          </div> 
        </div> 
      </div> 

      {/* Table */} 
      <div className="seminar-card"> 
        <table className="seminar-table"> 

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
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png" 
                      onChange={(e) => handleUpload(e, item)} 
                    /> 

                    {files[item.id] && ( 
                      <div 
                        style={{ 
                          marginTop: "8px", 
                          color: "green", 
                          fontWeight: "600", 
                          fontSize: "13px", 
                          wordBreak: "break-word", 
                        }} 
                      > 
                        📄{" "} 
                        {files[item.id].saved 
                          ? files[item.id].original_name 
                          : files[item.id].name} 
                      </div> 
                    )} 

                    <div className="attachment-buttons"> 

                      <button 
                        className="view-btn" 
                        onClick={() => handleView(item)} 
                      > 
                        <FaEye /> View 
                      </button> 

                      <button 
                        className="download-btn" 
                        onClick={() => handleDownload(item)} 
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

      <div className="bottom-buttons"> 

        <button 
          className="previous-btn" 
          onClick={() => navigate("/internship")} 
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
          disabled={loading} 
        > 
          <FaSave /> {loading ? "Saving..." : "Save"} 
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
          onClick={() => navigate("/case-study")} 
        > 
          Next <FaArrowRight /> 
        </button> 

      </div> 

    </div> 
  </div> 
); 
} 

export default SeminarMiniProject;