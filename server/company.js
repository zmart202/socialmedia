"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const hat = require("hat");

const { hashPassword, comparePasswords } = require("./password-utils");
const sample = require("./sample-test");

const secret = process.env.SECRET;

const router = express.Router();

router.post("/create-company", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { name } = req.body;

  Companies.insertOne({
    name,
    tests: [sample],
    id: hat()
  }).then(success => {
    if (!success) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      id: success.id
    });
  }).catch(err => console.error(err));
});

router.post("/signup", (req, res) => {
  const db = req.app.locals.db;
  const CompanyUsers = db.collection("companyUsers");
  const Companies = db.collection("companies");
  const { firstName, lastName, email, companyId, password } = req.body;

  Companies.findOne({ id: companyId })
  .then(success => {
    if (!success) {
      return res.json({
        success: false,
        msg: "Invalid companyId"
      });
    }

    hashPassword(password).then(hash => {
      CompanyUsers.insertOne({
        firstName,
        lastName,
        email,
        companyId,
        password: hash
      }).then(success => {
        if (!success) {
          return res.json({
            success: false,
            msg: "Signup failed"
          });
        }

        jwt.sign({
          email,
          companyId
        }, secret, (err, token) => {
          res.json({
            token,
            success: true
          });
        });
      }).catch(err => console.error(err));
    }).catch(err => console.error(err));
  }).catch(err => console.error(err));
});

router.post("/login", (req, res) => {
  const db = req.app.locals.db;
  const CompanyUsers = db.collection("companyUsers");
  const { email, password } = req.body;

  CompanyUsers.findOne({
    email
  }).then(user => {
    if (!user) {
      return res.sendStatus(403);
    }

    comparePasswords(password, user.password)
    .then(success => {
      if (!success) {
        return res.sendStatus(403);
      }

      jwt.sign({
        email: user.email,
        companyId: user.companyId
      }, secret, (err, token) => {
        res.json({
          token,
          success: true,
          companyId: user.companyId
        });
      });
    }).catch(err => res.sendStatus(403));
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

    Applicants.find({ companyId: authData.companyId })
    .toArray().then(data => {
      if (!data) {
        return res.json([]);
      }

      return res.json(data);
    }).catch(err => console.error(err));
  });
});

router.get("/tests/:companyId", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { companyId } = req.params;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Companies.findOne({ companyId })
    .then(company => {
      if (!company) {
        return res.json({
          success: false,
          msg: `Could not find company with id ${companyId}`
        });
      }

      res.json({
        tests: company.tests,
        success: true
      });
    }).catch(err => console.error(err));
  });
});

router.post("/create-applicant", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const Applicants = db.collection("applicants");
  const { firstName, lastName, email, token } = req.body;

  const bearer = req.headers["authorization"];
  const _token = bearer.split(" ")[1];

  jwt.verify(_token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Companies.findOne({ id: authData.companyId })
    .then(company => {
      if (!company) {
        return res.json({
          success: false,
          msg: "Invalid companyID"
        });
      }

      const id = shortid.generate();

      Applicants.insertOne({
        id,
        firstName,
        lastName,
        email,
        token,
        companyId: company.id,
        test: company.tests[0],
        completed: false,
        timestamp: new Date(),
        testTimestamp: null,
        secondsElapsed: 0,
        answers: null
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
        answers: doc.answers,
        secondsElapsed: doc.secondsElapsed,
        firstName: doc.firstName,
        lastName: doc.lastName,
        id: doc.id
      });
    }).catch(err => console.error(err));
  });
});

module.exports = router;
