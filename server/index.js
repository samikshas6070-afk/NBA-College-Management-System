const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("./db");

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

/* =========================================================
   UPLOAD FOLDER
========================================================= */

const uploadFolder = path.join(
  __dirname,
  "uploads"
);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, {
    recursive: true,
  });
}

/* =========================================================
   STATIC UPLOAD ACCESS
========================================================= */

app.use(
  "/uploads",
  express.static(uploadFolder)
);

/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000000) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

/* =========================================================
   ALLOWED FILE EXTENSIONS
========================================================= */

const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".jpg",
  ".jpeg",
  ".png",
];

/* =========================================================
   MULTER UPLOAD
========================================================= */

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    if (allowedExtensions.includes(ext)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Invalid File Type. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, JPEG, PNG"
      )
    );
  },
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NBA Management System Server is running.",
  });
});

/* =========================================================
   ========================================================
   CRITERIA 2 START
   ========================================================
========================================================= */

/* =========================================================
   CRITERIA 2 - UPLOAD
========================================================= */

app.post(
  "/criteria/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please Select File",
        });
      }

      const {
        criteriaNo,
        documentName,
        description,
        session_id,
        academicYear,
        department,
        program,
      } = req.body;

      if (!criteriaNo) {
        return res.status(400).json({
          success: false,
          message: "Criteria number is required.",
        });
      }

      if (!documentName) {
        return res.status(400).json({
          success: false,
          message: "Document name is required.",
        });
      }

      if (!session_id) {
        return res.status(400).json({
          success: false,
          message: "Session ID is required.",
        });
      }

      /* ---------------------------------------------------
         Academic details ONLY for Criteria 2.1
      --------------------------------------------------- */

      if (
        criteriaNo === "2.1" &&
        (!academicYear ||
          !department ||
          !program)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Academic Year, Department and Program are required for Criteria 2.1.",
          received: {
            academicYear,
            department,
            program,
          },
        });
      }

      console.log(
        "===================================="
      );

      console.log(
        "CRITERIA NO :",
        criteriaNo
      );

      console.log(
        "DOCUMENT    :",
        documentName
      );

      console.log(
        "SESSION ID  :",
        session_id
      );

      console.log(
        "FILE        :",
        req.file.originalname
      );

      console.log(
        "===================================="
      );

      const originalFileName =
        req.file.originalname;

      const storedFileName =
        req.file.filename;

      const filePath =
        req.file.path;

      const result = await pool.query(
        `
        INSERT INTO criteria2_documents
        (
          criteria_no,
          document_name,
          description,
          original_file_name,
          file_name,
          file_path,
          session_id,
          academic_year,
          department,
          program,
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
          $6,
          $7,
          $8,
          $9,
          $10,
          NOW(),
          'Saved'
        )
        RETURNING *
        `,
        [
          criteriaNo,
          documentName,
          description || null,
          originalFileName,
          storedFileName,
          filePath,
          session_id,
          academicYear || null,
          department || null,
          program || null,
        ]
      );

      return res.status(200).json({
        success: true,
        message: "Uploaded Successfully",
        data: result.rows[0],
      });

    } catch (err) {
      console.error(
        "CRITERIA 2 UPLOAD ERROR:",
        err
      );

      if (
        req.file &&
        req.file.path &&
        fs.existsSync(req.file.path)
      ) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (deleteError) {
          console.error(
            "Uploaded file cleanup error:",
            deleteError
          );
        }
      }

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

/* =========================================================
   CRITERIA 2 - LOAD FILES
========================================================= */

