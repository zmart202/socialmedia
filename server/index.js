"use strict";

const express = require("express");
const jsonParser = require("body-parser").json();
const MongoClient = require("mongodb").MongoClient;
const path = require("path");
require("dotenv").config();

const company = require("./company");
const job = require("./job");
const applicant = require("./applicant");

const mongoUrl = process.env.MONGO_URL;

const app = express();

MongoClient.connect(
  mongoUrl,
  { useNewUrlParser: true }
)
  .then(db => {
    app.locals.db = db.db("test");
  })
  .catch(err => console.error(err));

app.listen(process.env.PORT || 4567, () =>
  console.log("Listening on port 4567...")
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(jsonParser);

app.use("/api/company", company);
app.use("/api/job", job);
app.use("/api/applicant", applicant);

app.use(express.static(path.join(__dirname, "../build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
