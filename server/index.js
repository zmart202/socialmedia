"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const jsonParser = require("body-parser").json();
const MongoClient = require("mongodb").MongoClient;

const mongoUrl = require("./mongo-url");
const secret = require("./secret");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(jsonParser);

MongoClient.connect(mongoUrl)
.then(db => {
  app.locals.db = db.db("test");
}).catch(err => console.error(err));

app.listen(4567, () => console.log("Listening on port 4567..."));

app.post("/signup/company", (req, res) => {
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

app.post("/login/company", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const user = req.body;

  Companies.findOne({
    email: user.email,
    password: user.password
  }).then(success => {
    if (!success) {
      return res.sendStatus(403);
    }
    jwt.sign({ user }, secret, (err, token) => {
      res.json({ token });
    });
  }).catch(err => {
    res.sendStatus(403);
    console.log(err);
  });
});

app.get("/company", (req, res) => {
  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];
  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      return res.sendStatus(403);
    }

    res.json(authData);
  });
});
