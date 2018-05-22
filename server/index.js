"use strict";

const express = require("express");;
const jsonParser = require("body-parser").json();
const MongoClient = require("mongodb").MongoClient;

const mongoUrl = require("./mongo-url");

const company = require("./company");
const applicant = require("./applicant");

const app = express();

MongoClient.connect(mongoUrl)
.then(db => {
  app.locals.db = db.db("test");
}).catch(err => console.error(err));

app.listen(4567, () => console.log("Listening on port 4567..."));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(jsonParser);

app.use("/company", company);
app.use("/applicant", applicant);
