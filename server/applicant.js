"use strict";

const express = require("express");
const hat = require("hat");
const { omit } = require("ramda");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
// const router = require('express').Router();

// const applicationHelper = require("./applicationHelper.js");

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
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err.message
      });
      console.error(err);
    });
});

// router.use("/application", applicationHelper);

// export const handleApplication = async () => router.post("/application", re);

router.post("/application", (req, res) => {
  // console.log("Here");
  const db = req.app.locals.db;
  // console.log("Here2");
  const Applicants = db.collection("applicants");
  // console.log("Here3");
  const Jobs = db.collection("jobs");

  const { companyId, jobId } = req.body;
  const applicantId = hat();

  let test;
  Jobs.findOne({ companyId, id: jobId })
    .then(job => {
      if (!job) {
        throw new Error(
          `Could not find Job under jobId ${jobId} and companyId ${companyId}`
        );
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
    })
    .then(result => {
      if (result.insertedCount === 0) {
        throw new Error("Could not insert applicant");
      }

      res.json({
        ...req.body,
        applicantId,
        test,
        success: true
      });
    })
    .catch(err => {
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
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err.message
      });
      console.error(err);
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
  )
    .then(result => {
      if (result.matchedCount === 0 || result.modifiedCount === 0) {
        throw new Error(`Could not update applicant with id ${id}`);
      }

      return res.json({ success: true });
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err.message
      });
      console.error(err);
    });
});

router.post("/test-results/:id", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const CompanyUsers = db.collection("companyUsers");

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
  )
    .then(success => {
      if (!success) {
        throw new Error(`Could not update applicant with id ${id}`);
      }

      res.json({ success: true });

      return Applicants.findOne({ id });
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err.message
      });
      console.error(err);
    });

  let applicant;
  let user_id;
  Applicants.findOne({ id })
    .then(result => {
      user_id = result.id;
      if (!result) {
        throw new Error(`Could not find applicant with id ${id}`);
      }

      applicant = result;
      return CompanyUsers.find({
        companyId: applicant.companyId
      }).toArray();
    })
    .then(companyUsers => {
      if (companyUsers.length === 0) {
        throw new Error(
          `Could not find any companyUsers with companyId ${
            applicant.companyId
          }`
        );
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      return Promise.all(
        companyUsers.map(x =>
          sgMail.send({
            to: x.email,
            from: "itsdecisiontyme@gmail.com",
            subject: `A New Applicant Has Applied!!`,
            html: `<h1>You have received a new applicant</h1><div><a href='http://localhost:3000/company/results/${user_id}'>Click here</a> to check them out!</div>`
          })
        )
      );
    })
    .then(() => {
      console.log("Email has been sent!!");
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;