app.get(
  "/criteria/files/:criteriaNo",
  async (req, res) => {
    try {
      const { criteriaNo } =
        req.params;

      const { session_id } =
        req.query;

      if (!session_id) {
        return res.status(400).json({
          success: false,
          message: "Session ID is required.",
        });
      }

      const result =
        await pool.query(
          `
          SELECT
            id,
            criteria_no,
            document_name,
            description,
            original_file_name,
            file_name,
            file_path,
            session_id,
            academic_year,
            department,
            program,
            uploaded_at,
            status
          FROM criteria2_documents
          WHERE criteria_no = $1
            AND session_id = $2
          ORDER BY uploaded_at ASC
          `,
          [
            criteriaNo,
            session_id,
          ]
        );

      return res.status(200).json({
        success: true,
        files: result.rows,
      });

    } catch (err) {
      console.error(
        "LOAD CRITERIA 2 FILE ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

/* =========================================================
   CRITERIA 2 - SAVE DRAFT
========================================================= */

app.post(
  "/criteria/save-draft",
  async (req, res) => {
    try {
      const {
        criteriaNo,
        session_id,
      } = req.body;

      if (
        !criteriaNo ||
        !session_id
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Criteria No and Session ID are required.",
        });
      }

      await pool.query(
        `
        UPDATE criteria2_documents
        SET status = 'Saved'
        WHERE criteria_no = $1
          AND session_id = $2
        `,
        [
          criteriaNo,
          session_id,
        ]
      );

      return res.json({
        success: true,
        message:
          "Draft Saved Successfully.",
      });

    } catch (err) {
      console.error(
        "SAVE DRAFT ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

/* =========================================================
   CRITERIA 2 - DELETE ALL
========================================================= */

app.delete(
  "/criteria/deleteAll/:criteriaNo",
  async (req, res) => {
    try {
      const { criteriaNo } =
        req.params;

      const { session_id } =
        req.query;

      if (!session_id) {
        return res.status(400).json({
          success: false,
          message:
            "Session ID is required.",
        });
      }

      const files =
        await pool.query(
          `
          SELECT file_path
          FROM criteria2_documents
          WHERE criteria_no = $1
            AND session_id = $2
          `,
          [
            criteriaNo,
            session_id,
          ]
        );

      files.rows.forEach(
        (file) => {
          if (
            file.file_path &&
            fs.existsSync(
              file.file_path
            )
          ) {
            try {
              fs.unlinkSync(
                file.file_path
              );
            } catch (err) {
              console.error(
                "Physical file delete error:",
                err
              );
            }
          }
        }
      );

      const result =
        await pool.query(
          `
          DELETE FROM criteria2_documents
          WHERE criteria_no = $1
            AND session_id = $2
          RETURNING *
          `,
          [
            criteriaNo,
            session_id,
          ]
        );

      return res.json({
        success: true,
        message:
          "Files Deleted Successfully.",
        deletedCount:
          result.rowCount,
      });

    } catch (err) {
      console.error(
        "DELETE CRITERIA 2 ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);
/* =========================================================
   CRITERIA 2 - DOWNLOAD
========================================================= */

app.get(
  "/criteria/download/:fileName",
  async (req, res) => {
    try {
      const { fileName } =
        req.params;

      const { session_id } =
        req.query;

      if (!session_id) {
        return res.status(400).json({
          success: false,
          message:
            "Session ID is required.",
        });
      }

      const result =
        await pool.query(
          `
          SELECT
            original_file_name,
            file_path
          FROM criteria2_documents
          WHERE file_name = $1
            AND session_id = $2
          LIMIT 1
          `,
          [
            fileName,
            session_id,
          ]
        );

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "File not found.",
        });
      }

      const file =
        result.rows[0];

      if (
        !file.file_path ||
        !fs.existsSync(
          file.file_path
        )
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Physical file not found.",
        });
      }

      return res.download(
        file.file_path,
        file.original_file_name
      );

    } catch (err) {
      console.error(
        "DOWNLOAD ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);


/* =========================================================
   CRITERIA 2 - VIEW
========================================================= */

app.get(
  "/criteria/view/:fileName",
  async (req, res) => {
    try {
      const { fileName } =
        req.params;

      const { session_id } =
        req.query;

      if (!session_id) {
        return res.status(400).json({
          success: false,
          message:
            "Session ID is required.",
        });
      }

      const result =
        await pool.query(
          `
          SELECT
            original_file_name,
            file_path
          FROM criteria2_documents
          WHERE file_name = $1
            AND session_id = $2
          LIMIT 1
          `,
          [
            fileName,
            session_id,
          ]
        );

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "File not found.",
        });
      }

      const file =
        result.rows[0];

      if (
        !file.file_path ||
        !fs.existsSync(
          file.file_path
        )
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Physical file not found.",
        });
      }

      return res.sendFile(
        path.resolve(
          file.file_path
        )
      );

    } catch (err) {
      console.error(
        "VIEW ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);


/* =========================================================
   CRITERIA 2 - PRINT FILES
========================================================= */

app.get(
  "/criteria/print-files",
  async (req, res) => {
    try {
      const {
        criteriaNo,
        session_id,
      } = req.query;

      if (
        !criteriaNo ||
        !session_id
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Criteria number and session id required.",
        });
      }

      const result =
        await pool.query(
          `
          SELECT
            id,
            document_name,
            original_file_name,
            file_name,
            file_path,
            uploaded_at
          FROM criteria2_documents
          WHERE criteria_no = $1
            AND session_id = $2
          ORDER BY uploaded_at ASC
          `,
          [
            criteriaNo,
            session_id,
          ]
        );

      return res.json({
        success: true,
        files: result.rows,
      });

    } catch (error) {
      console.error(
        "PRINT FILE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Print files fetch failed.",
      });
    }
  }
);


/* =========================================================
   CRITERIA 2 - ALL FILES
========================================================= */

app.get(
  "/criteria/files/all/2",
  async (req, res) => {
    try {
      const { session_id } =
        req.query;

      if (!session_id) {
        return res.status(400).json({
          success: false,
          message:
            "Session ID is required.",
        });
      }

      const result =
        await pool.query(
          `
          SELECT
            id,
            criteria_no,
            document_name,
            description,
            original_file_name,
            file_name,
            file_path,
            session_id,
            academic_year,
            department,
            program,
            uploaded_at,
            status
          FROM criteria2_documents
          WHERE session_id = $1
            AND criteria_no IN (
              '2.1',
              '2.2',
              '2.3',
              '2.4',
              '2.5',
              '2.6',
              '2.7',
              '2.8'
            )
          ORDER BY
            criteria_no ASC,
            uploaded_at ASC
          `,
          [session_id]
        );

      return res.status(200).json({
        success: true,
        files: result.rows,
      });

    } catch (error) {
      console.error(
        "GET ALL CRITERIA 2 FILES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


/* =========================================================
   END OF CRITERIA 2
========================================================= */




//===============================================================
//Start Code criteria 3.2
//=================================================================//
/* =========================================================
   CRITERIA 3.2 START
   Evaluation of Semester End Exam (SEE) Question Paper
========================================================= */

/* =========================================================
   CRITERIA 3.2 DOCUMENT MASTER
========================================================= */

const criteria32Documents = {
  1: {
    documentName:
      "Question Paper Setting, Evaluation & Compliance",

    description:
      "Process for setting question paper, evaluating and ensuring compliance.",
  },

  2: {
    documentName:
      "Quality Assessment & CO Mapping",

    description:
      "Assessment of the quality of question paper and appropriateness of mapping with the COs.",
  },

  3: {
    documentName:
      "Post Evaluation Transparency",

    description:
      "Evidence of transparency of post evaluation process.",
  },
};


/* =========================================================
   HELPER
   DELETE PHYSICAL FILE
========================================================= */

const deletePhysicalFile = (filePath) => {
  try {

    if (!filePath) {
      return;
    }

    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, filePath);

    if (fs.existsSync(fullPath)) {

      fs.unlinkSync(fullPath);

      console.log(
        "Physical file deleted:",
        fullPath
      );
    }

  } catch (error) {

    console.error(
      "Physical file delete error:",
      error
    );

  }
};


/* =========================================================
   CRITERIA 3.2
   UPLOAD / SAVE

   IMPORTANT:
   EVERY SAVE = NEW DATABASE RECORD

   OLD RECORD:
   - NOT UPDATED
   - NOT DELETED
   - PHYSICAL FILE NOT DELETED

   NEW RECORD:
   - ALWAYS INSERTED
========================================================= */

app.post(
  "/criteria3/upload/3.2",
  upload.single("file"),

  async (req, res) => {

    let uploadedFilePath = null;

    try {

      /* -----------------------------------------------------
         FILE CHECK
      ----------------------------------------------------- */

      if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "Please Select File.",
        });

      }

      uploadedFilePath = req.file.path;


      /* -----------------------------------------------------
         REQUEST DATA
      ----------------------------------------------------- */

      const {
        criteriaNo,
        documentName,
        description,
        session_id,
      } = req.body;


      /* -----------------------------------------------------
         VALIDATE CRITERIA
      ----------------------------------------------------- */

      if (!criteriaNo) {

        deletePhysicalFile(
          uploadedFilePath
        );

        return res.status(400).json({
          success: false,
          message:
            "Criteria number is required.",
        });

      }


      if (
        String(criteriaNo).trim() !== "3.2"
      ) {

        deletePhysicalFile(
          uploadedFilePath
        );

        return res.status(400).json({
          success: false,
          message:
            "Invalid Criteria Number.",
        });

      }


      /* -----------------------------------------------------
         VALIDATE DOCUMENT NAME
      ----------------------------------------------------- */

      if (!documentName) {

        deletePhysicalFile(
          uploadedFilePath
        );

        return res.status(400).json({
          success: false,
          message:
            "Document name is required.",
        });

      }


      /* -----------------------------------------------------
         VALIDATE SESSION
      ----------------------------------------------------- */

      if (!session_id) {

        deletePhysicalFile(
          uploadedFilePath
        );

        return res.status(400).json({
          success: false,
          message:
            "Session ID is required.",
        });

      }


      /* -----------------------------------------------------
         FIND DOCUMENT ID
      ----------------------------------------------------- */

      let documentId = null;

      for (
        const id in criteria32Documents
      ) {

        const master =
          criteria32Documents[id];

        if (
          master.documentName
            .trim()
            .toLowerCase() ===
          String(documentName)
            .trim()
            .toLowerCase()
        ) {

          documentId =
            parseInt(id, 10);

          break;
        }

      }


      /* -----------------------------------------------------
         INVALID DOCUMENT
      ----------------------------------------------------- */

      if (!documentId) {

        deletePhysicalFile(
          uploadedFilePath
        );

        return res.status(400).json({
          success: false,
          message:
            "Invalid Criteria 3.2 Document Name.",
        });

      }


      /* -----------------------------------------------------
         FILE INFORMATION
      ----------------------------------------------------- */

      const originalFileName =
        req.file.originalname;

      const storedFileName =
        req.file.filename;

      const filePath =
        req.file.path.replace(
          /\\/g,
          "/"
        );


      /* -----------------------------------------------------
         LOG
      ----------------------------------------------------- */

      console.log(
        "=============================================="
      );

      console.log(
        "CRITERIA 3.2 NEW SAVE"
      );

      console.log(
        "Session ID      :",
        session_id
      );

      console.log(
        "Document ID     :",
        documentId
      );

      console.log(
        "Document Name   :",
        documentName
      );

      console.log(
        "Original File   :",
        originalFileName
      );

      console.log(
        "Stored File     :",
        storedFileName
      );

      console.log(
        "File Path       :",
        filePath
      );

      console.log(
        "OLD RECORD      : WILL REMAIN"
      );

      console.log(
        "OLD FILE        : WILL REMAIN"
      );

      console.log(
        "NEW RECORD      : WILL BE INSERTED"
      );

      console.log(
        "=============================================="
      );


      /* =====================================================
         IMPORTANT

         DO NOT:
         UPDATE old record
         DELETE old record
         SELECT old record for replacement

         ALWAYS INSERT
      ===================================================== */

      const result =
        await pool.query(
          `
          INSERT INTO criteria3_2
          (
            session_id,
            criteria_no,
            document_id,
            document_name,
            description,
            original_file_name,
            file_name,
            file_path,
            uploaded_at
          )

          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            CURRENT_TIMESTAMP
          )

          RETURNING *
          `,
          [
            String(session_id),
            "3.2",
            documentId,
            documentName,
            description || null,
            originalFileName,
            storedFileName,
            filePath,
          ]
        );


      /* -----------------------------------------------------
         SUCCESS
      ----------------------------------------------------- */

      console.log(
        "NEW DATABASE RECORD ID:",
        result.rows[0].id
      );

      console.log(
        "OLD DATA WAS NOT MODIFIED."
      );


      return res.status(200).json({

        success: true,

        message:
          "Criteria 3.2 File Saved Successfully.",

        data:
          result.rows[0],

      });


    } catch (error) {

      console.error(
        "=============================================="
      );

      console.error(
        "CRITERIA 3.2 SAVE ERROR"
      );

      console.error(
        error
      );

      console.error(
        "=============================================="
      );


      /* -----------------------------------------------------
         DATABASE FAILED

         DELETE ONLY NEW FILE
         OLD FILES ARE SAFE
      ----------------------------------------------------- */

      if (
        uploadedFilePath &&
        fs.existsSync(
          uploadedFilePath
        )
      ) {

        try {

          fs.unlinkSync(
            uploadedFilePath
          );

          console.log(
            "New file deleted because DB insert failed."
          );

        } catch (cleanupError) {

          console.error(
            "New file cleanup error:",
            cleanupError
          );

        }

      }


      return res.status(500).json({

        success: false,

        message:
          "Criteria 3.2 File Save Failed.",

        error:
          error.message,

        detail:
          error.detail || null,

        code:
          error.code || null,

      });

    }

  }
);


/* =========================================================
   CRITERIA 3.2
   GET ALL SAVED FILES

   RETURNS:
   OLD + CURRENT + ALL PREVIOUS RECORDS
========================================================= */

app.get(
  "/criteria3/files/3.2",

  async (req, res) => {

    try {

      const {
        session_id,
      } = req.query;


      /* -----------------------------------------------------
         SESSION CHECK
      ----------------------------------------------------- */

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      /* -----------------------------------------------------
         GET ALL RECORDS

         IMPORTANT:
         DO NOT USE DISTINCT
         DO NOT USE LIMIT
         DO NOT USE DISTINCT ON

         We need every record.
      ----------------------------------------------------- */

      const result =
        await pool.query(
          `
          SELECT
            id,
            session_id,
            criteria_no,
            document_id,
            document_name,
            description,
            original_file_name,
            file_name,
            file_path,
            uploaded_at

          FROM criteria3_2

          WHERE
            session_id = $1
            AND criteria_no = '3.2'

          ORDER BY
            document_id ASC,
            uploaded_at ASC,
            id ASC
          `,
          [
            String(session_id),
          ]
        );


      /* -----------------------------------------------------
         SUCCESS
      ----------------------------------------------------- */

      return res.status(200).json({

        success: true,

        files:
          result.rows,

        count:
          result.rows.length,

      });


    } catch (error) {

      console.error(
        "CRITERIA 3.2 GET ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to fetch Criteria 3.2 files.",

        error:
          error.message,

      });

    }

  }
);


/* =========================================================
   CRITERIA 3.2
   DELETE ALL

   Deletes:
   - ALL database records
   - ALL physical files

   Only for the selected session.
========================================================= */

app.delete(
  "/criteria3/deleteAll/3.2",

  async (req, res) => {

    try {

      const {
        session_id,
      } = req.query;


      /* -----------------------------------------------------
         SESSION CHECK
      ----------------------------------------------------- */

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      /* -----------------------------------------------------
         GET ALL FILE PATHS FIRST
      ----------------------------------------------------- */

      const filesResult =
        await pool.query(
          `
          SELECT
            id,
            file_path

          FROM criteria3_2

          WHERE
            session_id = $1
            AND criteria_no = '3.2'
          `,
          [
            String(session_id),
          ]
        );


      /* -----------------------------------------------------
         DELETE DATABASE RECORDS
      ----------------------------------------------------- */

      const deleteResult =
        await pool.query(
          `
          DELETE FROM criteria3_2

          WHERE
            session_id = $1
            AND criteria_no = '3.2'

          RETURNING id
          `,
          [
            String(session_id),
          ]
        );


      /* -----------------------------------------------------
         DELETE PHYSICAL FILES
      ----------------------------------------------------- */

      let physicalFilesDeleted = 0;

      for (
        const row
        of filesResult.rows
      ) {

        if (!row.file_path) {
          continue;
        }

        const fullPath =
          path.isAbsolute(
            row.file_path
          )
            ? row.file_path
            : path.join(
                __dirname,
                row.file_path
              );

        if (
          fs.existsSync(
            fullPath
          )
        ) {

          try {

            fs.unlinkSync(
              fullPath
            );

            physicalFilesDeleted++;

            console.log(
              "Deleted:",
              fullPath
            );

          } catch (fileError) {

            console.error(
              "Physical file delete failed:",
              fileError
            );

          }

        }

      }


      /* -----------------------------------------------------
         SUCCESS
      ----------------------------------------------------- */

      console.log(
        "Criteria 3.2 DB records deleted:",
        deleteResult.rowCount
      );

      console.log(
        "Criteria 3.2 physical files deleted:",
        physicalFilesDeleted
      );


      return res.status(200).json({

        success: true,

        message:
          "Criteria 3.2 All Files Deleted Successfully.",

        deletedCount:
          deleteResult.rowCount,

        physicalFilesDeleted:
          physicalFilesDeleted,

      });


    } catch (error) {

      console.error(
        "CRITERIA 3.2 DELETE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Criteria 3.2 Delete Failed.",

        error:
          error.message,

      });

    }

  }
);


/* =========================================================
   CRITERIA 3.2
   VIEW FILE

   URL:
   /criteria3/view/3.2/:fileName
========================================================= */

app.get(
  "/criteria3/view/3.2/:fileName",

  async (req, res) => {

    try {

      const {
        fileName,
      } = req.params;

      const {
        session_id,
      } = req.query;


      /* -----------------------------------------------------
         VALIDATE SESSION
      ----------------------------------------------------- */

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      /* -----------------------------------------------------
         FIND EXACT FILE

         IMPORTANT:
         file_name is unique because multer generates
         a different stored filename for every upload.
      ----------------------------------------------------- */

      const result =
        await pool.query(
          `
          SELECT
            original_file_name,
            file_name,
            file_path

          FROM criteria3_2

          WHERE
            file_name = $1
            AND session_id = $2
            AND criteria_no = '3.2'

          LIMIT 1
          `,
          [
            fileName,
            String(session_id),
          ]
        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "File not found.",

        });

      }


      const file =
        result.rows[0];


      /* -----------------------------------------------------
         FILE PATH CHECK
      ----------------------------------------------------- */

      if (!file.file_path) {

        return res.status(404).json({

          success: false,

          message:
            "File path not found.",

        });

      }


      /* -----------------------------------------------------
         CREATE ABSOLUTE PATH
      ----------------------------------------------------- */

      const fullPath =
        path.isAbsolute(
          file.file_path
        )
          ? file.file_path
          : path.join(
              __dirname,
              file.file_path
            );


      /* -----------------------------------------------------
         PHYSICAL FILE CHECK
      ----------------------------------------------------- */

      if (
        !fs.existsSync(
          fullPath
        )
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Physical file not found.",

        });

      }


      /* -----------------------------------------------------
         SEND FILE
      ----------------------------------------------------- */

      return res.sendFile(
        path.resolve(
          fullPath
        )
      );


    } catch (error) {

      console.error(
        "CRITERIA 3.2 VIEW ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "View failed.",

        error:
          error.message,

      });

    }

  }
);


