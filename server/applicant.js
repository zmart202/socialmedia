"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const hat = require('hat');

const { hashPassword, comparePasswords } = require("./password-utils");

const secret = process.env.SECRET;

const router = express.Router();

router.post("/application", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const Jobs = db.collection("jobs");
  const { companyId, jobId } = req.body;
  const applicantId = hat();

  Jobs.findOne({ companyId, id: jobId })
  .then(job => {
    if (!job) {
      return res.json({
        success: false,
        msg: `Could not find Job under jobId ${jobId} and companyId ${companyId}`
      });
    }

    Applicants.insertOne({
      ...req.body,
      test: job.test,
      id: applicantId,
      completed: false,
      timestamp: new Date(),
      testTimestamp: null,
      secondsElapsed: 0,
      answers: null
    }).then((applicant) => {
      if (!applicant) {
        return res.json({
          success: false,
          msg: 'Could not insert Applicant'
        });
      }

      res.json({
        ...req.body,
        applicantId,
        test: job.test,
        success: true
      });
    }).catch((err) => {
      res.json({
        success: false,
        msg: 'Server error'
      });
      console.error(err);
    });
  }).catch(err => {
    res.json({
      success: false,
      msg: "Server error"
    });
    console.error(err);
  });
});

router.get("/auth/:id", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { id } = req.params;

  Applicants.findOne({ id })
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

router.get("/test-timestamp/:id", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { id } = req.params;

  Applicants.updateOne(
    { id },
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

router.post("/test-results/:id", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { id } = req.params;
  const { applicantId, secondsElapsed, answerData } = req.body;

  Applicants.updateOne(
    { id },
    {
      $set: {
        secondsElapsed,
        answerData,
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
