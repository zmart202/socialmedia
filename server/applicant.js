"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");

const secret = require("./secret");
const { hashPassword, comparePasswords } = require("./password-utils");

const router = express.Router();

router.post("/login", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { email, password } = req.body;

  Applicants.findOne({
    email,
    password
  }).then(applicant => {
    if (!applicant) {
      return res.sendStatus(403);
    }

    jwt.sign({
      email: applicant.email,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      id: applicant.id
    }, secret[1], (err, token) => {
      if (err) {
        return console.error(err);
      }

      res.json({ token });
    });
  }).catch(err => console.error(err));
});

router.get("/auth", (req, res) => {
  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];
  if (token) {
    jwt.verify(token, secret[1], (err, authData) => {
      if (err) {
        console.error(err);
        return res.sendStatus(403);
      }

      res.json(authData);
    });
  } else {
    res.sendStatus(403);
  }
});

router.post("/test-results", (req, res) => {
  const db = req.app.locals.db;
  const TestResults = db.collection("testResults");
  const results = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret[1], (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    TestResults.insertOne({
      applicantId: authData.id,
      results
    }).then(success => {
      if (!success) {
        return res.json({ success: false });
      }

      res.json({ success: true });
    }).catch(err => console.error(err));
  });
});

module.exports = router;
