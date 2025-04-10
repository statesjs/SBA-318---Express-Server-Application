// routes/comments.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const error = require("../utilities/error");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/comments.json");

// Utility functions
function getData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// GET all comments
router.get("/", (req, res) => {
  const comments = getData();
  res.json(comments);
});

// GET comment by ID
router.get("/:id", (req, res, next) => {
  const comments = getData();
  const comment = comments.find((c) => c.id == req.params.id);
  if (!comment) return next(error(404, "Comment not found"));
  res.json(comment);
});

// POST new comment
router.post("/", (req, res, next) => {
  const comments = getData();
  const { content, userId, resourceId } = req.body;

  if (typeof content !== "string" || !userId || !resourceId) {
    return next(error(400, "Invalid input"));
  }

  const newComment = {
    id: comments.length ? comments[comments.length - 1].id + 1 : 1,
    content,
    userId,
    resourceId,
    timestamp: new Date().toISOString(),
  };

  comments.push(newComment);
  saveData(comments);
  res.status(201).json(newComment);
});

// PATCH update comment
router.patch("/:id", (req, res, next) => {
  const comments = getData();
  const comment = comments.find((c) => c.id == req.params.id);
  if (!comment) return next(error(404, "Comment not found"));

  Object.assign(comment, req.body);
  saveData(comments);
  res.json(comment);
});

// DELETE comment
router.delete("/:id", (req, res, next) => {
  let comments = getData();
  const exists = comments.some((c) => c.id == req.params.id);
  if (!exists) return next(error(404, "Comment not found"));

  comments = comments.filter((c) => c.id != req.params.id);
  saveData(comments);
  res.status(204).send();
});

module.exports = router;
