const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const {
  getCriteriaDocuments,
  uploadDocument,
  deleteDocument
} = require("../controllers/documentController");


// Multer Configuration
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }

});

const upload = multer({ storage });


// Routes

router.get(
  "/criteria/:criteriaNo",
  getCriteriaDocuments
);

router.post(
  "/criteria/upload",
  upload.single("file"),
  uploadDocument
);

router.delete(
  "/criteria/:id",
  deleteDocument
);

module.exports = router;