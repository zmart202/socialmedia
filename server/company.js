"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const uniqid = require("uniqid");

const { hashPassword, comparePasswords } = require("./password-utils");

const secret = process.env.SECRET;

const router = express.Router();

router.post("/create-company", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { name } = req.body;

  Companies.insertOne({
    name,
    id: uniqid()
  }).then(success => {
    if (!success) {
      return res.json({ success: false });
    }

    res.json({ success: true });
  }).catch(err => console.error(err));
});

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

      jwt.sign({
        email,
        name
      }, secret, (err, token) => {
        res.json({ token });
      });
    }).catch(err => console.error(err));
  }).catch(err => console.error(err));
});

router.post("/login", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { email, password } = req.body;

  Companies.findOne({
    email
  }).then(company => {
    if (!company) {
      return res.sendStatus(403);
    }

    comparePasswords(password, company.password)
    .then(success => {
      if (!success) {
        return res.sendStatus(403);
      }

      jwt.sign({
        email: company.email,
        name: company.name
      }, secret, (err, token) => {
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

router.get("/applicants", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Applicants.find().toArray()
    .then(data => {
      if (!data) {
        return res.json([]);
      }

      return res.json(data);
    }).catch(err => console.error(err));
  });
});

router.post("/create-applicant", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { firstName, lastName, email, token } = req.body;

  const bearer = req.headers["authorization"];
  const _token = bearer.split(" ")[1];

  jwt.verify(_token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    const id = shortid.generate();

    Applicants.insertOne({
      id,
      firstName,
      lastName,
      email,
      token,
      completed: false,
      timestamp: new Date(),
      testTimestamp: null,
      results: []
    }).then(success => {
      if (!success) {
        return res.json({
          success: false,
          msg: "Could not create applicant"
        });
      }

      res.json({
        success: true,
        createdApplicant: {
          id,
          firstName,
          lastName,
          email,
          token
        }
      });
    }).catch(err => console.error(err));
  });
});

router.post("/edit-applicant", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { id, firstName, lastName, email } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Applicants.updateOne(
      { id },
      {
        $set: {
          firstName,
          lastName,
          email
        }
      }
    ).then(success => {
      if (!success) {
        return res.json({
          success: false,
          msg: "Could not update applicant"
        });
      }

      res.json({ success: true });
    }).catch(err => console.error(err));
  });
});

router.post("/remove-applicant", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { email, id } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Applicants.removeOne({ email, id })
    .then(success => {
      if (!success) {
        return res.json({ success: false });
      }

      res.json({ success: true });
    }).catch(err => console.error(err));
  });
});

router.get("/test-results/:applicantId", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { applicantId } = req.params;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Applicants.findOne({ id: applicantId })
    .then(doc => {
      if (!doc) {
        return res.json([]);
      }

      res.json({
        results: doc.results,
        secondsElapsed: doc.secondsElapsed,
        firstName: doc.firstName,
        lastName: doc.lastName,
        id: doc.id
      });
    }).catch(err => console.error(err));
  });
});

module.exports = router;