/* =========================================================
   CRITERIA 3.2
   DOWNLOAD FILE
========================================================= */

app.get(
  "/criteria3/download/3.2/:fileName",

  async (req, res) => {

    try {

      const {
        fileName,
      } = req.params;

      const {
        session_id,
      } = req.query;


      /* -----------------------------------------------------
         SESSION CHECK
      ----------------------------------------------------- */

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      /* -----------------------------------------------------
         FIND FILE
      ----------------------------------------------------- */

      const result =
        await pool.query(
          `
          SELECT
            original_file_name,
            file_name,
            file_path

          FROM criteria3_2

          WHERE
            file_name = $1
            AND session_id = $2
            AND criteria_no = '3.2'

          LIMIT 1
          `,
          [
            fileName,
            String(session_id),
          ]
        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "File not found.",

        });

      }


      const file =
        result.rows[0];


      /* -----------------------------------------------------
         PATH CHECK
      ----------------------------------------------------- */

      if (!file.file_path) {

        return res.status(404).json({

          success: false,

          message:
            "File path not found.",

        });

      }


      /* -----------------------------------------------------
         ABSOLUTE PATH
      ----------------------------------------------------- */

      const fullPath =
        path.isAbsolute(
          file.file_path
        )
          ? file.file_path
          : path.join(
              __dirname,
              file.file_path
            );


      /* -----------------------------------------------------
         PHYSICAL FILE CHECK
      ----------------------------------------------------- */

      if (
        !fs.existsSync(
          fullPath
        )
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Physical file not found.",

        });

      }


      /* -----------------------------------------------------
         DOWNLOAD WITH ORIGINAL NAME
      ----------------------------------------------------- */

      return res.download(
        path.resolve(
          fullPath
        ),
        file.original_file_name,

        (error) => {

          if (error) {

            console.error(
              "CRITERIA 3.2 DOWNLOAD ERROR:",
              error
            );

          }

        }
      );


    } catch (error) {

      console.error(
        "CRITERIA 3.2 DOWNLOAD ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Download failed.",

        error:
          error.message,

      });

    }

  }
);


/* =========================================================
   CRITERIA 3.2 END
========================================================= */

/* =========================================================
   ========================================================
   CRITERIA 3.3 START
   Laboratory Work & Workshop
   ========================================================
========================================================= */


/* =========================================================
   CRITERIA 3.3 - DOCUMENT MASTER
========================================================= */

const criteria33Documents = {
  1: {
    documentName: "Lab Evaluation",

    description:
      "Evaluation of experiments conducted in workshops/laboratories",
  },

  2: {
    documentName: "Rubrics Assessment",

    description:
      "Use of rubrics for assessing student performance with relevance to COs/POs",
  },
};


/* =========================================================
   HELPER
   DELETE PHYSICAL FILE
========================================================= */

const deleteCriteria33PhysicalFile = (filePath) => {
  try {

    if (!filePath) {
      return;
    }

    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, filePath);

    if (fs.existsSync(fullPath)) {

      fs.unlinkSync(fullPath);

      console.log(
        "Criteria 3.3 physical file deleted:",
        fullPath
      );
    }

  } catch (error) {

    console.error(
      "Criteria 3.3 physical file delete error:",
      error
    );

  }
};


/* =========================================================
   CRITERIA 3.3
   UPLOAD / SAVE

   IMPORTANT:

   Every Save = NEW INSERT

   OLD RECORD:
   NOT UPDATED

   OLD DATABASE DATA:
   NOT DELETED

   OLD PHYSICAL FILE:
   NOT DELETED
========================================================= */

app.post(
  "/criteria3/upload/3.3",
  upload.single("file"),

  async (req, res) => {

    let uploadedFilePath = null;

    try {

      /* =====================================================
         FILE CHECK
      ===================================================== */

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Please Select File.",

        });

      }


      uploadedFilePath = req.file.path;


      /* =====================================================
         REQUEST DATA
      ===================================================== */

      const {
        criteriaNo,
        documentName,
        description,
        session_id,
      } = req.body;


      /* =====================================================
         CRITERIA VALIDATION
      ===================================================== */

      if (!criteriaNo) {

        deleteCriteria33PhysicalFile(
          uploadedFilePath
        );

        return res.status(400).json({

          success: false,

          message:
            "Criteria number is required.",

        });

      }


      if (criteriaNo !== "3.3") {

        deleteCriteria33PhysicalFile(
          uploadedFilePath
        );

        return res.status(400).json({

          success: false,

          message:
            "Invalid Criteria Number.",

        });

      }


      /* =====================================================
         DOCUMENT NAME VALIDATION
      ===================================================== */

      if (!documentName) {

        deleteCriteria33PhysicalFile(
          uploadedFilePath
        );

        return res.status(400).json({

          success: false,

          message:
            "Document name is required.",

        });

      }


      /* =====================================================
         SESSION VALIDATION
      ===================================================== */

      if (!session_id) {

        deleteCriteria33PhysicalFile(
          uploadedFilePath
        );

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      /* =====================================================
         FIND DOCUMENT ID
      ===================================================== */

      let documentId = null;


      for (
        const id in criteria33Documents
      ) {

        const masterDocument =
          criteria33Documents[id];


        if (
          masterDocument.documentName
            .trim()
            .toLowerCase() ===
          documentName
            .trim()
            .toLowerCase()
        ) {

          documentId =
            parseInt(id, 10);

          break;

        }

      }


      /* =====================================================
         INVALID DOCUMENT
      ===================================================== */

      if (!documentId) {

        deleteCriteria33PhysicalFile(
          uploadedFilePath
        );

        return res.status(400).json({

          success: false,

          message:
            "Invalid Criteria 3.3 Document Name.",

        });

      }


      /* =====================================================
         FILE INFORMATION
      ===================================================== */

      const originalFileName =
        req.file.originalname;


      const storedFileName =
        req.file.filename;


      const filePath =
        req.file.path.replace(
          /\\/g,
          "/"
        );


      /* =====================================================
         LOG
      ===================================================== */

      console.log(
        "=============================================="
      );

      console.log(
        "CRITERIA       :",
        criteriaNo
      );

      console.log(
        "DOCUMENT ID    :",
        documentId
      );

      console.log(
        "DOCUMENT NAME  :",
        documentName
      );

      console.log(
        "SESSION ID     :",
        session_id
      );

      console.log(
        "ORIGINAL FILE  :",
        originalFileName
      );

      console.log(
        "STORED FILE    :",
        storedFileName
      );

      console.log(
        "FILE PATH      :",
        filePath
      );

      console.log(
        "OLD RECORD     : WILL REMAIN"
      );

      console.log(
        "OLD FILE       : WILL REMAIN"
      );

      console.log(
        "NEW RECORD     : WILL BE INSERTED"
      );

      console.log(
        "=============================================="
      );


      /* =====================================================
         IMPORTANT

         NO SELECT OLD RECORD

         NO UPDATE

         NO DELETE

         NO UPSERT

         ALWAYS INSERT
      ===================================================== */

      const result =
        await pool.query(
          `
          INSERT INTO criteria3_3
          (
            session_id,
            criteria_no,
            document_id,
            document_name,
            description,
            original_file_name,
            file_name,
            file_path,
            uploaded_at
          )
          VALUES
          (
            $1,
            '3.3',
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            CURRENT_TIMESTAMP
          )
          RETURNING *
          `,
          [
            session_id,
            documentId,
            documentName,
            description || null,
            originalFileName,
            storedFileName,
            filePath,
          ]
        );


      /* =====================================================
         SUCCESS
      ===================================================== */

      console.log(
        "NEW DATABASE RECORD ID:",
        result.rows[0].id
      );

      console.log(
        "OLD DATA WAS NOT MODIFIED."
      );

      console.log(
        "=============================================="
      );


      return res.status(200).json({

        success: true,

        message:
          "Criteria 3.3 File Saved Successfully.",

        data:
          result.rows[0],

      });


    } catch (error) {

      console.error(
        "=============================================="
      );

      console.error(
        "CRITERIA 3.3 UPLOAD ERROR:",
        error
      );

      console.error(
        "=============================================="
      );


      /* =====================================================
         DATABASE FAILED

         Delete ONLY newly uploaded file.

         OLD FILES ARE NEVER TOUCHED.
      ===================================================== */

      if (
        uploadedFilePath &&
        fs.existsSync(uploadedFilePath)
      ) {

        try {

          fs.unlinkSync(
            uploadedFilePath
          );

          console.log(
            "New failed-upload file deleted."
          );

        } catch (deleteError) {

          console.error(
            "Failed-upload file cleanup error:",
            deleteError
          );

        }

      }


      return res.status(500).json({

        success: false,

        message:
          "Criteria 3.3 File Save Failed.",

        error:
          error.message,

      });

    }

  }
);


