import React from "react";

function Header() {
  return (
    <div
      style={{
        height: "80px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: "#0038A8",
          }}
        >
          NBA Software Development
        </h2>

        <p
          style={{
            margin: 0,
            color: "#666",
            fontSize: "13px",
          }}
        >
          College Management System
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search here..."
          style={{
            padding: "10px",
            width: "250px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        />

        <span style={{ fontSize: "22px" }}>🔔</span>

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#0038A8",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          A
        </div>
      </div>
    </div>
  );
}

export default Header;