/* eslint-disable no-console */
const colors = require('colors');

const logger = {
  info(msg) {
    console.log(colors.green(msg));
  },
  warn(msg) {
    console.log(colors.yellow(msg));
  },
  error(msg) {
    console.log(colors.red(msg));
  }
};

module.exports = logger;