/* =========================================================
   CRITERIA 3.3
   GET ALL SAVED FILES

   RETURNS:

   OLD + CURRENT

   ALL RECORDS FOR SESSION
========================================================= */

app.get(
  "/criteria3/files/3.3",

  async (req, res) => {

    try {

      const {
        session_id,
      } = req.query;


      /* =====================================================
         SESSION VALIDATION
      ===================================================== */

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      /* =====================================================
         GET ALL RECORDS
      ===================================================== */

      const result =
        await pool.query(
          `
          SELECT
            id,
            session_id,
            criteria_no,
            document_id,
            document_name,
            description,
            original_file_name,
            file_name,
            file_path,
            uploaded_at

          FROM criteria3_3

          WHERE
            session_id = $1

            AND criteria_no = '3.3'

          ORDER BY
            document_id ASC,
            uploaded_at ASC,
            id ASC
          `,
          [
            session_id,
          ]
        );


      /* =====================================================
         LOG
      ===================================================== */

      console.log(
        "Criteria 3.3 records found:",
        result.rows.length
      );


      /* =====================================================
         RESPONSE
      ===================================================== */

      return res.status(200).json({

        success: true,

        files:
          result.rows,

        count:
          result.rows.length,

      });


    } catch (error) {

      console.error(
        "CRITERIA 3.3 GET FILES ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to fetch Criteria 3.3 files.",

        error:
          error.message,

      });

    }

  }
);


/* =========================================================
   CRITERIA 3.3
   DELETE ALL

   Deletes:

   1. OLD DB RECORDS
   2. CURRENT DB RECORDS
   3. OLD PHYSICAL FILES
   4. CURRENT PHYSICAL FILES
========================================================= */

app.delete(
  "/criteria3/deleteAll/3.3",

  async (req, res) => {

    try {

      const {
        session_id,
      } = req.query;


      /* =====================================================
         SESSION VALIDATION
      ===================================================== */

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      /* =====================================================
         FIRST GET ALL FILE PATHS
      ===================================================== */

      const filesResult =
        await pool.query(
          `
          SELECT
            id,
            file_path

          FROM criteria3_3

          WHERE
            session_id = $1

            AND criteria_no = '3.3'
          `,
          [
            session_id,
          ]
        );


      /* =====================================================
         DELETE ALL DATABASE RECORDS
      ===================================================== */

      const deleteResult =
        await pool.query(
          `
          DELETE FROM criteria3_3

          WHERE
            session_id = $1

            AND criteria_no = '3.3'

          RETURNING id
          `,
          [
            session_id,
          ]
        );


      /* =====================================================
         DELETE ALL PHYSICAL FILES
      ===================================================== */

      for (
        const row
        of filesResult.rows
      ) {

        deleteCriteria33PhysicalFile(
          row.file_path
        );

      }


      /* =====================================================
         LOG
      ===================================================== */

      console.log(
        "Criteria 3.3 deleted records:",
        deleteResult.rowCount
      );


      /* =====================================================
         RESPONSE
      ===================================================== */

      return res.status(200).json({

        success: true,

        message:
          "Criteria 3.3 All Files Deleted Successfully.",

        deletedCount:
          deleteResult.rowCount,

      });


    } catch (error) {

      console.error(
        "CRITERIA 3.3 DELETE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Criteria 3.3 Delete Failed.",

        error:
          error.message,

      });

    }

  }
);


/* =========================================================
   CRITERIA 3.3
   VIEW FILE
========================================================= */

app.get(
  "/criteria3/view/3.3/:fileName",

  async (req, res) => {

    try {

      const {
        fileName,
      } = req.params;


      const {
        session_id,
      } = req.query;


      /* =====================================================
         VALIDATION
      ===================================================== */

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      /* =====================================================
         FIND FILE
      ===================================================== */

      const result =
        await pool.query(
          `
          SELECT
            original_file_name,
            file_path

          FROM criteria3_3

          WHERE
            file_name = $1

            AND session_id = $2

            AND criteria_no = '3.3'

          LIMIT 1
          `,
          [
            fileName,
            session_id,
          ]
        );


      /* =====================================================
         FILE NOT FOUND
      ===================================================== */

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "File not found.",

        });

      }


      const file =
        result.rows[0];


      /* =====================================================
         FILE PATH CHECK
      ===================================================== */

      if (!file.file_path) {

        return res.status(404).json({

          success: false,

          message:
            "File path not found.",

        });

      }


      /* =====================================================
         BUILD FULL PATH
      ===================================================== */

      const fullPath =
        path.isAbsolute(
          file.file_path
        )
          ? file.file_path
          : path.join(
              __dirname,
              file.file_path
            );


      /* =====================================================
         PHYSICAL FILE CHECK
      ===================================================== */

      if (
        !fs.existsSync(
          fullPath
        )
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Physical file not found.",

        });

      }


      /* =====================================================
         VIEW
      ===================================================== */

      return res.sendFile(
        path.resolve(
          fullPath
        )
      );


    } catch (error) {

      console.error(
        "CRITERIA 3.3 VIEW ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "View failed.",

        error:
          error.message,

      });

    }

  }
);


/* =========================================================
   CRITERIA 3.3
   DOWNLOAD FILE
========================================================= */

app.get(
  "/criteria3/download/3.3/:fileName",

  async (req, res) => {

    try {

      const {
        fileName,
      } = req.params;


      const {
        session_id,
      } = req.query;


      /* =====================================================
         VALIDATION
      ===================================================== */

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      /* =====================================================
         FIND FILE
      ===================================================== */

      const result =
        await pool.query(
          `
          SELECT
            original_file_name,
            file_path

          FROM criteria3_3

          WHERE
            file_name = $1

            AND session_id = $2

            AND criteria_no = '3.3'

          LIMIT 1
          `,
          [
            fileName,
            session_id,
          ]
        );


      /* =====================================================
         FILE NOT FOUND
      ===================================================== */

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "File not found.",

        });

      }


      const file =
        result.rows[0];


      /* =====================================================
         FILE PATH CHECK
      ===================================================== */

      if (!file.file_path) {

        return res.status(404).json({

          success: false,

          message:
            "File path not found.",

        });

      }


      /* =====================================================
         BUILD FULL PATH
      ===================================================== */

      const fullPath =
        path.isAbsolute(
          file.file_path
        )
          ? file.file_path
          : path.join(
              __dirname,
              file.file_path
            );


      /* =====================================================
         PHYSICAL FILE CHECK
      ===================================================== */

      if (
        !fs.existsSync(
          fullPath
        )
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Physical file not found.",

        });

      }


      /* =====================================================
         DOWNLOAD
      ===================================================== */

      return res.download(
        fullPath,
        file.original_file_name,
        (error) => {

          if (error) {

            console.error(
              "Criteria 3.3 DOWNLOAD ERROR:",
              error
            );

          }

        }
      );


    } catch (error) {

      console.error(
        "CRITERIA 3.3 DOWNLOAD ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Download failed.",

        error:
          error.message,

      });

    }

  }
);


/* =========================================================
   CRITERIA 3.3 END
========================================================= */
// =========================================================
// CRITERIA 3.4 - UPLOAD / SAVE
// =========================================================
// =========================================================
// CRITERIA 3.4 - UPLOAD / SAVE
// EVERY SAVE = NEW DATABASE RECORD
// OLD RECORDS WILL NEVER BE UPDATED OR DELETED
// =========================================================

