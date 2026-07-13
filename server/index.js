const express = require("express");
const cors = require("cors");
const pool = require("./db");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
const libre = require("libreoffice-convert");
const fsExtra = require("fs-extra");
// ===============================
// Upload Folder Create
// ===============================

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ===============================
// Multer Configuration
// ===============================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {

    const allowedTypes = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".jpg",
      ".jpeg",
      ".png"
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF, Word, Excel, PPT and Image files are allowed"
        )
      );
    }
  }
});

// Static Folder
app.use("/uploads", express.static("uploads"));

// ===============================
// Home API
// ===============================

app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});


app.get("/criteria/all-files", async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM criteria_documents
      WHERE file_name IS NOT NULL
      ORDER BY criteria_no
      `
    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }

});


// ===============================
// Get Uploaded Files By Criteria
// ===============================
app.get("/criteria/files/:criteriaNo", async (req, res) => {
  try {
    const { criteriaNo } = req.params;

    const result = await pool.query(
      `
      SELECT file_name
      FROM criteria_documents
      WHERE criteria_no = $1
      AND file_name IS NOT NULL
      ORDER BY uploaded_at ASC
      `,
      [criteriaNo]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ===============================
// Get Files of Criteria 2.1 to 2.8
// ===============================
app.get("/criteria/print-files", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT file_name
      FROM criteria_documents
      WHERE REPLACE(criteria_no,' ','') IN
      ('2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8')
      AND file_name IS NOT NULL
      ORDER BY criteria_no,id
    `);

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


