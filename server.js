const Joi = require("joi");
const express = require("express");
const app = express();

//middleware that parses json objects
app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

//base url
app.get("/", (req, res) => {
  res.send("ping");
});
//get the entire courses array
app.get("/api/courses", (req, res) => {
  res.send(courses);
});
//endpoint for finding specific object/course
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("Id doesn't match any courses");
  } else {
    res.send(course);
  }
});

//post method
app.post("/api/courses", (req, res) => {
  const schema = {
    name: Joi.string().min().required(),
  };
  const result = Joi.validate(req.body, schema);
  console.log(result);
  if (!req.body.name || req.body.name.length < 3) {
    res.status(400).send("Course name is too short/ was empty...");
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port);

//A full representation of using Joi
// const Joi = require('joi');

// const signupSchema = Joi.object({
//   username: Joi.string().min(3).required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(8).required(),
// });

// app.post('/signup', (req, res) => {
//   const { error } = signupSchema.validate(req.body);

//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }

//   // Safe to proceed — data is clean
// });