app.post(
  "/criteria3/upload/3.4",
  upload.single("file"),

  async (req, res) => {

    let uploadedFilePath = null;

    try {

      console.log(
        "=============================================="
      );

      console.log(
        "CRITERIA 3.4 UPLOAD REQUEST"
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );

      console.log(
        "=============================================="
      );


      // =====================================================
      // FILE CHECK
      // =====================================================

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Please select a file.",

        });

      }


      uploadedFilePath = req.file.path;


      // =====================================================
      // GET FORM DATA
      // =====================================================

      const {
        criteriaNo,
        documentName,
        description,
        session_id,
      } = req.body;


      // =====================================================
      // SESSION VALIDATION
      // =====================================================

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      // =====================================================
      // DOCUMENT NAME VALIDATION
      // =====================================================

      if (!documentName) {

        return res.status(400).json({

          success: false,

          message:
            "Document name is required.",

        });

      }


      // =====================================================
      // CRITERIA VALIDATION
      // =====================================================

      if (
        String(criteriaNo).trim() !== "3.4"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Criteria Number.",

        });

      }


      // =====================================================
      // DOCUMENT ID
      // =====================================================

      let documentId = null;


      if (
        String(documentName).trim() ===
        "Internship Relevance"
      ) {

        documentId = 1;

      }

      else if (
        String(documentName).trim() ===
        "Internship Rubrics"
      ) {

        documentId = 2;

      }

      else {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Criteria 3.4 document.",

        });

      }


      // =====================================================
      // FILE INFORMATION
      // =====================================================

      const originalFileName =
        req.file.originalname;


      const storedFileName =
        req.file.filename;


      const filePath =
        path
          .join(
            "uploads",
            req.file.filename
          )
          .replace(
            /\\/g,
            "/"
          );


      // =====================================================
      // LOG
      // =====================================================

      console.log(
        "=============================================="
      );

      console.log(
        "CRITERIA       : 3.4"
      );

      console.log(
        "SESSION ID     :",
        session_id
      );

      console.log(
        "DOCUMENT ID    :",
        documentId
      );

      console.log(
        "DOCUMENT NAME  :",
        documentName
      );

      console.log(
        "ORIGINAL FILE  :",
        originalFileName
      );

      console.log(
        "STORED FILE    :",
        storedFileName
      );

      console.log(
        "FILE PATH      :",
        filePath
      );

      console.log(
        "OLD DATA       : WILL REMAIN"
      );

      console.log(
        "OLD FILE       : WILL REMAIN"
      );

      console.log(
        "NEW DATA       : WILL BE INSERTED"
      );

      console.log(
        "NEW FILE       : WILL BE KEPT"
      );

      console.log(
        "=============================================="
      );


      // =====================================================
      // IMPORTANT
      //
      // NO SELECT OLD RECORD
      // NO UPDATE
      // NO DELETE
      // NO UPSERT
      //
      // EVERY SAVE = NEW INSERT
      // =====================================================

      const result =
        await pool.query(
          `
          INSERT INTO criteria3_4
          (
            session_id,
            criteria_no,
            document_id,
            document_name,
            description,
            original_file_name,
            file_name,
            file_path,
            uploaded_at
          )

          VALUES
          (
            $1,
            '3.4',
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            CURRENT_TIMESTAMP
          )

          RETURNING *
          `,
          [

            String(session_id),

            documentId,

            documentName,

            description || null,

            originalFileName,

            storedFileName,

            filePath,

          ]
        );


      // =====================================================
      // SUCCESS
      // =====================================================

      console.log(
        "NEW DATABASE RECORD ID:",
        result.rows[0].id
      );

      console.log(
        "OLD RECORDS WERE NOT MODIFIED."
      );

      console.log(
        "OLD PHYSICAL FILES WERE NOT DELETED."
      );

      console.log(
        "=============================================="
      );


      return res.status(200).json({

        success: true,

        message:
          "Criteria 3.4 File Saved Successfully.",

        file:
          result.rows[0],

      });


    } catch (error) {

      console.error(
        "=============================================="
      );

      console.error(
        "CRITERIA 3.4 UPLOAD ERROR:",
        error
      );

      console.error(
        "=============================================="
      );


      // =====================================================
      // DATABASE FAILED
      //
      // Delete ONLY the newly uploaded file.
      //
      // OLD FILES ARE NEVER TOUCHED.
      // =====================================================

      if (
        uploadedFilePath &&
        fs.existsSync(
          uploadedFilePath
        )
      ) {

        try {

          fs.unlinkSync(
            uploadedFilePath
          );

          console.log(
            "New uploaded file deleted because DB insert failed."
          );

        } catch (cleanupError) {

          console.error(
            "New file cleanup error:",
            cleanupError
          );

        }

      }


      return res.status(500).json({

        success: false,

        message:
          "Criteria 3.4 File Save Failed.",

        error:
          error.message,

        detail:
          error.detail || null,

        code:
          error.code || null,

      });

    }

  }
);
// =========================================================
// CRITERIA 3.4 - GET SAVED FILES
// =========================================================

app.get(
  "/criteria3/files/3.4",
  async (req, res) => {
    try {

      const {
        session_id,
      } = req.query;

      console.log(
        "GET 3.4 FILES SESSION:",
        session_id
      );

      if (!session_id) {
        return res.status(400).json({
          success: false,
          message:
            "Session ID is required.",
        });
      }

      const result =
        await pool.query(
          `
          SELECT
            id,
            session_id,
            criteria_no,
            document_id,
            document_name,
            description,
            original_file_name,
            file_name,
            file_path,
            uploaded_at

          FROM criteria3_4

          WHERE session_id = $1
            AND criteria_no = '3.4'

          ORDER BY document_id ASC
          `,
          [
            String(session_id),
          ]
        );

      return res.status(200).json(
        result.rows
      );

    } catch (error) {

      console.error(
        "GET CRITERIA 3.4 FILES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to get Criteria 3.4 files.",
        error:
          error.message,
      });
    }
  }
);


// =========================================================
// CRITERIA 3.4 - DELETE ALL FILES
// =========================================================

app.delete(
  "/criteria3/deleteAll/3.4",
  async (req, res) => {
    try {

      const {
        session_id,
      } = req.query;

      console.log(
        "DELETE 3.4 SESSION:",
        session_id
      );

      if (!session_id) {
        return res.status(400).json({
          success: false,
          message:
            "Session ID is required.",
        });
      }

      // -----------------------------------------------------
      // GET FILES FIRST
      // -----------------------------------------------------

      const existingFiles =
        await pool.query(
          `
          SELECT file_path
          FROM criteria3_4

          WHERE session_id = $1
            AND criteria_no = '3.4'
          `,
          [
            String(session_id),
          ]
        );

      // -----------------------------------------------------
      // DELETE PHYSICAL FILES
      // -----------------------------------------------------

      for (
        const file
        of existingFiles.rows
      ) {

        if (
          !file.file_path
        ) {
          continue;
        }

        const physicalPath =
          path.join(
            __dirname,
            file.file_path
          );

        if (
          fs.existsSync(
            physicalPath
          )
        ) {
          try {
            fs.unlinkSync(
              physicalPath
            );

            console.log(
              "Deleted file:",
              physicalPath
            );

          } catch (
            fileDeleteError
          ) {

            console.error(
              "PHYSICAL FILE DELETE ERROR:",
              fileDeleteError
            );
          }
        }
      }

      // -----------------------------------------------------
      // DELETE DATABASE RECORDS
      // -----------------------------------------------------

      const result =
        await pool.query(
          `
          DELETE FROM criteria3_4

          WHERE session_id = $1
            AND criteria_no = '3.4'

          RETURNING id
          `,
          [
            String(session_id),
          ]
        );

      return res.status(200).json({

        success: true,

        message:
          "Criteria 3.4 files deleted successfully.",

        deletedCount:
          result.rowCount,

      });

    } catch (error) {

      console.error(
        "CRITERIA 3.4 DELETE ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete Criteria 3.4 files.",

        error:
          error.message,

      });
    }
  }
);

//==========================================
//Start code 3.5 
//=========================================
// =========================================================
// CRITERIA 3.5 - UPLOAD
// =========================================================

// =========================================================
// CRITERIA 3.5 - UPLOAD / SAVE
// =========================================================
// =========================================================
// CRITERIA 3.5 - UPLOAD / SAVE
// EVERY SAVE = NEW DATABASE RECORD
//
// IMPORTANT:
// - Existing records are NEVER updated
// - Existing records are NEVER deleted
// - Every upload creates a NEW row
// - Every uploaded file gets its own database record
// =========================================================

app.post(
  "/criteria3/upload/3.5",
  upload.single("file"),

  async (req, res) => {
    let uploadedFilePath = null;

    try {
      // =====================================================
      // FILE CHECK
      // =====================================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a file.",
        });
      }

      uploadedFilePath = req.file.path;

      // =====================================================
      // REQUEST DATA
      // =====================================================

      const {
        criteriaNo,
        documentId,
        documentName,
        description,
        session_id,
      } = req.body;

      // =====================================================
      // VALIDATION
      // =====================================================

      if (!session_id) {
        return res.status(400).json({
          success: false,
          message: "Session ID is required.",
        });
      }

      if (
        String(criteriaNo).trim() !== "3.5"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid Criteria Number.",
        });
      }

      if (!documentId) {
        return res.status(400).json({
          success: false,
          message: "Document ID is required.",
        });
      }

      if (!documentName) {
        return res.status(400).json({
          success: false,
          message: "Document name is required.",
        });
      }

      // =====================================================
      // FILE INFORMATION
      // =====================================================

      const originalFileName =
        req.file.originalname;

      const storedFileName =
        req.file.filename;

      const filePath =
        path
          .join("uploads", storedFileName)
          .replace(/\\/g, "/");

      // =====================================================
      // LOG
      // =====================================================

      console.log(
        "=============================================="
      );

      console.log(
        "CRITERIA 3.5 NEW SAVE"
      );

      console.log(
        "SESSION ID    :",
        session_id
      );

      console.log(
        "DOCUMENT ID   :",
        documentId
      );

      console.log(
        "DOCUMENT NAME :",
        documentName
      );

      console.log(
        "ORIGINAL FILE :",
        originalFileName
      );

      console.log(
        "STORED FILE   :",
        storedFileName
      );

      console.log(
        "=============================================="
      );

      // =====================================================
      // IMPORTANT
      //
      // ALWAYS INSERT
      //
      // DO NOT:
      // UPDATE
      // DELETE
      // UPSERT
      // SELECT OLD RECORD
      //
      // Every save = NEW ROW
      // =====================================================

      const result = await pool.query(
        `
        INSERT INTO criteria3_5
        (
          session_id,
          criteria_no,
          document_id,
          document_name,
          description,
          original_file_name,
          file_name,
          file_path,
          uploaded_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          CURRENT_TIMESTAMP
        )
        RETURNING *
        `,
        [
          String(session_id),
          String(criteriaNo),
          String(documentId),
          documentName,
          description || null,
          originalFileName,
          storedFileName,
          filePath,
        ]
      );

      // =====================================================
      // SUCCESS
      // =====================================================

      console.log(
        "NEW DATABASE ROW ID:",
        result.rows[0].id
      );

      console.log(
        "NEW RECORD INSERTED SUCCESSFULLY"
      );

      console.log(
        "=============================================="
      );

      return res.status(200).json({
        success: true,

        message:
          "Criteria 3.5 File Saved Successfully.",

        data:
          result.rows[0],
      });

    } catch (error) {

      console.error(
        "CRITERIA 3.5 SAVE ERROR:",
        error
      );

      // =====================================================
      // IF DATABASE INSERT FAILS
      // DELETE ONLY NEWLY UPLOADED FILE
      // =====================================================

      if (
        uploadedFilePath &&
        fs.existsSync(uploadedFilePath)
      ) {
        try {
          fs.unlinkSync(uploadedFilePath);

          console.log(
            "New file deleted because database insert failed."
          );

        } catch (cleanupError) {
          console.error(
            "File cleanup error:",
            cleanupError
          );
        }
      }

      return res.status(500).json({
        success: false,

        message:
          "Criteria 3.5 File Save Failed.",

        error:
          error.message,

        detail:
          error.detail || null,

        code:
          error.code || null,
      });
    }
  }
);

