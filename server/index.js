"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const jsonParser = require("body-parser").json();
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

const mongoUrl = require("./mongo-url");
const secret = require("./secret");
const { hashPassword, comparePasswords } = require("./password-utils");

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
  const { name, email, password } = req.body;

  hashPassword(password).then(hash => {
    Companies.insertOne({
      name,
      email,
      password: hash
    }).then(success => {
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
});

app.post("/login/company", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const user = req.body;

  Companies.findOne({
    email: user.email,
  }).then(company => {
    if (!company) {
      return res.sendStatus(403);
    }

    comparePasswords(user.password, company.password)
    .then(success => {
      if (!success) {
        res.sendStatus(403);
        return;
      }

      jwt.sign({
        email: company.email,
        name: company.name
      }, secret, (err, token) => {
        res.json({ token });
      });
    }).catch(err => console.error(err));


  }).catch(err => {
    res.sendStatus(403);
    console.error(err);
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
