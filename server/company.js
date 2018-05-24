"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

const secret = require("./secret");
const { hashPassword, comparePasswords } = require("./password-utils");

const router = express.Router();

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
  const user = req.body;

  Companies.findOne({
    email: user.email,
  }).then(company => {
    if (!company) {
      return res.sendStatus(403);
    }

    comparePasswords(user.password, company.password)
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

router.post("/create-applicant", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { firstName, lastName, email, password } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    hashPassword(password).then(hash => {
      const applicant = {
        firstName,
        lastName,
        email,
        password: hash,
        id: shortid.generate()
      };

      Applicants.insertOne(applicant).then(success => {
        if (!success) {
          return res.json({
            success: false,
            msg: "Could not create applicant"
          });
        }

        res.json({
          success: true,
          applicant: {
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            email: applicant.email,
            id: applicant.id
          }
        });
      }).catch(err => console.error(err));
    }).catch(err => console.error(err));
  });
});

router.post("/edit-applicant", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { firstName, lastName, email, id } = req.body;

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

module.exports = router;