// =========================================================
// CRITERIA 3.5 - GET FILES
// =========================================================
// =========================================================
// CRITERIA 3.5 - GET ALL SAVED FILES
//
// IMPORTANT:
// Returns EVERY saved record.
//
// No DISTINCT
// No LIMIT
// No UPDATE
// No replacement
//
// Whatever is stored in PostgreSQL
// will be returned to frontend.
// =========================================================

app.get(
  "/criteria3/files/3.5",

  async (req, res) => {

    try {

      const {
        session_id,
      } = req.query;

      // =====================================================
      // SESSION VALIDATION
      // =====================================================

      if (!session_id) {

        return res.status(400).json({
          success: false,
          message:
            "Session ID is required.",
        });

      }

      // =====================================================
      // GET ALL RECORDS
      // =====================================================

      const result =
        await pool.query(
          `
          SELECT
            id,
            session_id,
            criteria_no,
            document_id,
            document_name,
            description,
            original_file_name,
            file_name,
            file_path,
            uploaded_at

          FROM criteria3_5

          WHERE
            session_id = $1

            AND criteria_no = '3.5'

          ORDER BY
            uploaded_at ASC,
            id ASC
          `,
          [
            String(session_id),
          ]
        );

      // =====================================================
      // LOG
      // =====================================================

      console.log(
        "=============================================="
      );

      console.log(
        "CRITERIA 3.5 RECORDS FOUND:",
        result.rows.length
      );

      console.log(
        "SESSION ID:",
        session_id
      );

      console.log(
        "=============================================="
      );

      // =====================================================
      // RETURN EVERY RECORD
      // =====================================================

      return res.status(200).json({

        success: true,

        files:
          result.rows,

        count:
          result.rows.length,

      });

    } catch (error) {

      console.error(
        "CRITERIA 3.5 GET FILES ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to fetch Criteria 3.5 files.",

        error:
          error.message,

      });

    }

  }
);
// =========================================================
// CRITERIA 3.5 - DELETE ALL
// =========================================================

app.delete(
  "/criteria3/deleteAll/3.5",
  async (req, res) => {
    try {
      const session_id =
        req.query.session_id ||
        req.headers["x-session-id"] ||
        "default-session";

      // -----------------------------------------------------
      // GET FILE PATHS
      // -----------------------------------------------------

      const result = await pool.query(
        `
        SELECT file_path
        FROM criteria3_5
        WHERE session_id = $1
          AND criteria_no = '3.5'
        `,
        [session_id]
      );

      // -----------------------------------------------------
      // DELETE PHYSICAL FILES
      // -----------------------------------------------------

      for (const row of result.rows) {
        if (!row.file_path) continue;

        const fullPath =
          path.join(
            __dirname,
            row.file_path
          );

        if (
          fs.existsSync(fullPath)
        ) {
          try {
            fs.unlinkSync(fullPath);
          } catch (fileError) {
            console.log(
              "Physical file delete error:",
              fileError
            );
          }
        }
      }

      // -----------------------------------------------------
      // DELETE DATABASE RECORDS
      // -----------------------------------------------------

      await pool.query(
        `
        DELETE FROM criteria3_5
        WHERE session_id = $1
          AND criteria_no = '3.5'
        `,
        [session_id]
      );

      res.json({
        success: true,
        message:
          "Criteria 3.5 files deleted successfully",
      });
    } catch (error) {
      console.error(
        "Criteria 3.5 Delete Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Criteria 3.5 delete failed",
        error: error.message,
      });
    }
  }
);

//===============================
//Start code 3.6
//===============================
// ==========================================================
// CRITERIA 3.6 - SUSTAINABLE DEVELOPMENT GOALS
// ==========================================================

const criteria36Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(
      __dirname,
      "uploads",
      "criteria3",
      "3.6"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const criteria36Upload = multer({
  storage: criteria36Storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});


// ==========================================================
// SAVE CRITERIA 3.6
// IMPORTANT:
// EVERY SAVE = NEW DATABASE RECORD
// NO UPDATE / NO OVERWRITE
// ==========================================================

app.post(
  "/criteria3/3.6/upload",
  criteria36Upload.single("file"),
  async (req, res) => {
    try {
      console.log("====================================");
      console.log("CRITERIA 3.6 UPLOAD");
      console.log("====================================");

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "File is required",
        });
      }

      const {
        session_id,
        criteriaNo,
        documentName,
        description,
      } = req.body;

      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

      if (!documentName) {
        return res.status(400).json({
          success: false,
          message: "Document name is required",
        });
      }

      // ------------------------------------------------------
      // ORIGINAL FILE NAME
      // ------------------------------------------------------

      const originalFileName =
        req.file.originalname;

      // ------------------------------------------------------
      // STORED FILE NAME
      // ------------------------------------------------------

      const storedFileName =
        req.file.filename;

      // ------------------------------------------------------
      // FILE PATH
      // ------------------------------------------------------

      const filePath =
        `uploads/criteria3/3.6/${storedFileName}`;

      // ------------------------------------------------------
      // INSERT NEW RECORD
      // ------------------------------------------------------
      // IMPORTANT:
      // Do NOT SELECT existing record.
      // Do NOT UPDATE existing record.
      // Every Save creates a NEW row.
      // ------------------------------------------------------

      const result = await pool.query(
        `
        INSERT INTO criteria3_6_documents
        (
          session_id,
          criteria_no,
          document_name,
          description,
          original_file_name,
          stored_file_name,
          file_path,
          file_type,
          file_size
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9
        )
        RETURNING *
        `,
        [
          session_id || null,
          criteriaNo || "3.6",
          documentName,
          description || "",
          originalFileName,
          storedFileName,
          filePath,
          req.file.mimetype || null,
          req.file.size || 0,
        ]
      );

      console.log(
        "CRITERIA 3.6 DATA SAVED:",
        result.rows[0]
      );

      return res.status(201).json({
        success: true,
        message:
          "Criteria 3.6 data saved successfully",
        data: result.rows[0],
      });

    } catch (error) {
      console.error(
        "CRITERIA 3.6 UPLOAD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to save Criteria 3.6 data",
        error: error.message,
      });
    }
  }
);

// ==========================================================
// GET ALL CRITERIA 3.6 FILES
// ==========================================================

app.get(
  "/criteria3/files/3.6",
  async (req, res) => {
    try {
      const { session_id } = req.query;

      let result;

      if (session_id) {
        result = await pool.query(
          `
          SELECT
            id,
            session_id,
            criteria_no,
            document_name,
            description,
            original_file_name,
            stored_file_name,
            file_path,
            file_type,
            file_size,
            created_at
          FROM criteria3_6_documents
          WHERE session_id = $1
          ORDER BY created_at ASC, id ASC
          `,
          [session_id]
        );
      } else {
        result = await pool.query(
          `
          SELECT
            id,
            session_id,
            criteria_no,
            document_name,
            description,
            original_file_name,
            stored_file_name,
            file_path,
            file_type,
            file_size,
            created_at
          FROM criteria3_6_documents
          WHERE criteria_no = '3.6'
          ORDER BY created_at ASC, id ASC
          `
        );
      }

      return res.json(result.rows);

    } catch (error) {
      console.error(
        "GET CRITERIA 3.6 FILES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch Criteria 3.6 files",
        error: error.message,
      });
    }
  }
);

// ==========================================================
// DELETE ALL CRITERIA 3.6 DATA
// ==========================================================

app.delete(
  "/criteria3/3.6/delete",
  async (req, res) => {
    try {
      const { session_id } = req.query;

      if (!session_id) {
        return res.status(400).json({
          success: false,
          message: "session_id is required",
        });
      }

      // ------------------------------------------------------
      // FIRST GET FILE PATHS
      // ------------------------------------------------------

      const filesResult = await pool.query(
        `
        SELECT file_path
        FROM criteria3_6_documents
        WHERE session_id = $1
        `,
        [session_id]
      );

      // ------------------------------------------------------
      // DELETE PHYSICAL FILES
      // ------------------------------------------------------

      for (const row of filesResult.rows) {
        if (!row.file_path) {
          continue;
        }

        const fullPath = path.join(
          __dirname,
          row.file_path
        );

        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (fileError) {
            console.error(
              "FILE DELETE ERROR:",
              fileError
            );
          }
        }
      }

      // ------------------------------------------------------
      // DELETE DATABASE RECORDS
      // ------------------------------------------------------

      const deleteResult = await pool.query(
        `
        DELETE FROM criteria3_6_documents
        WHERE session_id = $1
        `,
        [session_id]
      );

      return res.json({
        success: true,
        message:
          "Criteria 3.6 data deleted successfully",
        deletedCount:
          deleteResult.rowCount,
      });

    } catch (error) {
      console.error(
        "DELETE CRITERIA 3.6 ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete Criteria 3.6 data",
        error: error.message,
      });
    }
  }
);

//==============================================
//Start 3.7.1 code
//==============================================
// ============================================================
// CRITERIA 3.7.1 - UPLOAD DOCUMENT
// ============================================================

// ============================================================
// CRITERIA 3.7.1 - UPLOAD FILE
// EVERY SAVE CREATES A NEW ROW
// ============================================================

