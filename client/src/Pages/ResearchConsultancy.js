import React from "react";
import { useNavigate } from "react-router-dom";
import "./ResearchConsultancy.css";

function ResearchConsultancy() {

  const navigate = useNavigate();

  const sections = [
    {
      no: "6.2.1",
      title: "Academic Research",
      route: "/criteria6/academic-research"
    },
    {
  no: "6.2.2",
  title: "Development Activities",
  route: "/criteria6/development-activities"
},
    {
      no: "6.2.3",
      title: "Sponsored Research Projects",
      route: "/criteria6/sponsored-research"
    },
    {
      no: "6.2.4",
      title: "Consultancy Work",
      route: "/criteria6/consultancy"
    },
    {
      no: "6.2.5",
      title: "Institution Seed Money / Internal Research Grant",
      route: "/criteria6/seed-money"
    }
  ];

  return (

    <div className="research-container">

      <div className="research-title">

        <h2>Research & Consultancy</h2>

        <p>
          Criterion 6.2 Research Activities
        </p>

      </div>

      {sections.map((item,index)=>(

        <div
          className="research-card"
          key={index}
        >

          <div>

            <h3>

              {item.no} {item.title}

            </h3>

            <p>

              Upload and maintain supporting documents.

            </p>

          </div>

          <div className="research-buttons">

            <button
              className="view-btn"
              onClick={()=>
                navigate(item.route+"/view")
              }
            >
              View
            </button>
<button
  className="add-btn"
  onClick={() => navigate(item.route + "/add")}
>
  Add
</button>

          </div>

        </div>

      ))}
<div className="module-navigation">

  <button
    className="module-prev"
    onClick={() => navigate("/criteria6/faculty-activities")}
  >
    ← Previous
  </button>

  <button
    className="module-next"
    onClick={() => navigate("/criteria7")}
  >
    Criteria 7 →
  </button>

</div>
    </div>

  );

}

export default ResearchConsultancy;