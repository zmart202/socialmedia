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
  .then(company => {
    if (!company) {
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
        companyName: company.name,
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
          companyId,
          companyName: company.name
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
        companyName: user.companyName,
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
    .toArray().then(applicants => {
      if (!applicants) {
        return res.json({
          success: false,
          msg: `Could not find any applicants for companyId ${authData.companyId}`
        });
      }

      return res.json({
        applicants,
        success: true,
        companyName: authData.companyName
      });
    }).catch(err => console.error(err));
  });
});

router.get("/tests", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Companies.findOne({ id: authData.companyId })
    .then(company => {
      if (!company) {
        return res.json({
          success: false,
          msg: `Could not find company with id ${authData.companyId}`
        });
      }

      res.json({
        tests: company.tests,
        success: true
      });
    }).catch(err => console.error(err));
  });
});

router.post("/create-test", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { name } = req.body;
  const id = shortid.generate();

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      return res.sendStatus(403);
    }

    Companies.updateOne(
      { id: authData.companyId },
      {
        $push: {
          tests: {
            id,
            name,
            questions: []
          }
        }
      }
    ).then(success => {
      if (!success) {
        return res.json({
          success: false,
          msg: `Could not find company with id ${authData.companyId}`
        });
      }

      res.json({
          success: true,
          createdTestId: id
      });
    }).catch(err => {
      res.json({
        success: false,
        msg: "Database error"
      });
      console.error(err);
    });
  });
});

router.post("/delete-test", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { id } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Companies.findOne({ id: authData.companyId })
    .then(company => {
      if (!company) {
        res.json({
          success: false,
          msg: `Could not find company with ${authData.companyId}`
        });
      }

      Companies.updateOne(
        { id: company.id },
        {
          $set: {
            tests: company.tests.filter(x =>
              x.id !== id
            )
          }
        }
      ).then(success => {
        if (!success) {
          return res.json({
            success: false,
            msg: "Could not update on delete test"
          });
        }

        res.json({ success: true });
      }).catch(err => {
        console.error(err);
        res.json({
          success: false,
          msg: "Database error"
        });
      });
    }).catch(err => {
      console.error(err);
      res.json({
        success: false,
        msg: "Database error"
      });
    });
  });
});

router.post("/create-question", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { questionId, testId, body, type } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Companies.findOne({ id: authData.companyId })
    .then(company => {
      if (!company) {
        return res.json({
          success: false,
          msg: `Could not find company with id ${authData.companyId}`
        });
      }

      let tests = company.tests.map(x => {
        if (x.id === testId) {
          return {
            ...x,
            questions: type === "MULTIPLE_CHOICE" ?
              x.questions.concat({
                type,
                body,
                id: questionId,
                options: req.body.options
              }) : x.questions.concat({
                type,
                body,
                id: questionId
              })
          };
        }
        return x;
      });

      Companies.updateOne(
        { id: authData.companyId },
        {
          $set: {
            tests
          }
        }
      ).then(success => {
        if (!success) {
          return res.json({
            success: false,
            msg: "Could not create question in companies table"
          });
        }

        res.json({ success: true });
      }).catch(err => {
        console.error(err);
        res.json({
          success: false,
          msg: "Database error"
        });
      });
    }).catch(err => {
      console.error(err);
      res.json({
        success: false,
        msg: "Database error"
      });
    })
  });
});

router.post("/edit-question", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { body, testId, questionId, questionType } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Companies.findOne({ id: authData.companyId })
    .then(company => {
      if (!company) {
        return res.json({
          success: false,
          msg: `Could not find company with id ${authData.companyId}`
        });
      }

      const tests = company.tests.map(x => {
        if (x.id === testId) {
          return {
            ...x,
            questions: x.questions.map(y => {
              if (y.id === questionId) {
                return questionType === "MULTIPLE_CHOICE" ? {
                  ...y,
                  body,
                  options: req.body.options
                } : {
                  ...y,
                  body
                };
              }

              return y;
            })
          };
        }
        return x;
      });

      Companies.updateOne(
        { id: company.id },
        {
          $set: {
            tests
          }
        }
      ).then(success => {
        if (!success) {
          return res.json({
            success: false,
            msg: "Database error"
          });
        }

        res.json({ success: true });
      }).catch(err => {
        console.error(err);
        res.json({
          success: false,
          msg: "Database error"
        });
      });
    }).catch(err => {
      console.error(err);
      res.json({
        success: false,
        msg: "Database error"
      });
    });
  });
});

router.post("/delete-question", (req, res) => {
  const db = req.app.locals.db;
  const Companies = db.collection("companies");
  const { testId, questionId } = req.body;

  const bearer = req.headers["authorization"];
  const token = bearer.split(" ")[1];

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    Companies.findOne({ id: authData.companyId })
    .then(company => {
      if (!company) {
        return res.json({
          success: false,
          msg: `Could not find company with id ${authData.companyId}`
        });
      }

      const tests = company.tests.map(x => {
        if (x.id === testId) {
          return {
            ...x,
            questions: x.questions.filter(y => y.id !== questionId)
          };
        }
        return x;
      });

      Companies.updateOne(
        { id: company.id },
        {
          $set: {
            tests
          }
        }
      ).then(success => {
        if (!success) {
          return res.json({
            success: false,
            msg: "Could not delete question"
          });
        }

        res.json({ success: true });
      })
    }).catch(err => {
      console.error(err);
      res.json({
        success: false,
        msg: "Database error"
      });
    });
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
