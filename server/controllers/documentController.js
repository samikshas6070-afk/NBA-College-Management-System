const pool = require("../db");

// Get Documents
const getCriteriaDocuments = async (req, res) => {
  try {
    const { criteriaNo } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM criteria_documents
       WHERE criteria_no = $1
       ORDER BY id`,
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
};


// Upload Document
const uploadDocument = async (req, res) => {

  try {

    const { criteriaNo, documentName } = req.body;

    const fileName = req.file.filename;
    const filePath = req.file.path;

    const result = await pool.query(
      `UPDATE criteria_documents
       SET
          file_name = $1,
          file_path = $2
       WHERE
          criteria_no = $3
          AND document_name = $4
       RETURNING *`,
      [
        fileName,
        filePath,
        criteriaNo,
        documentName
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
};


// Delete File
const deleteDocument = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      `UPDATE criteria_documents
       SET
          file_name = NULL,
          file_path = NULL
       WHERE id = $1`,
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
};

module.exports = {
  getCriteriaDocuments,
  uploadDocument,
  deleteDocument
};