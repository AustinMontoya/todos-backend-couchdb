"use strict";

const utils = require('../utils');

const showInfo = (res, config) =>
  res.json({ version: config.artifactId });

module.exports = showInfo;