app.get("/test-db", async (req, res) => {
  try {
    const db = await pool.query("SELECT current_database()");
    const count = await pool.query("SELECT COUNT(*) FROM criteria_documents");
    const data = await pool.query(`
      SELECT id, criteria_no, file_name
      FROM criteria_documents
      ORDER BY id DESC
      LIMIT 10
    `);

    res.json({
      database: db.rows[0].current_database,
      total: count.rows[0].count,
      data: data.rows
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});




// ===============================
// Get Criteria Documents API
// ===============================

app.get("/criteria/:criteriaNo", async (req, res) => {

  try {

    const { criteriaNo } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM criteria_documents
      WHERE criteria_no = $1
      ORDER BY display_order
      `,
      [criteriaNo]
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});



// ===============================
// Department Save API
// ===============================

app.post("/department", async (req, res) => {

  try {

    const {
      departmentCode,
      departmentType,
      hodName,
      reportingTo,
      establishedDate,
      status,
      building,
      floor,
      campus
    } = req.body;

    const result = await pool.query(
      `INSERT INTO department_master
      (
        department_code,
        department_type,
        hod_name,
        reporting_to,
        established_date,
        status,
        building,
        floor,
        campus
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        departmentCode,
        departmentType,
        hodName,
        reportingTo,
        establishedDate,
        status,
        building,
        floor,
        campus
      ]
    );

    res.status(201).json({
      success: true,
      message: "Department Saved Successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// Course Save API
// ===============================

app.post("/course", async (req, res) => {

  try {

    const {
      courseCode,
      courseName,
      courseType,
      department,
      courseLevel,
      duration,
      totalSemesters,
      intakeCapacity,
      courseStatus,
      approvalStatus,
      startDate,
      endDate,
      coordinator,
      contactNumber,
      courseDescription,
      courseObjective,
      eligibilityCriteria,
      courseOutcome,
      tuitionFees,
      developmentFees,
      otherFees,
      totalFees
    } = req.body;

    const result = await pool.query(
      `INSERT INTO course_master
      (
        course_code,
        course_name,
        course_type,
        department,
        course_level,
        duration,
        total_semesters,
        intake_capacity,
        course_status,
        approval_status,
        start_date,
        end_date,
        coordinator,
        contact_number,
        course_description,
        course_objective,
        eligibility_criteria,
        course_outcome,
        tuition_fees,
        development_fees,
        other_fees,
        total_fees
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,
        $19,$20,$21,$22
      )
      RETURNING *`,
      [
        courseCode,
        courseName,
        courseType,
        department,
        courseLevel,
        duration,
        totalSemesters,
        intakeCapacity,
        courseStatus,
        approvalStatus,
        startDate,
        endDate,
        coordinator,
        contactNumber,
        courseDescription,
        courseObjective,
        eligibilityCriteria,
        courseOutcome,
        tuitionFees,
        developmentFees,
        otherFees,
        totalFees
      ]
    );

    res.status(201).json({
      success: true,
      message: "Course Saved Successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// Get All Courses API
// ===============================

app.get("/course", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM course_master ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// ===============================
// Criteria Document Upload API
// ===============================

app.post(
  "/criteria/upload",
  upload.single("file"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select file"
        });
      }

      const { criteriaNo, documentName } = req.body;

      const fileName = req.file.filename;
      const filePath = req.file.path;

      const result = await pool.query(
        `
        INSERT INTO criteria_documents
        (
          criteria_no,
          document_name,
          description,
          file_name,
          file_path,
          uploaded_at,
          status
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          NOW(),
          'Saved'
        )
        RETURNING *
        `,
        [
          criteriaNo,
          documentName,
          documentName,
          fileName,
          filePath
        ]
      );

      console.log("File Saved Successfully");
      console.log(result.rows[0]);

      res.status(200).json({
        success: true,
        message: "File Uploaded Successfully",
        data: result.rows[0]
      });

    } catch (error) {

      console.log("========== UPLOAD ERROR ==========");
      console.log(error);
      console.log(error.message);

      if (error.detail) {
        console.log(error.detail);
      }

      res.status(500).json({
        success: false,
        message: "Error while uploading file",
        error: error.message
      });
    }
  }
);
// ===============================
// Get Uploaded File Count
// ===============================

app.get("/criteria/count/:criteriaNo", async (req, res) => {
  try {

    const { criteriaNo } = req.params;

    const result = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM criteria_documents
      WHERE criteria_no = $1
      AND file_name IS NOT NULL
      `,
      [criteriaNo]
    );

    res.json({
      success: true,
      totalFiles: result.rows[0].total
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.delete("/criteria/deleteAll/:criteriaNo", async (req, res) => {

  try {

    const { criteriaNo } = req.params;

    await pool.query(
      `
      DELETE FROM criteria_documents
      WHERE criteria_no = $1
      `,
      [criteriaNo]
    );

    res.json({
      success: true,
      message: "All files deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get("/criteria/file/:criteriaNo/:documentId", async (req, res) => {
  try {
    const { criteriaNo, documentId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM criteria_documents
      WHERE criteria_no = $1
      AND id = $2
      ORDER BY uploaded_at DESC
      LIMIT 1
      `,
      [criteriaNo, documentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

async function convertToPDF(filePath) {

  return new Promise((resolve, reject) => {

    const file = fs.readFileSync(filePath);

    libre.convert(
      file,
      ".pdf",
      undefined,
      (err, done) => {

        if (err) {
          reject(err);
        } 
        else {

          const pdfPath = filePath + ".pdf";

          fs.writeFileSync(
            pdfPath,
            done
          );

          resolve(pdfPath);

        }

      }
    );

  });

}
const PDFMerger = require("pdf-merger-js");

app.get("/criteria/merge/:criteriaNo", async (req, res) => {

  try {

    const { criteriaNo } = req.params;

    const result = await pool.query(
      `SELECT * FROM criteria_documents
       WHERE criteria_no = $1
       ORDER BY id`,
      [criteriaNo]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("No files found");
    }

    const merger = new PDFMerger();

    for (const file of result.rows) {

  const originalPath = path.join(
    __dirname,
    file.file_path
  );


  let pdfPath;


  if (
    file.file_name
      .toLowerCase()
      .endsWith(".pdf")
  ) {

    pdfPath = originalPath;

  } 
  else {

    pdfPath = await convertToPDF(
      originalPath
    );

  }


  await merger.add(pdfPath);

}

    const outputFile =
      path.join(
        __dirname,
        "uploads",
        `merged_${criteriaNo}.pdf`
      );

    await merger.save(outputFile);

    res.sendFile(outputFile);

  } catch (error) {

    console.log(error);

    res.status(500).send("Merge Error");
  }
});

// ===============================
// Start Server
// ===============================

app.post("/criteria/submit", async (req, res) => {

  try {

    const { criteriaNo } = req.body;

    await pool.query(
      `
      UPDATE criteria_documents
      SET status = 'Submitted'
      WHERE criteria_no = $1
      `,
      [criteriaNo]
    );

    res.json({
      success: true,
      message: "Criteria Submitted Successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// =========================================
// CRITERIA 3 - GET DOCUMENTS
// =========================================

app.get("/criteria3/:criteriaNo", async (req, res) => {

  try {

    const { criteriaNo } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM criteria3_documents
      WHERE criteria_no = $1
      ORDER BY id ASC
      `,
      [criteriaNo]
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// =========================================
// CRITERIA 3 - COUNT DOCUMENTS
// =========================================

app.get("/criteria3/count/:criteriaNo", async (req, res) => {

  try {

    const { criteriaNo } = req.params;

    const result = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM criteria3_documents
      WHERE criteria_no = $1
      AND file_name IS NOT NULL
      `,
      [criteriaNo]
    );

    res.json({
      success: true,
      total: result.rows[0].total
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

// =========================================
// CRITERIA 3 - UPLOAD DOCUMENT
// =========================================

app.post(
  "/criteria3/upload",
  upload.single("file"),
  async (req, res) => {

    try {

      const {
        criteriaNo,
        documentName
      } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }

      const fileName = req.file.filename;
      const filePath = req.file.path;

      const result = await pool.query(
        `
        INSERT INTO criteria3_documents
        (
          criteria_no,
          document_name,
          description,
          file_name,
          file_path,
          uploaded_at,
          status
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          NOW(),
          'Saved'
        )
        RETURNING *
        `,
        [
          criteriaNo,
          documentName,
          documentName,
          fileName,
          filePath
        ]
      );

      res.status(200).json({
        success: true,
        message: "File Uploaded Successfully",
        data: result.rows[0]
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        error: error.message
      });

    }

  }
);
// =========================================
// CRITERIA 3 - DELETE FILE
// =========================================

app.delete("/criteria3/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      `
      UPDATE criteria3_documents
      SET
        file_name = NULL,
        file_path = NULL,
        status = 'Pending'
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
      message: "File Deleted Successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// =========================================
// CRITERIA 3 - SUBMIT
// =========================================

app.post("/criteria3/submit", async (req, res) => {

  try {

    const { criteriaNo } = req.body;

    await pool.query(
      `
      UPDATE criteria3_documents
      SET status = 'Submitted'
      WHERE criteria_no = $1
      `,
      [criteriaNo]
    );

    res.json({
      success: true,
      message: "Criteria 3 Submitted Successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

// =========================================
// CRITERIA 3 - GET SINGLE FILE DETAILS
// =========================================

app.get("/criteria3/file/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM criteria3_documents
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// =========================================
// CRITERIA 3 - GET ALL UPLOADED FILES
// =========================================

app.get("/criteria3/files/:criteriaNo", async (req, res) => {

  try {

    const { criteriaNo } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        criteria_no,
        document_name,
        file_name,
        file_path,
        uploaded_at,
        status
      FROM criteria3_documents
      WHERE criteria_no = $1
      AND file_name IS NOT NULL
      ORDER BY uploaded_at DESC
      `,
      [criteriaNo]
    );

    res.json({
      success: true,
      files: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

// =========================================
// CRITERIA 3 - PRINT FILES
// =========================================

app.get("/criteria3/print/:criteriaNo", async (req, res) => {

  try {

    const { criteriaNo } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        criteria_no,
        document_name,
        file_name,
        file_path
      FROM criteria3_documents
      WHERE criteria_no = $1
      AND file_name IS NOT NULL
      ORDER BY uploaded_at ASC
      `,
      [criteriaNo]
    );

    res.json({
      success: true,
      files: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// =========================================
// CRITERIA 3 - ALL FILES
// =========================================

app.get("/criteria3/all-files", async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM criteria3_documents
      WHERE file_name IS NOT NULL
      ORDER BY criteria_no ASC, uploaded_at DESC
      `
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

app.delete("/criteria3/deleteAll/:criteriaNo", async (req, res) => {
  try {
    const { criteriaNo } = req.params;

    await pool.query(
      `DELETE FROM criteria3_documents WHERE criteria_no = $1`,
      [criteriaNo]
    );

    res.json({
      success: true,
      message: "All files deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(axios.get("https://nba-college-management-system-1.onrender.com/...");, () => {
  console.log("Server running on port axios.get("https://nba-college-management-system-1.onrender.com/...");");
});