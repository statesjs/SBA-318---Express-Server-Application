const Joi = require("joi");
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
//Joi schema for posting a resource, applied on line 50 with regex pattern too on line 20
//JOI POST SCHEMA
const postSchema = Joi.object({
  title: Joi.string()
    .pattern(/^.{3,10}$/) //title must be at least 3 characters and a max of 10 characters, any character can be used
    .required(),
  description: Joi.string().min(5).max(100).required(),
  authorId: Joi.number().integer().min(1).required(),
});
//JOI PATCH SCHEMA
const patchSchema = Joi.object({
  title: Joi.string().pattern(/^.{3,10}$/),
  description: Joi.string().min(5).max(100),
  authorId: Joi.number().integer().min(1),
}).min(1); //  minimum of one key being updated, no limit

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
  //Joi schema applied here
  const { error: validationError } = postSchema.validate(req.body, {
    abortEarly: false,
  }); //abort early allows all validation error details to be checked before it fails

  if (validationError) {
    return next(error(400, validationError.details[0].message));
  }

  const newResource = {
    id: data[data.length - 1].id + 1,
    ...req.body,
  };
  data.push(newResource);
  saveData(data);
  res.status(201).json(newResource);
});

// PATCH update resource by ID
router.patch("/:id", (req, res, next) => {
  const data = getData();
  const resource = data.find((item) => item.id == req.params.id);

  if (!resource) {
    return next(error(404, "Resource not found"));
  }

  const { error: patchError } = patchSchema.validate(req.body);
  if (patchError) {
    return next(error(400, patchError.details[0].message));
  }

  Object.assign(resource, req.body);
  saveData(data);
  res.json(resource);
});

// DELETE resource by ID
//should implement new datapath to delete comments related to post as well...
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
