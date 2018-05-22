"use strict";

const express = require("express");
const jwt = require("jsonwebtoken")

const secret = require("./secret");
const { hashPassword, comparePasswords } = require("./password-utils");

const router = express.Router();

router.post("/signup", (req, res) => {
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

router.post("/login", (req, res) => {
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

router.get("/auth", (req, res) => {
  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];
  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      return res.sendStatus(403);
    }

    res.json(authData);
  });
});

module.exports = router;
