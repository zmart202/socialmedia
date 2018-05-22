"use strict";

const bcrypt = require("bcrypt");

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    })
  });
}

function comparePasswords(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, success) => {
      if (err) reject(`Error comparing passwords: ${err}`);

      if (!success) {
        reject("Password does not match our records");
      }

      resolve(success);
    })
  });
}

module.exports = {
  hashPassword,
  comparePasswords
};
