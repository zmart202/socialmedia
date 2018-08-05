"use strict";

const express = require("express");
const hat = require("hat");
const { omit } = require("ramda");

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
  const {
    companyId,
    companyName,
    jobId,
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    phone,
    email,
    workExperience,
    education,
    coverLetter,
    salaryRequirements,
    over18,
    legal
  } = req.body;

  const applicantId = hat();

  let test;
  Jobs.findOne({ companyId, id: jobId })
  .then(job => {
    if (!job) {
      throw new Error(`Could not find Job under jobId ${jobId} and companyId ${companyId}`);
    }

    test = job.test;

    return Applicants.insertOne({
      companyId,
      companyName,
      jobId,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      workExperience,
      education,
      coverLetter,
      salaryRequirements,
      over18,
      legal,
      test,
      id: applicantId,
      completed: false,
      timestamp: new Date(),
      testTimestamp: null,
      secondsElapsed: 0,
      answers: null
    });
  }).then(result => {
    if (result.insertedCount === 0) {
      throw new Error("Could not insert applicant");
    }

    res.json({
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
        return res.json({
          success: true,
          completed: true
        });
      }

      res.json({
        success: true,
        ...omit(["_id"], applicant)
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
  ).then(result => {
    if (result.matchedCount === 0 || result.modifiedCount === 0) {
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
