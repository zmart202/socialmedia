"use strict";

const express = require("express");
const jsonParser = require("body-parser").json();

const app = express();

app.listen(4567, () => console.log("Listening on port 4567..."));
