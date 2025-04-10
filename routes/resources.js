const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/resources.json");

// helper functions
function getData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}
//add middleware
const error = require("../middleware/error");

// GET all resources
router.get("/", (req, res) => {
  const data = getData();
  //maybe add query params for public vs
  res.json(data);
});

// GET one resource by ID
router.get("/:id", (req, res) => {
  const data = getData();
  const found = data.find((item) => item.id == req.params.id);

  if (!found) {
    return next(error(404, "not found"));
  }
  res.json(found);
});
// POST new resource
router.post("/", (req, res) => {
  const data = getData();
  const { title, body } = req.body;
  if (title && body) {
    const newResource = {
      id: data[data.length - 1].id + 1,
      ...req.body,
    };
    data.push(newResource);
    saveData(data);
    res.status(201).json(newResource);
  } else {
    return next(error(400, "Missing required input"));
  }
});

// PATCH update resource by ID
router.patch("/:id", (req, res) => {
  const data = getData();
  const resource = data.find((item) => item.id == req.params.id);

  if (!resource) {
    return res.status(404).send("Resource not found");
  }
  Object.assign(resource, req.body);
  saveData(data);
  res.json(resource);
});

// DELETE resource by ID
router.delete("/:id", (req, res) => {
  let data = getData();
  const exists = data.some((item) => item.id == req.params.id);

  if (!exists) {
    return res.status(404).send("Resource not found");
  }
  data = data.filter((item) => item.id != req.params.id);
  saveData(data);
  res.status(204).send();
});

module.exports = router;