app.post(
  "/criteria3/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a file",
        });
      }

      const {
        criteriaNo,
        documentName,
        session_id,
        description,
      } = req.body;

      // --------------------------------------------------------
      // VALIDATION
      // --------------------------------------------------------

      if (!criteriaNo) {
        return res.status(400).json({
          success: false,
          message: "Criteria number is required",
        });
      }

      if (!documentName) {
        return res.status(400).json({
          success: false,
          message: "Document name is required",
        });
      }

      if (String(criteriaNo) !== "3.7.1") {
        return res.status(400).json({
          success: false,
          message: "Invalid criteria number",
        });
      }

      // --------------------------------------------------------
      // SESSION ID
      // --------------------------------------------------------

      const actualSessionId =
        session_id ||
        req.body.sessionId ||
        "default-session";

      // --------------------------------------------------------
      // FILE DETAILS
      // --------------------------------------------------------

      const originalFileName =
        req.file.originalname;

      const storedFileName =
        req.file.filename;

      const filePath =
        req.file.path
          .replace(/\\/g, "/")
          .replace(
            __dirname.replace(/\\/g, "/"),
            ""
          )
          .replace(/^\/+/, "");

      const fileType =
        req.file.mimetype;

      const fileSize =
        req.file.size;

      // --------------------------------------------------------
      // IMPORTANT
        // NO SELECT
        // NO UPDATE
        // NO DUPLICATE CHECK
        //
        // EVERY SAVE = NEW DATABASE ROW
      // --------------------------------------------------------

      const result = await pool.query(
        `
        INSERT INTO criteria3_7_1_documents
        (
          session_id,
          criteria_no,
          document_name,
          description,
          original_file_name,
          stored_file_name,
          file_path,
          file_type,
          file_size
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [
          actualSessionId,
          criteriaNo,
          documentName,
          description || null,
          originalFileName,
          storedFileName,
          filePath,
          fileType,
          fileSize,
        ]
      );

      return res.status(200).json({
        success: true,
        message: "File saved successfully",
        data: result.rows[0],
      });

    } catch (error) {
      console.error(
        "CRITERIA 3.7.1 UPLOAD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "File upload failed",
        error: error.message,
      });
    }
  }
);


// ============================================================
// CRITERIA 3.7.1 - GET FILES
// ============================================================

app.get(
  "/criteria3/files/:criteriaNo",
  async (req, res) => {
    try {
      const { criteriaNo } = req.params;

      if (criteriaNo !== "3.7.1") {
        return res.status(400).json({
          message: "Invalid criteria number",
        });
      }

      const result = await pool.query(
        `
        SELECT
          id,
          session_id,
          criteria_no,
          document_name,
          description,
          original_file_name,
          stored_file_name,
          file_path,
          file_type,
          file_size,
          uploaded_at
        FROM criteria3_7_1_documents
        WHERE criteria_no = $1
        ORDER BY id ASC
        `,
        [criteriaNo]
      );

      return res.status(200).json(
        result.rows
      );
    } catch (error) {
      console.error(
        "CRITERIA 3.7.1 GET FILES ERROR:",
        error
      );

      return res.status(500).json({
        message: "Unable to get saved files",
        error: error.message,
      });
    }
  }
);

// ============================================================
// CRITERIA 3.7.1 - DELETE ALL
// ============================================================

app.delete(
  "/criteria3/deleteAll/:criteriaNo",
  async (req, res) => {
    try {
      const { criteriaNo } = req.params;

      if (criteriaNo !== "3.7.1") {
        return res.status(400).json({
          message: "Invalid criteria number",
        });
      }

      /*
       * GET FILE PATHS FIRST
       * SO PHYSICAL FILES CAN ALSO BE DELETED
       */

      const result = await pool.query(
        `
        SELECT file_path
        FROM criteria3_7_1_documents
        WHERE criteria_no = $1
        `,
        [criteriaNo]
      );

      /*
       * DELETE DATABASE RECORDS
       */

      await pool.query(
        `
        DELETE FROM criteria3_7_1_documents
        WHERE criteria_no = $1
        `,
        [criteriaNo]
      );

      /*
       * DELETE PHYSICAL FILES
       */

      for (const row of result.rows) {
        try {
          if (!row.file_path) {
            continue;
          }

          const absolutePath =
            path.join(
              __dirname,
              row.file_path
            );

          if (
            fs.existsSync(
              absolutePath
            )
          ) {
            fs.unlinkSync(
              absolutePath
            );
          }
        } catch (fileError) {
          console.error(
            "FILE DELETE ERROR:",
            fileError
          );
        }
      }

      return res.status(200).json({
        success: true,
        message:
          "All Criteria 3.7.1 files deleted successfully",
      });
    } catch (error) {
      console.error(
        "CRITERIA 3.7.1 DELETE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Delete failed",
        error: error.message,
      });
    }
  }
);



// ============================================================
// START CRITERIA 3.7.2
// COURSE OUTCOME ATTAINMENT
// ============================================================


// ============================================================
// CRITERIA 3.7.2 UPLOAD FOLDER
// ============================================================

const criteria372UploadFolder = path.join(
  __dirname,
  "uploads",
  "criteria3",
  "3.7.2"
);


if (!fs.existsSync(criteria372UploadFolder)) {
  fs.mkdirSync(criteria372UploadFolder, {
    recursive: true,
  });
}


// ============================================================
// CRITERIA 3.7.2 MULTER STORAGE
// ============================================================

const criteria372Storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      criteria372UploadFolder
    );

  },


  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(
      null,
      uniqueName
    );

  },

});


// ============================================================
// ALLOWED FILE TYPES
// ============================================================

const criteria372AllowedExtensions = [

  ".pdf",

  ".doc",

  ".docx",

  ".xls",

  ".xlsx",

  ".ppt",

  ".pptx",

  ".jpg",

  ".jpeg",

  ".png",

];


// ============================================================
// FILE FILTER
// ============================================================

const criteria372FileFilter = (
  req,
  file,
  cb
) => {

  const extension =
    path
      .extname(file.originalname)
      .toLowerCase();


  if (
    criteria372AllowedExtensions.includes(
      extension
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Invalid file type. Allowed files are PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, JPEG and PNG."
      ),
      false
    );

  }

};


// ============================================================
// MULTER CONFIGURATION
// ============================================================

const criteria372Upload = multer({

  storage:
    criteria372Storage,

  fileFilter:
    criteria372FileFilter,

  limits: {

    fileSize:
      50 * 1024 * 1024,

  },

});


// ============================================================
// SAVE CRITERIA 3.7.2 COMPLETE DATA
// ============================================================

app.post(
  "/criteria3/3.7.2/save",

  async (req, res) => {

    try {

      const {

        session_id,

        course,

        coData,

        indirectData,

        courseRecords,

        methodology,

        remarks,

        verificationRemarks,

        decisionRemarks,

        decisions,

        actions,

        hod,

        approval,

        verificationRecords,

        averageAttainment,

        averageLevel,

        achievementPercentage,

        isSubmitted,

      } = req.body;


      // ======================================================
      // VALIDATION
      // ======================================================

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      // ======================================================
      // COURSE DATA DEFAULT
      // ======================================================

      const courseData =
        course || {};


      // ======================================================
      // INSERT OR UPDATE
      // ======================================================

      const result =
        await pool.query(

          `
          INSERT INTO
          criteria3_7_2_course_outcome_attainment
          (

            session_id,

            academic_year,
            department,
            year_of_study,
            semester,

            course_code,
            course_name,
            faculty,

            co_data,
            indirect_data,
            course_records,
            methodology,

            remarks,
            verification_remarks,
            decision_remarks,

            decisions,
            actions,
            hod,
            approval,
            verification_records,

            average_attainment,
            average_level,
            achievement_percentage,

            is_submitted,

            submitted_at,

            updated_at

          )

          VALUES
          (

            $1,

            $2,
            $3,
            $4,
            $5,

            $6,
            $7,
            $8,

            $9,
            $10,
            $11,
            $12,

            $13,
            $14,
            $15,

            $16,
            $17,
            $18,
            $19,
            $20,

            $21,
            $22,
            $23,

            $24,

            CASE
              WHEN $24 = TRUE
              THEN CURRENT_TIMESTAMP
              ELSE NULL
            END,

            CURRENT_TIMESTAMP

          )

          ON CONFLICT (session_id)

          DO UPDATE SET

            academic_year =
              EXCLUDED.academic_year,

            department =
              EXCLUDED.department,

            year_of_study =
              EXCLUDED.year_of_study,

            semester =
              EXCLUDED.semester,

            course_code =
              EXCLUDED.course_code,

            course_name =
              EXCLUDED.course_name,

            faculty =
              EXCLUDED.faculty,

            co_data =
              EXCLUDED.co_data,

            indirect_data =
              EXCLUDED.indirect_data,

            course_records =
              EXCLUDED.course_records,

            methodology =
              EXCLUDED.methodology,

            remarks =
              EXCLUDED.remarks,

            verification_remarks =
              EXCLUDED.verification_remarks,

            decision_remarks =
              EXCLUDED.decision_remarks,

            decisions =
              EXCLUDED.decisions,

            actions =
              EXCLUDED.actions,

            hod =
              EXCLUDED.hod,

            approval =
              EXCLUDED.approval,

            verification_records =
              EXCLUDED.verification_records,

            average_attainment =
              EXCLUDED.average_attainment,

            average_level =
              EXCLUDED.average_level,

            achievement_percentage =
              EXCLUDED.achievement_percentage,

            is_submitted =
              EXCLUDED.is_submitted,

            submitted_at =
              CASE

                WHEN EXCLUDED.is_submitted = TRUE

                THEN CURRENT_TIMESTAMP

                ELSE
                  criteria3_7_2_course_outcome_attainment.submitted_at

              END,

            updated_at =
              CURRENT_TIMESTAMP

          RETURNING *;
          `,

          [

            String(session_id),

            courseData.academicYear || null,

            courseData.department || null,

            courseData.yearOfStudy || null,

            courseData.semester || null,

            courseData.courseCode || null,

            courseData.courseName || null,

            courseData.faculty || null,

            JSON.stringify(
              coData || []
            ),

            JSON.stringify(
              indirectData || []
            ),

            JSON.stringify(
              courseRecords || []
            ),

            JSON.stringify(
              methodology || {}
            ),

            remarks || null,

            verificationRemarks || null,

            decisionRemarks || null,

            JSON.stringify(
              decisions || {}
            ),

            JSON.stringify(
              actions || {}
            ),

            JSON.stringify(
              hod || {}
            ),

            JSON.stringify(
              approval || {}
            ),

            JSON.stringify(
              verificationRecords || {}
            ),

            averageAttainment !== undefined &&
            averageAttainment !== null &&
            averageAttainment !== "—"
              ? Number(averageAttainment)
              : null,

            averageLevel !== undefined &&
            averageLevel !== null &&
            averageLevel !== "—"
              ? Number(averageLevel)
              : null,

            achievementPercentage !== undefined &&
            achievementPercentage !== null &&
            achievementPercentage !== "—"
              ? Number(achievementPercentage)
              : null,

            Boolean(isSubmitted),

          ]

        );


      return res.status(200).json({

        success: true,

        message:
          "Criteria 3.7.2 data saved successfully.",

        data:
          result.rows[0],

      });


    } catch (error) {

      console.error(
        "CRITERIA 3.7.2 SAVE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to save Criteria 3.7.2 data.",

        error:
          error.message,

        detail:
          error.detail || null,

        code:
          error.code || null,

      });

    }

  }
);


// ============================================================
// GET CRITERIA 3.7.2 SAVED DATA
// ============================================================

app.get(
  "/criteria3/3.7.2/data",

  async (req, res) => {

    try {

      const {
        session_id
      } = req.query;


      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      const result =
        await pool.query(

          `
          SELECT *

          FROM
          criteria3_7_2_course_outcome_attainment

          WHERE session_id = $1

          LIMIT 1
          `,

          [
            String(session_id)
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "No saved data found.",

        });

      }


      return res.status(200).json({

        success: true,

        data:
          result.rows[0],

      });


    } catch (error) {

      console.error(
        "CRITERIA 3.7.2 LOAD ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to load Criteria 3.7.2 data.",

        error:
          error.message,

      });

    }

  }
);


// ============================================================
// UPLOAD CRITERIA 3.7.2 DOCUMENT
// ============================================================

app.post(
  "/criteria3/3.7.2/upload",

  criteria372Upload.single("file"),

  async (req, res) => {

    let uploadedFilePath = null;


    try {

      // ======================================================
      // VALIDATE FILE
      // ======================================================

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Please select a file.",

        });

      }


      uploadedFilePath =
        req.file.path;


      const {

        session_id,

        document_id,

        document_name,

      } = req.body;


      // ======================================================
      // VALIDATION
      // ======================================================

      if (!session_id) {

        if (
          fs.existsSync(
            uploadedFilePath
          )
        ) {

          fs.unlinkSync(
            uploadedFilePath
          );

        }


        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      if (
        !document_id &&
        document_id !== 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Document ID is required.",

        });

      }


      if (!document_name) {

        return res.status(400).json({

          success: false,

          message:
            "Document name is required.",

        });

      }


      // ======================================================
      // FILE PATH
      // ======================================================

      const relativeFilePath =
        req.file.path
          .replace(
            /\\/g,
            "/"
          )
          .replace(
            __dirname.replace(
              /\\/g,
              "/"
            ),
            ""
          )
          .replace(
            /^\/+/,
            ""
          );


      // ======================================================
      // CHECK OLD FILE
      // ======================================================

      const oldFileResult =
        await pool.query(

          `
          SELECT *

          FROM criteria3_7_2_documents

          WHERE
            session_id = $1

            AND document_id = $2
          `,

          [
            String(session_id),

            String(document_id),
          ]

        );


      // ======================================================
      // DELETE OLD FILE
      // ======================================================

      if (
        oldFileResult.rows.length > 0
      ) {

        const oldDocument =
          oldFileResult.rows[0];


        if (
          oldDocument.stored_file_name
        ) {

          const oldFilePath =
            path.join(
              criteria372UploadFolder,
              oldDocument.stored_file_name
            );


          if (
            fs.existsSync(
              oldFilePath
            )
          ) {

            fs.unlinkSync(
              oldFilePath
            );

          }

        }

      }


      // ======================================================
      // INSERT OR UPDATE DOCUMENT
      // ======================================================

      const result =
        await pool.query(

          `
          INSERT INTO
          criteria3_7_2_documents
          (

            session_id,

            document_id,

            document_name,

            original_file_name,

            stored_file_name,

            file_path,

            file_type,

            file_size,

            status,

            updated_at

          )

          VALUES
          (

            $1,

            $2,

            $3,

            $4,

            $5,

            $6,

            $7,

            $8,

            'Uploaded',

            CURRENT_TIMESTAMP

          )

          ON CONFLICT
          (
            session_id,
            document_id
          )

          DO UPDATE SET

            document_name =
              EXCLUDED.document_name,

            original_file_name =
              EXCLUDED.original_file_name,

            stored_file_name =
              EXCLUDED.stored_file_name,

            file_path =
              EXCLUDED.file_path,

            file_type =
              EXCLUDED.file_type,

            file_size =
              EXCLUDED.file_size,

            status =
              'Uploaded',

            updated_at =
              CURRENT_TIMESTAMP

          RETURNING *;
          `,

          [

            String(session_id),

            String(document_id),

            document_name,

            req.file.originalname,

            req.file.filename,

            relativeFilePath,

            req.file.mimetype,

            req.file.size,

          ]

        );


      return res.status(200).json({

        success: true,

        message:
          "Document uploaded successfully.",

        document:
          result.rows[0],

      });


    } catch (error) {

      console.error(
        "CRITERIA 3.7.2 UPLOAD ERROR:",
        error
      );


      // ======================================================
      // DATABASE ERROR झाल्यास नवीन FILE DELETE
      // ======================================================

      if (
        uploadedFilePath &&
        fs.existsSync(
          uploadedFilePath
        )
      ) {

        try {

          fs.unlinkSync(
            uploadedFilePath
          );

        } catch (cleanupError) {

          console.error(
            "FILE CLEANUP ERROR:",
            cleanupError
          );

        }

      }


      return res.status(500).json({

        success: false,

        message:
          "Document upload failed.",

        error:
          error.message,

        detail:
          error.detail || null,

        code:
          error.code || null,

      });

    }

  }
);


// ============================================================
// GET ALL CRITERIA 3.7.2 DOCUMENTS
// ============================================================

app.get(
  "/criteria3/3.7.2/documents",

  async (req, res) => {

    try {

      const {
        session_id
      } = req.query;


      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      const result =
        await pool.query(

          `
          SELECT *

          FROM criteria3_7_2_documents

          WHERE session_id = $1

          ORDER BY
            created_at ASC,
            id ASC
          `,

          [
            String(session_id)
          ]

        );


      return res.status(200).json({

        success: true,

        documents:
          result.rows,

        count:
          result.rows.length,

      });


    } catch (error) {

      console.error(
        "CRITERIA 3.7.2 DOCUMENT LOAD ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to load documents.",

        error:
          error.message,

      });

    }

  }
);


// ============================================================
// DELETE SINGLE CRITERIA 3.7.2 DOCUMENT
// ============================================================

app.delete(
  "/criteria3/3.7.2/document/:id",

  async (req, res) => {

    try {

      const {
        id
      } = req.params;


      // ======================================================
      // GET DOCUMENT FIRST
      // ======================================================

      const result =
        await pool.query(

          `
          SELECT *

          FROM criteria3_7_2_documents

          WHERE id = $1
          `,

          [
            Number(id)
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Document not found.",

        });

      }


      const document =
        result.rows[0];


      // ======================================================
      // DELETE DATABASE RECORD
      // ======================================================

      await pool.query(

        `
        DELETE FROM
        criteria3_7_2_documents

        WHERE id = $1
        `,

        [
          Number(id)
        ]

      );


      // ======================================================
      // DELETE PHYSICAL FILE
      // ======================================================

      if (
        document.stored_file_name
      ) {

        const fullFilePath =
          path.join(
            criteria372UploadFolder,
            document.stored_file_name
          );


        if (
          fs.existsSync(
            fullFilePath
          )
        ) {

          fs.unlinkSync(
            fullFilePath
          );

        }

      }


      return res.status(200).json({

        success: true,

        message:
          "Document deleted successfully.",

      });


    } catch (error) {

      console.error(
        "CRITERIA 3.7.2 DOCUMENT DELETE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to delete document.",

        error:
          error.message,

      });

    }

  }
);


// ============================================================
// DELETE COMPLETE CRITERIA 3.7.2 DATA
// ============================================================

app.delete(
  "/criteria3/3.7.2/delete",

  async (req, res) => {

    try {

      const {
        session_id
      } = req.query;


      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required.",

        });

      }


      // ======================================================
      // GET ALL FILES FIRST
      // ======================================================

      const filesResult =
        await pool.query(

          `
          SELECT stored_file_name

          FROM criteria3_7_2_documents

          WHERE session_id = $1
          `,

          [
            String(session_id)
          ]

        );


      // ======================================================
      // DELETE DOCUMENT RECORDS
      // ======================================================

      await pool.query(

        `
        DELETE FROM
        criteria3_7_2_documents

        WHERE session_id = $1
        `,

        [
          String(session_id)
        ]

      );


      // ======================================================
      // DELETE MAIN DATA
      // ======================================================

      await pool.query(

        `
        DELETE FROM
        criteria3_7_2_course_outcome_attainment

        WHERE session_id = $1
        `,

        [
          String(session_id)
        ]

      );


      // ======================================================
      // DELETE PHYSICAL FILES
      // ======================================================

      for (
        const file of filesResult.rows
      ) {

        if (
          !file.stored_file_name
        ) {

          continue;

        }


        const fullFilePath =
          path.join(

            criteria372UploadFolder,

            file.stored_file_name

          );


        if (
          fs.existsSync(
            fullFilePath
          )
        ) {

          try {

            fs.unlinkSync(
              fullFilePath
            );

          } catch (fileError) {

            console.error(
              "PHYSICAL FILE DELETE ERROR:",
              fileError
            );

          }

        }

      }


      return res.status(200).json({

        success: true,

        message:
          "Criteria 3.7.2 complete data deleted successfully.",

      });


    } catch (error) {

      console.error(
        "CRITERIA 3.7.2 DELETE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to delete Criteria 3.7.2 data.",

        error:
          error.message,

      });

    }

  }
);


// ============================================================
// END CRITERIA 3.7.2
// ============================================================


/* =========================================================
   START SERVER
========================================================= */

const startServer = async () => {

  try {

   

    app.listen(
      5000,
      () => {

        console.log(
          "🚀 Server running on port 5000"
        );

      }
    );

  } catch (error) {

    console.error(
      "❌ Server startup error:",
      error
    );

    process.exit(1);

  }

};

startServer();