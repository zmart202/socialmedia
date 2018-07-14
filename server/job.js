"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const hat = require("hat");
const _ = require("lodash");

const secret = process.env.SECRET;

const router = express.Router();

router.get("/jobs", (req, res) => {
  const db = req.app.locals.db;
  const Jobs = db.collection("jobs");

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Jobs.find({ companyId: authData.companyId })
    .toArray().then(jobs => {
      if (!jobs) {
        return res.json({
          success: false,
          msg: `Could not find any jobs under companyId ${authData.companyId}`
        });
      }

      res.json({
        success: true,
        jobs: jobs.map(x => _.omit(x, "_id")),
        companyId: authData.companyId,
        companyName: authData.companyName
      });
    }).catch(err => {
      res.json({
        success: false,
        msg: "Server error"
      });
      console.error(err);
    });
  });
});

router.get("/job/:companyId/:id", (req, res) => {
  const db = req.app.locals.db;
  const Jobs = db.collection("jobs");
  const { companyId, id } = req.params;

  Jobs.findOne({ companyId, id })
  .then(job => {
    if (!job) {
      return res.json({
        success: false,
        msg: `Could not find job with id ${id} under companyId ${companyId}`
      });
    }

    res.json({
      success: true,
      job: _.omit(job, "_id")
    });
  }).catch(err => {
    res.json({
      success: false,
      msg: "Server error"
    });
    console.error(err);
  });
});

router.post("/create-job", (req, res) => {
  const db = req.app.locals.db;
  const Jobs = db.collection("jobs");
  const { id, title, description } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Jobs.insertOne({
      id,
      title,
      description,
      companyId: authData.companyId,
      companyName: authData.companyName,
      test: []
    }).then(result => {
      if (!result) {
        return res.json({
          success: false,
          msg: "Could not insert Job"
        });
      }

      res.json({ success: true });
    }).catch(err => {
      res.json({
        success: false,
        msg: "Server error"
      });
      console.error(err);
    });
  });
});

router.post("/edit-job", (req, res) => {
  const db = req.app.locals.db;
  const Jobs = db.collection("jobs");
  const { id, title, description } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Jobs.updateOne(
      { id },
      {
        $set: {
          title,
          description
        }
      }
    ).then(result => {
      if (result.matchedCount === 0 || result.modifiedCount === 0) {
        return res.json({
          success: false,
          msg: "Could not update job title"
        });
      }

      res.json({ success: true });
    });
  });
});

router.post("/delete-job", (req, res) => {
  const db = req.app.locals.db;
  const Jobs = db.collection("jobs");
  const { id } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Jobs.findOneAndDelete({ id })
    .then(result => {
      if (result.nRemoved === 0) {
        res.json({
          success: false,
          msg: "Could not delete job"
        });
      }

      res.json({ success: true });
    }).catch(err => {
      console.error(err);
      res.json({
        success: false,
        msg: "Server error"
      });
    });
  });
});

router.post("/edit-test", (req, res) => {
  const db = req.app.locals.db;
  const Jobs = db.collection("jobs");
  const { id, test } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    Jobs.updateOne(
      { id },
      {
        $set: {
          test
        }
      }
    ).then(result => {
      if (result.matchedCount === 0 || result.modifiedCount === 0) {
        return res.json({
          success: false,
          msg: "Could not edit test"
        });
      }

      res.json({ success: true });
    }).catch(err => {
      res.json({
        success: false,
        msg: "Server error"
      });
      console.error(err);
    });
  });
});

module.exports = router;
