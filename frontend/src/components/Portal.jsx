import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../templates/Portal.css";
import attainxLogo from "../assets/attainx-logo.png";


function Portal() {
  const navigate = useNavigate();

  // Temporary hardcoded logged-in user
  const [user, setUser] = useState({
    name: "Admin User",
    department: "Computer Science Engineering",
    email: "admin@example.com",
    password: "admin123",
    image: null,
  });

  const [darkMode, setDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  // Faculty name
  const [facultyName, setFacultyName] = useState(user.name);

  // Course Outcomes
  const [cos, setCos] = useState({
    CO1: "",
    CO2: "",
    CO3: "",
    CO4: "",
    CO5: "",
    CO6: "",
  });

  const rows = ["CO1", "CO2", "CO3", "CO4", "CO5", "CO6"];

  const columns = [
    "PO1",
    "PO2",
    "PO3",
    "PO4",
    "PO5",
    "PO6",
    "PO7",
    "PO8",
    "PO9",
    "PO10",
    "PO11",
    "PSO1",
    "PSO2",
    "PSO3",
  ];

  // CO-PO Mapping
  const createEmptyMapping = () => {
    return rows.reduce((obj, row) => {
      obj[row] = {};

      columns.forEach((column) => {
        obj[row][column] = "";
      });

      return obj;
    }, {});
  };

  const [mapping, setMapping] = useState(
    createEmptyMapping()
  );

  // References for keyboard navigation
  const inputRefs = useRef({});


  // =========================================
  // COURSE OUTCOME CHANGE
  // =========================================

  const handleCOChange = (co, value) => {
    setCos({
      ...cos,
      [co]: value,
    });
  };


  // =========================================
  // MAPPING CHANGE
  // =========================================

  const handleMappingChange = (
    row,
    column,
    value
  ) => {
    setMapping({
      ...mapping,

      [row]: {
        ...mapping[row],
        [column]: value,
      },
    });
  };


  // =========================================
  // KEYBOARD NAVIGATION
  // =========================================

  const handleKeyDown = (
    e,
    rowIndex,
    columnIndex
  ) => {

    let newRow = rowIndex;
    let newColumn = columnIndex;

    if (e.key === "ArrowRight") {
      newColumn++;
    }

    else if (e.key === "ArrowLeft") {
      newColumn--;
    }

    else if (e.key === "ArrowDown") {
      newRow++;
    }

    else if (e.key === "ArrowUp") {
      newRow--;
    }

    else {
      return;
    }

    e.preventDefault();

    if (
      newRow >= 0 &&
      newRow < rows.length &&
      newColumn >= 0 &&
      newColumn < columns.length
    ) {

      inputRefs.current[
        `${newRow}-${newColumn}`
      ]?.focus();

    }
  };


  // =========================================
  // CLEAR ALL MAPPING
  // =========================================

  const clearAllMapping = () => {
    setMapping(createEmptyMapping());
  };


  // =========================================
  // CALCULATE ATTAINMENT
  // =========================================

  const calculateAttainment = () => {

    console.log("Faculty:", facultyName);

    console.log("Course Outcomes:", cos);

    console.log("CO-PO Mapping:", mapping);

    // Actual attainment calculation
    // will be added here later.

    alert("Attainment calculation started.");
  };


  // =========================================
  // FILE UPLOAD
  // =========================================

  const handleFileUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    if (
      !["csv", "xlsx", "xls"].includes(
        extension
      )
    ) {
      alert(
        "Only CSV and Excel files are allowed."
      );

      e.target.value = "";

      return;
    }

    console.log(
      "Uploaded file:",
      file.name
    );
  };


  // =========================================
  // PROFILE IMAGE
  // =========================================

  const handleProfileImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setUser({
      ...user,

      image: URL.createObjectURL(file),
    });
  };


  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {
    navigate("/");
  };


  const initial = user.name
    .charAt(0)
    .toUpperCase();


  return (

    <div
      className={`portal ${
        darkMode ? "dark" : "light"
      }`}
    >

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="sidebar">

          <div className="logo">
          <img
            src={attainxLogo}
            alt="Attainx"
          />
        
          <span>Attainx</span>
        </div>


        {/* USER */}

        <div
          className="sidebar-user"
          onClick={() =>
            setShowProfile(true)
          }
        >

          <div className="avatar">

            {user.image ? (

              <img
                src={user.image}
                alt="profile"
              />

            ) : (

              initial

            )}

          </div>


          <div className="user-details">

            <strong>
              {user.name}
            </strong>

            <span>
              Faculty
            </span>

          </div>


          <span className="dots">
            •••
          </span>

        </div>


        {/* NAVIGATION */}

        <div className="sidebar-menu">

          <button
            className="menu-item active"
          >
            <span>
              01
            </span>

            Attainment
          </button>


          <button
            className="menu-item"
            onClick={() =>
              alert(
                "Attainment history will be available here."
              )
            }
          >
            <span>
              02
            </span>

            Attainment History
          </button>


          <button
            className="menu-item"
            onClick={() =>
              navigate("/reportformat")
            }
          >
            <span>
              03
            </span>

            Change Report Format
          </button>

        </div>


        {/* SETTINGS */}

        <div className="sidebar-bottom">

          <button
            className="menu-item"
            onClick={() =>
              setShowProfile(true)
            }
          >

            <span>
              ⚙
            </span>

            Settings

          </button>

        </div>

      </aside>


      {/* =====================================
          PROFILE PANEL
      ===================================== */}

      {showProfile && (

        <div className="profile-panel">

          <div className="profile-top">

            <h2>
              Profile
            </h2>

            <button
              className="close-profile"
              onClick={() =>
                setShowProfile(false)
              }
            >
              ×
            </button>

          </div>


          {/* PROFILE IMAGE */}

          <div className="profile-picture">

            <div className="large-avatar">

              {user.image ? (

                <img
                  src={user.image}
                  alt="profile"
                />

              ) : (

                initial

              )}

            </div>


            <label className="change-picture">

              Change picture

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleProfileImage
                }
              />

            </label>

          </div>


          {/* NAME */}

          <label>
            NAME
          </label>

          <input
            className="profile-input"
            value={user.name}
            onChange={(e) =>
              setUser({
                ...user,
                name: e.target.value,
              })
            }
          />


          {/* DEPARTMENT */}

          <label>
            DEPARTMENT
          </label>

          <input
            className="profile-input"
            value={user.department}
            onChange={(e) =>
              setUser({
                ...user,
                department:
                  e.target.value,
              })
            }
          />


          {/* EMAIL */}

          <label>
            EMAIL
          </label>

          <input
            className="profile-input"
            value={user.email}
            onChange={(e) =>
              setUser({
                ...user,
                email: e.target.value,
              })
            }
          />


          {/* PASSWORD */}

          <label>
            PASSWORD
          </label>

          <input
            className="profile-input"
            type="password"
            value={user.password}
            onChange={(e) =>
              setUser({
                ...user,
                password:
                  e.target.value,
              })
            }
          />


          {/* THEME */}

          <div className="theme-row">

            <div>

              <strong>
                Appearance
              </strong>

              <span>
                {darkMode
                  ? "Dark mode"
                  : "Light mode"}
              </span>

            </div>


            <button
              className={`toggle ${
                darkMode
                  ? "on"
                  : ""
              }`}
              onClick={() =>
                setDarkMode(!darkMode)
              }
            >

              <span />

            </button>

          </div>


          {/* LOGOUT */}

          <button
            className="logout-button"
            onClick={logout}
          >

            Logout

            <span>
              ↗
            </span>

          </button>

        </div>

      )}


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="portal-main">

        {/* HEADER */}

        <header className="portal-header">

          <div>

            <span className="eyebrow">
              ACADEMIC ANALYTICS
            </span>

            <h1>
              Student Attainment
            </h1>

            <p>
              Course Outcome Mapping & Analysis
            </p>

          </div>

        </header>


        {/* =====================================
            FACULTY INFORMATION
        ===================================== */}

        <section className="portal-section">

          <div className="section-title">

            <span>
              01
            </span>

            <h2>
              Faculty Information
            </h2>

          </div>


          <div className="faculty-input">

            <label>
              FACULTY NAME
            </label>

            <input
              value={facultyName}
              onChange={(e) =>
                setFacultyName(
                  e.target.value
                )
              }
            />

            <small>
              Automatically loaded from
              your profile
            </small>

          </div>

        </section>


        {/* =====================================
            COURSE OUTCOMES
        ===================================== */}

        <section className="portal-section">

          <div className="section-title">

            <span>
              02
            </span>

            <h2>
              Course Outcomes
            </h2>

          </div>


          <div className="co-container">

            {rows.map((co) => (

              <div
                className="co-row"
                key={co}
              >

                <span>
                  {co}
                </span>

                <input
                  value={cos[co]}
                  placeholder={`Enter ${co} statement`}
                  onChange={(e) =>
                    handleCOChange(
                      co,
                      e.target.value
                    )
                  }
                />

              </div>

            ))}

          </div>

        </section>


        {/* =====================================
            CO / PO MAPPING
        ===================================== */}

        <section className="portal-section">

          <div className="section-title">

            <span>
              03
            </span>

            <div>

              <h2>
                CO / PO Mapping
              </h2>

              <p>
                Enter the mapping values.
              </p>

            </div>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    CO / PO
                  </th>

                  {columns.map(
                    (column) => (

                      <th key={column}>
                        {column}
                      </th>

                    )
                  )}

                </tr>

              </thead>


              <tbody>

                {rows.map(
                  (row, rowIndex) => (

                    <tr key={row}>

                      <th>
                        {row}
                      </th>


                      {columns.map(
                        (
                          column,
                          columnIndex
                        ) => (

                          <td
                            key={column}
                          >

                            <input
                              ref={(element) => {

                                inputRefs.current[
                                  `${rowIndex}-${columnIndex}`
                                ] = element;

                              }}

                              value={
                                mapping[row][
                                  column
                                ]
                              }

                              onChange={(e) =>
                                handleMappingChange(
                                  row,
                                  column,
                                  e.target.value
                                )
                              }

                              onKeyDown={(e) =>
                                handleKeyDown(
                                  e,
                                  rowIndex,
                                  columnIndex
                                )
                              }

                              inputMode="numeric"
                            />

                          </td>

                        )
                      )}

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>


          {/* MAPPING ACTIONS */}

          <div className="mapping-actions">

            <button
              className="clear-button"
              onClick={
                clearAllMapping
              }
            >
              Clear All
            </button>


            <small className="keyboard-help">
              Use ↑ ↓ ← → arrow keys
              to move between cells
            </small>

          </div>

        </section>


        {/* =====================================
            IMPORT DATA
        ===================================== */}

        <section className="portal-section">

          <div className="section-title">

            <span>
              04
            </span>

            <h2>
              Import Data
            </h2>

          </div>


          <label className="upload-box">

            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={
                handleFileUpload
              }
            />

            <div className="upload-arrow">
              ↑
            </div>

            <strong>
              Upload CSV or Excel file
            </strong>

            <span>
              CSV · XLS · XLSX
            </span>

          </label>

        </section>


        {/* =====================================
            CALCULATE ATTAINMENT
        ===================================== */}

        <section className="calculate-section">

          <div>

            <span className="calculate-label">
              READY TO ANALYZE?
            </span>

            <h2>
              Calculate
              <br />
              <span>
                Attainment.
              </span>
            </h2>

          </div>


          <button
            className="calculate-button"
            onClick={
              calculateAttainment
            }
          >

            Calculate Attainment

            <span>
              ↗
            </span>

          </button>

        </section>

      </main>

    </div>
  );
}

export default Portal;