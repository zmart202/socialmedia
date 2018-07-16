"use strict";

const express = require("express");
const hat = require("hat");

const { hashPassword, comparePasswords } = require("./promisified-utils");

const secret = process.env.SECRET;

const router = express.Router();

router.get("/applicant/:id", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { id } = req.params;

  Applicants.findOne({ id })
  .then(applicant => {
    if (!applicant) {
      throw new Error(`Could not find applicant with id ${id}`);
    }

    res.json({
      success: true,
      ...applicant
    });
  }).catch(err => {
    res.json({
      success: false,
      msg: err.message
    });
    console.error(err);
  });
});

router.post("/application", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const Jobs = db.collection("jobs");
  const { companyId, jobId } = req.body;
  const applicantId = hat();

  let test;
  Jobs.findOne({ companyId, id: jobId })
  .then(job => {
    if (!job) {
      throw new Error(`Could not find Job under jobId ${jobId} and companyId ${companyId}`);
    }

    test = job.test;

    return Applicants.insertOne({
      ...req.body,
      test,
      id: applicantId,
      completed: false,
      timestamp: new Date(),
      testTimestamp: null,
      secondsElapsed: 0,
      answers: null
    });
  }).then(applicant => {
    if (!applicant) {
      throw new Error("Could not insert applicant");
    }

    res.json({
      ...req.body,
      applicantId,
      test,
      success: true
    });
  }).catch(err => {
    res.json({
      success: false,
      msg: err.message
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
        throw new Error(`Could not find applicant with id ${id}`);
      }

      if (applicant.completed) {
        return res.json({ completed: true });
      }

      res.json({
        success: true,
        id: applicant.id,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        companyId: applicant.companyId,
        test: applicant.test,
        completed: applicant.completed,
        testTimestamp: applicant.testTimestamp
      });
    }).catch(err => {
      res.json({
        success: false,
        msg: err.message
      });
      console.error(err)
    });
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
      throw new Error(`Could not update applicant with id ${id}`);
    }

    return res.json({ success: true });
  }).catch(err => {
    res.json({
      success: false,
      msg: err.message
    });
    console.error(err)
  });
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
      throw new Error(`Could not update applicant with id ${id}`);
    }

    res.json({ success: true });
  }).catch(err => {
    res.json({
      success: false,
      msg: err.message
    });
    console.error(err);
  });
});

module.exports = router;
