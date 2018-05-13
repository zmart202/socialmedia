"use strict";

const express = require("express");
const jsonParser = require("body-parser").json();
const MongoClient = require("mongodb").MongoClient;

const mongoUrl = require("./mongo-url");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

MongoClient.connect(mongoUrl)
.then(db => {
  app.locals.db = db.db("test");
}).catch(err => console.error(err));

app.listen(4567, () => console.log("Listening on port 4567..."));

app.post("/signup/company", jsonParser, (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { name, email, password } = req.params;

  Companies.insertOne({ name, email, password })
  .then(success => {
    if (!success) {
      res.json({
        success: false,
        msg: "Signup failed"
      });
      return;
    }

    res.json({ success: true });
  }).catch(err => console.error(err));
});

app.post("/login/company", jsonParser, (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { email, password } = req.body;

  Companies.findOne({ email, password })
  .then(success => {
    if (!success) {
      res.json({
        success: false,
        msg: "Login failed"
      });
      return;
    }

    res.json({ success: true });
  }).catch(err => console.log(err));
});
