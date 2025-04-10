const Joi = require("joi");
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

//import middleware
const logger = require("./middleware/logger");
const error = require("./middleware/errorHandler");

//middleware that parses json objects
app.use(express.json());
app.use(logger); //  custom middleware
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static(path.join(__dirname, "public"))); // static CSS/images

// importing routes
const resourceRoutes = require("./routes/resources");

//applying routes
app.use("/resources", resourceRoutes);

// ejs view Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//base url
app.get("/", (req, res) => {
  res.send("You're live");
});

//error 500 middleware
app.use(error);
const PORT = process.env.PORT || 3000;
app.listen(PORT);
