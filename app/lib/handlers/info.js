"use strict";

const showInfo = (res, config) =>
  res.json({ version: config.artifactId });

module.exports = showInfo;
