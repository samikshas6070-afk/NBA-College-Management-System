import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">

      {/* ================= LEFT PANEL ================= */}

      <div className="left-panel">

        <div className="logo-area">
          <img
            src="/nba-logo.png"
            alt="NBA Logo"
            className="nba-logo"
          />
        </div>

        <div className="left-content">

          <h1>
            COLLEGE
            <br />
            MANAGEMENT SYSTEM
            <br />
            FOR NBA
          </h1>

          <p>
            Digitizing Accreditation Excellence
          </p>

          <div className="button-area">

            <button
              className="login-btn"
              onClick={() => navigate("/home")}
            >
              Login
            </button>

            <button
              className="register-btn"
            >
              Register
            </button>

          </div>

        </div>

      </div>

      {/* ================= RIGHT PANEL ================= */}

      <div className="right-panel">

        {/* CURVE */}

        <div className="curve-wrapper">

          <svg
            className="curve-svg"
            viewBox="0 0 600 1000"
            preserveAspectRatio="none"
          >
            <path
              d="
                 M600 0
                 C250 120
                 250 880
                 600 1000
                 L0 1000
                 L0 0
                 Z
              "
              fill="#ffffff"
            />
          </svg>

        </div>

        {/* TEXT */}

        <div className="welcome-text">

          <h2>
            Welcome to NBA CMS
          </h2>

          <p>
            Manage Accreditation, Reports, Criteria and
            Documentation in one platform.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Welcome;