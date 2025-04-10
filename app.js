const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
// ejs view Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//import middleware
const logger = require("./utilities/logger");
const error = require("./utilities/error");

//middleware that parses json objects
app.use(express.json());
app.use(logger); //  custom middleware
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static(path.join(__dirname, "public"))); // static CSS/images

// importing routes
const resourceRoutes = require("./routes/resources");
const usersRoutes = require("./routes/users");
//applying routes
app.use("/resources", resourceRoutes);
app.use("/users", usersRoutes);
//base url
app.get("/", (req, res) => {
  res.render("index");
});

//view to sumbit new resource with form
app.get("/form", (req, res) => {
  res.render("form");
});

//error middleware
app.use(error);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
