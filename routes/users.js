// routes/users.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const error = require("../utilities/error");
const Joi = require("joi");
const router = express.Router();
const dataPath = path.join(__dirname, "../data/users.json");

function getData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

const postSchema = Joi.object({
  username: Joi.string().required().min(5).max(15),
  email: Joi.string().email(), //built in method to validate email
});

// GET all users
router.get("/", (req, res) => {
  const users = getData();
  res.json(users);
});

// GET one user by ID
router.get("/:id", (req, res, next) => {
  const users = getData();
  const user = users.find((u) => u.id == req.params.id);
  if (!user) {
    return next(error(404, "User not found"));
  }
  res.json(user);
});

// POST create new user
router.post("/", (req, res, next) => {
  const users = getData();
  //Joi schema applied here
  const { error: validationError } = postSchema.validate(req.body, {
    abortEarly: false,
  }); //abort early allows all validation error details to be checked before it fails

  if (validationError) {
    return next(error(400, validationError.details[0].message));
  }

  const newUser = {
    id: users[users.length - 1].id + 1,
    username: req.body.username,
    email: req.body.email,
  };

  users.push(newUser);
  saveData(users);
  res.status(201).json(newUser);
});

// PATCH update user
router.patch("/:id", (req, res, next) => {
  const users = getData();
  const user = users.find((u) => u.id == req.params.id);
  if (!user) {
    return next(error(404, "User not found"));
  }
  Object.assign(user, req.body);
  saveData(users);
  res.json(user);
});

// DELETE user
router.delete("/:id", (req, res, next) => {
  let users = getData();
  const exists = users.some((u) => u.id == req.params.id);
  if (!exists) {
    return next(error(404, "User not found"));
  }
  users = users.filter((u) => u.id != req.params.id);
  saveData(users);
  res.status(204).send();
});

module.exports = router;
