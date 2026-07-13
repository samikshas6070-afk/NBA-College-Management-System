import React from "react";

function Sidebar() {
  const menuStyle = {
    padding: "12px 15px",
    marginBottom: "8px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
  };

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "linear-gradient(180deg,#0038A8,#005AE0)",
        color: "white",
      }}
    >
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "#fff",
            color: "#0038A8",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          N
        </div>

        <h2>NBA Software</h2>

        <p
          style={{
            fontSize: "13px",
          }}
        >
          College Management System
        </p>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={menuStyle}>🏠 Dashboard</div>
        <div style={menuStyle}>👨‍💼 Employee Management</div>
        <div style={menuStyle}>🏢 Department Management</div>
        <div style={menuStyle}>👨‍🏫 Faculty Management</div>
        <div style={menuStyle}>💰 Salary Management</div>
        <div style={menuStyle}>📅 Attendance Management</div>
        <div style={menuStyle}>📝 Leave Management</div>
        <div style={menuStyle}>📚 Course Management</div>
        <div style={menuStyle}>🔐 Authority Management</div>
        <div style={menuStyle}>📊 Reports</div>
        <div style={menuStyle}>⚙ Settings</div>
      </div>
    </div>
  );
}

export default Sidebar;