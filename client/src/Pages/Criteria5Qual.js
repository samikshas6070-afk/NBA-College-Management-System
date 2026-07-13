import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Criteria5Qual.css";

function Criteria5Qual() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [data, setData] = useState([
    { id: 1, name: "Ph.D.", m1: 8, m2: 7, m3: 6 },
    { id: 2, name: "M.Tech / M.E.", m1: 15, m2: 14, m3: 13 },
    { id: 3, name: "B.Tech", m1: 2, m2: 2, m3: 2 },
    { id: 4, name: "Others", m1: 1, m2: 2, m3: 2 },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = Number(value) || 0;
    setData(updated);
  };

  const totalM1 = data.reduce((sum, item) => sum + Number(item.m1), 0);
  const totalM2 = data.reduce((sum, item) => sum + Number(item.m2), 0);
  const totalM3 = data.reduce((sum, item) => sum + Number(item.m3), 0);
  
  const totalTeachers = {
  m1: totalM1,
  m2: totalM2,
  m3: totalM3
};

  const percentage = (value, total) => {
    if (total === 0) return "0.00";
    return ((value / total) * 100).toFixed(2);
  };
const [selectedYear, setSelectedYear] = useState("m1");
const handlePrevious = () => {
  navigate("/criteria5/sfr");
};

const handleNext = () => {
  navigate("/criteria5/cadre");
};

const handleSave = () => {
  alert("Data Saved Successfully");
};

const handleUpdate = () => {
  alert("Data Updated Successfully");
};
  return (
    <div className="criteria5qual">
      <div className="main-card">
      <div className="table-container">

        <div className="criteria5qual-header">

          <div className="title-badge">
            5.2
          </div>

          <div className="header-text">
            <h2>Faculty Qualifications</h2>
            <p>Faculty Qualification Details</p>
          </div>

        </div>

        <table>

          <thead>

            <tr>

              <th rowSpan="2">Sr. No.</th>

              <th rowSpan="2">Faculty Qualification</th>

              <th colSpan="2">
                CAY M1
                <br />
                (2024-25)
              </th>

              <th colSpan="2">
                CAY M2
                <br />
                (2023-24)
              </th>

              <th colSpan="2">
                CAY M3
                <br />
                (2022-23)
              </th>
<th rowSpan="2" className="dropdownHeader">

<select
  className="yearDropdown"
  value={selectedYear}
  onChange={(e)=>setSelectedYear(e.target.value)}
>
  <option value="m1">
    CAY M1 (2024-25)
  </option>

  <option value="m2">
    CAY M2 (2023-24)
  </option>

  <option value="m3">
    CAY M3 (2022-23)
  </option>

</select>

<br/>

<span>
 Total No. of<br/>
 Full Time Teachers
</span>

</th>

              <th rowSpan="2">%</th>

            </tr>

            <tr>

              <th>No.</th>
              <th>%</th>

              <th>No.</th>
              <th>%</th>

              <th>No.</th>
              <th>%</th>

            </tr>

          </thead>

          <tbody>

            {data.map((item, index) => (

              <tr key={item.id}>

                <td>{index + 1}</td>

                <td className="left">
                  {item.name}
                </td>

                <td>
                  <input
                    type="number"
                    value={item.m1}
                    onChange={(e) =>
                      handleChange(index, "m1", e.target.value)
                    }
                  />
                </td>

                <td>
                  {percentage(item.m1, totalM1)}%
                </td>

                <td>
                  <input
                    type="number"
                    value={item.m2}
                    onChange={(e) =>
                      handleChange(index, "m2", e.target.value)
                    }
                  />
                </td>

                <td>
                  {percentage(item.m2, totalM2)}%
                </td>

                <td>
                  <input
                    type="number"
                    value={item.m3}
                    onChange={(e) =>
                      handleChange(index, "m3", e.target.value)
                    }
                  />
                </td>

                <td>
                  {percentage(item.m3, totalM3)}%
                </td>

              <td>
{
 selectedYear === "m1"
 ? item.m1
 : selectedYear === "m2"
 ? item.m2
 : item.m3
}
</td>

<td>
{
 selectedYear === "m1"
 ? percentage(item.m1,totalM1)
 : selectedYear === "m2"
 ? percentage(item.m2,totalM2)
 : percentage(item.m3,totalM3)
}%
</td>
              </tr>

            ))}
            <tr className="total-row">
              <td colSpan="2" className="left">
                <b>Total No. of Full Time Teachers (F)</b>
              </td>

             <td>
<b>
{
 selectedYear === "m1"
 ? totalTeachers.m1
 : selectedYear === "m2"
 ? totalTeachers.m2
 : totalTeachers.m3
}
</b>
</td>

<td>
<b>100%</b>
</td>
<td><b>{totalTeachers.m2}</b></td>
<td><b>100%</b></td>

<td><b>{totalTeachers.m3}</b></td>
<td><b>100%</b></td>

<td><b>{totalTeachers.m1}</b></td>
<td><b>100%</b></td>
</tr>
          </tbody>

        </table>

        <div className="bottom-section">

          <div className="note">

            <span>Note :</span> Include faculty members who are on deputation
            and also those faculty members who are with the institute for less
            than one year.

          </div>

          <input
            type="file"
            hidden
            ref={fileRef}
          />

          <button
            className="upload-btn"
            onClick={() => fileRef.current.click()}
          >
            ⬆ Upload Supporting Document
          </button>

        </div>
<div className="action-buttons">

  <button
    className="btn previous"
    onClick={handlePrevious}
  >
    Previous
  </button>

  <button
    className="btn save"
    onClick={handleSave}
  >
    Save
  </button>

  <button
    className="btn update"
    onClick={handleUpdate}
  >
    Update
  </button>

  <button
    className="btn next"
    onClick={handleNext}
  >
    Next
  </button>

</div>
      </div>

    </div>
    </div>

  );
}

export default Criteria5Qual;