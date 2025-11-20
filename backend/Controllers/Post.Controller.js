// Controllers/Post.Controller.js
const pool = require("../db/db.js");

const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reviews ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      success: false,
      message: "Database error",
      error: error.message
    });
  }
};

module.exports = { getAllPosts };