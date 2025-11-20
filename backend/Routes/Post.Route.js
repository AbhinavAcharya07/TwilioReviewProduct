// Routes/Post.Route.js

const express = require("express");
const router = express.Router();
const {
  getAllPosts,
} = require("../Controllers/Post.Controller.js");


router.get("/getallposts", getAllPosts);


module.exports = router;