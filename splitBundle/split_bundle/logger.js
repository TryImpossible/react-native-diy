const colors = require('colors');

const logger = {
  info() {
    const messages = Array.prototype.slice.apply(arguments).toString();
    console.log(colors.green(messages));
  },
  warn() {
    const messages = Array.prototype.slice.apply(arguments).toString();
    console.log(colors.yellow(messages));
  },
  error() {
    const messages = Array.prototype.slice.apply(arguments).toString();
    console.log(colors.red(messages));
  },
};

module.exports = logger;
