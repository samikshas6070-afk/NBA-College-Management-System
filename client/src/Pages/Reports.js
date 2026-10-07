import React, { useEffect, useState } from "react";
import axios from "axios";
import NBASidebar from "./NBASidebar";

import {
  FaEye,
  FaTrash,
  FaSyncAlt,
} from "react-icons/fa";

import "./Reports.css";


function Reports() {


  // ============================
  // STATES
  // ============================

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [criteriaFilter, setCriteriaFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");



  // ============================
  // LOAD REPORT FILES
  // ============================

  const loadFiles = async()=>{

    try{

      setLoading(true);


      const res = await axios.get(
        "http://localhost:5000/reports"
      );


      if(res.data.success){

        setFiles(
          res.data.files
        );

      }


    }
    catch(err){

      console.log(err);

      alert(
        "Unable to load reports"
      );

    }
    finally{

      setLoading(false);

    }

  };



  useEffect(()=>{

    loadFiles();

  },[]);




  // ============================
  // REFRESH
  // ============================

  const handleRefresh = ()=>{

    loadFiles();

  };




  // ============================
  // VIEW FILE
  // ============================

  const handleView=(file)=>{


    if(!file.file_name){

      alert(
        "File not found"
      );

      return;

    }


    window.open(

      `http://localhost:5000/uploads/${file.file_name}`,

      "_blank"

    );


  };




  // ============================
  // DELETE FILE
  // ============================

  const handleDelete=async(id)=>{


    const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this file?"
    );


    if(!confirmDelete)
      return;



    try{


      const res = await axios.delete(

        `http://localhost:5000/reports/${id}`

      );



      if(res.data.success){


        alert(
          "File Deleted Successfully"
        );


        loadFiles();


      }


    }
    catch(err){


      console.log(err);


      alert(
        "Delete Failed"
      );


    }


  };




  // ============================
  // FILTER LOGIC
  // ============================

  const filteredFiles =
  files.filter((file)=>{


    const searchText =
    search.toLowerCase();



    const matchSearch =

    (file.criteria_no || "")
    .toLowerCase()
    .includes(searchText)


    ||

    (file.document_name || "")
    .toLowerCase()
    .includes(searchText)


    ||

    (
      file.original_file_name ||
      file.file_name ||
      ""
    )
    .toLowerCase()
    .includes(searchText);





    // IMPORTANT CHANGE
    // Criteria 2 -> 2.1 to 2.8

    const matchCriteria =

    criteriaFilter === "All"

    ?

    true

    :

    file.criteria_no
    .startsWith(
      criteriaFilter + "."
    );





    const matchStatus =

    statusFilter === "All"

    ?

    true

    :

    file.status === statusFilter;



    return (

      matchSearch &&
      matchCriteria &&
      matchStatus

    );


  });
  return (

    <div className="report-page">


      <NBASidebar />


      <div className="report-content">



        {/* ==========================
            HEADER
        ========================== */}

        <div className="report-header">


          <h2>
            Reports Dashboard
          </h2>



          <button

            className="refresh-btn"

            onClick={handleRefresh}

          >

            <FaSyncAlt />

            Refresh

          </button>



        </div>





        {/* ==========================
            FILTER BAR
        ========================== */}


        <div className="filter-bar">



          <input

            type="text"

            className="search-input"

            placeholder="Search Criteria, Document, File..."

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

          />





          {/* CRITERIA FILTER */}

          <select

            className="filter-select"

            value={criteriaFilter}

            onChange={(e)=>
              setCriteriaFilter(
                e.target.value
              )
            }

          >


            <option value="All">

              All Criteria

            </option>



            {
              [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9"
              ]
              .map((item)=>(


                <option

                  key={item}

                  value={item}

                >

                  Criteria {item}

                </option>


              ))
            }



          </select>


</div>





        {/* ==========================
            SUMMARY
        ========================== */}


        <div className="report-summary">


          <div className="summary-card">


            <h2>

              {filteredFiles.length}

            </h2>


            <p>
              Total Files
            </p>


          </div>





         

            

          <div className="summary-card">


            <h2>


            {
              filteredFiles.filter(
                (f)=>
                f.status==="Submitted"
              ).length
            }


            </h2>


            <p>
              Submitted Files
            </p>


          </div>



        </div>







        {/* ==========================
            TABLE
        ========================== */}



        <div className="report-table">


          <table>


            <thead>


              <tr>


                <th>
                  Sr No
                </th>


                <th>
                  Criteria
                </th>


                <th>
                  Document Name
                </th>


                <th>
                  File Name
                </th>


                <th>
                  Uploaded Date
                </th>


                <th>
                  Status
                </th>


                <th>
                  Action
                </th>


              </tr>


            </thead>





            <tbody>



            {
              loading ?


              (

                <tr>

                  <td colSpan="7">

                    Loading Reports...

                  </td>

                </tr>


              )


              :


              filteredFiles.length===0


              ?


              (

                <tr>

                  <td colSpan="7">

                    No Uploaded Files Found

                  </td>


                </tr>


              )


              :



              filteredFiles.map(
                (file,index)=>(


                <tr key={file.id}>


                  <td>

                    {index+1}

                  </td>



                  <td>

                    {file.criteria_no}

                  </td>



                  <td>

                    {file.document_name}

                  </td>




                  <td>

                    {
                      file.original_file_name ||
                      file.file_name
                    }

                  </td>




                  <td>


                    {
                      new Date(
                        file.uploaded_at
                      )
                      .toLocaleDateString()
                    }


                    <br/>


                    <small>

                    {
                      new Date(
                        file.uploaded_at
                      )
                      .toLocaleTimeString()
                    }

                    </small>



                  </td>





                  <td>


                    <span

                    className={

                      file.status==="Submitted"

                      ?

                      "generated-btn"

                      :

                      "pending"

                    }

                    >


                      {file.status}


                    </span>



                  </td>





                  <td>


                    <div className="action-buttons">



                      <button

                      className="view-btn"

                      onClick={()=>
                        handleView(file)
                      }

                      >

                        <FaEye/>

                        View

                      </button>





                      <button

                      className="delete-btn"

                      onClick={()=>
                        handleDelete(file.id)
                      }

                      >

                        <FaTrash/>

                        Delete

                      </button>



                    </div>


                  </td>




                </tr>


                )

              )


            }



            </tbody>


          </table>


        </div>




      </div>


    </div>


  );


}


export default Reports;