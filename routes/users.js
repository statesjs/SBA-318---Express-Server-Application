// routes/users.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/users.json");

// helper functions , make sure to just import this instead
function getData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// GET all users
router.get("/", (req, res) => {
  const users = getData();
  res.json(users);
});

// GET one user by ID
router.get("/:id", (req, res) => {
  const users = getData();
  const user = users.find((u) => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST create new user
router.post("/", (req, res) => {
  const users = getData();
  const { username, email } = req.body;

  if (typeof username !== "string" || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid input types" });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    email,
  };

  users.push(newUser);
  saveData(users);
  res.status(201).json(newUser);
});

// PATCH update user
router.patch("/:id", (req, res) => {
  const users = getData();
  const user = users.find((u) => u.id == req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  Object.assign(user, req.body);
  saveData(users);
  res.json(user);
});

// DELETE user
router.delete("/:id", (req, res) => {
  let users = getData();
  const exists = users.some((u) => u.id == req.params.id);
  if (!exists) {
    return res.status(404).json({ error: "User not found" });
  }
  users = users.filter((u) => u.id != req.params.id);
  saveData(users);
  res.status(204).send();
});

module.exports = router;
