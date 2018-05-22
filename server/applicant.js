"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");

const secret = require("./secret");
const { hashPassword, comparePasswords } = require("./password-utils");

const router = express.Router();

router.post("/signup", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { name, email, password } = req.body;

  hashPassword(password).then(hash => {
    Applicants.insertOne({
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

      jwt.sign({
        email,
        name
      }, secret, (err, token) => {
        if (err) {
          console.error(err);
          return res.sendStatus(403);
        }

        res.json({ token });
      });
    }).catch(err => console.error(err));
  }).catch(err => console.error(err));
});

router.post("/login", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { email, password } = req.body;

  Applicants.findOne({
    email
  }).then(applicant => {
    if (!applicant) {
      return res.sendStatus(403);
    }

    comparePasswords(password, applicant.password)
    .then(success => {
      if (!success) {
        return res.sendStatus(403);
      }

      jwt.sign({
        email: applicant.email,
        name: applicant.name
      }, secret, (err, token) => {
        if (err) {
          console.error(err);
          res.sendStatus(403);
        }

        res.json({ token });
      });
    }).catch(err => console.error(err));
  }).catch(err => console.error(err));
});

router.get("/auth", (req, res) => {
  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];
  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    res.json(authData);
  });
});

module.exports = router;
