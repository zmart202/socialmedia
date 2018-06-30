"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");

const { hashPassword, comparePasswords } = require("./password-utils");

const secret = process.env.SECRET;

const router = express.Router();

router.get("/auth/:token", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { token } = req.params;

  Applicants.findOne({ token })
  .then(applicant => {
    if (!applicant) {
      return res.sendStatus(403);
    }

    if (applicant.completed) {
      return res.json({ completed: true });
    }

    res.json({
      id: applicant.id,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.email,
      companyId: applicant.companyId,
      test: applicant.test,
      completed: applicant.completed,
      testTimestamp: applicant.testTimestamp
    });
  }).catch(err => console.error(err));
});

router.get("/test-timestamp/:token", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { token } = req.params;

  Applicants.updateOne(
    { token },
    {
      $set: {
        testTimestamp: new Date()
      }
    }
  ).then(success => {
    if (!success) {
      return res.sendStatus(403);
    }

    return res.json({ success: true });
  }).catch(err => console.error(err));
});

router.post("/test-results/:token", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { token } = req.params;
  const { applicantId, secondsElapsed, answers } = req.body;

  Applicants.updateOne(
    { token },
    {
      $set: {
        secondsElapsed,
        answers,
        completed: true
      }
    }
  ).then(success => {
    if (!success) {
      return res.json({ success: false });
    }

    res.json({ success: true });
  }).catch(err => {
    res.json({ success: false });
    console.error(err);
  });
});

module.exports = router;
