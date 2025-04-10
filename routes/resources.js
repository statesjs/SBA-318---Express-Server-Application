const express = require("express");
const fs = require("fs");
const path = require("path");
const error = require("../utilities/error");
const router = express.Router();
const dataPath = path.join(__dirname, "../data/resources.json");

// helper functions
function getData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// GET all resources
router.get("/", (req, res) => {
  const data = getData();
  const authorId = req.query.authorId;
  let result = data;
  if (authorId) {
    result = result.filter((item) => item.authorId == authorId);
  }
  //maybe add query params for public vs
  res.json(result);
});

// GET one resource by ID
router.get("/:id", (req, res, next) => {
  const data = getData();
  const found = data.find((item) => item.id == req.params.id);

  if (!found) {
    return next(error(404, "Resource not found"));
  }
  res.json(found);
});
// POST new resource
router.post("/", (req, res, next) => {
  const data = getData();
  const { title, description } = req.body;
  if (title && description) {
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
router.patch("/:id", (req, res, next) => {
  const data = getData();
  const resource = data.find((item) => item.id == req.params.id);

  if (!resource) {
    return next(error(404, "Resource not found"));
  }
  Object.assign(resource, req.body);
  saveData(data);
  res.json(resource);
});

// DELETE resource by ID
router.delete("/:id", (req, res, next) => {
  let data = getData();
  const exists = data.some((item) => item.id == req.params.id);

  if (!exists) {
    return next(error(404, "Resource not found"));
  }
  data = data.filter((item) => item.id != req.params.id);
  saveData(data);
  res.status(204).send();
});

module.exports = router;
