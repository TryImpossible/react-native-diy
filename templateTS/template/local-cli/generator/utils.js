const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const logger = require('../logger');

function beautify(filepath) {
  const binpath = path.resolve(__dirname, '../../node_modules/.bin');
  execSync(`${binpath}/eslint ${filepath} --fix `).toString();
  execSync(`${binpath}/prettier --write ${filepath}`);
}

function undo(filepath) {
  function del(destpath) {
    if (fs.statSync(destpath).isDirectory()) {
      const files = fs.readdirSync(destpath);
      files.forEach((file) => {
        const p = path.join(destpath, file);
        del(p);
      });
      fs.rmdirSync(destpath);
    } else {
      fs.unlinkSync(destpath);
    }
  }
  if (fs.existsSync(filepath)) {
    logger.info(`--- start undo: ${filepath} ---`);
    del(filepath);
    logger.info(`--- end undo: ${filepath} ---`);
  }
}

const needFilterFiles = ['index.js', '.DS_Store'];

function rewriteExport(dirpath) {
  const importArr = [];
  const exportArr = [];
  const files = fs.readdirSync(dirpath);
  files.forEach((file) => {
    if (!needFilterFiles.includes(file)) {
      const p = path.join(dirpath, file);
      let name;
      if (fs.statSync(p).isDirectory()) {
        name = p.substr(p.lastIndexOf('/') + 1);
      } else {
        name = p.substring(p.lastIndexOf('/') + 1, p.lastIndexOf('.'));
      }
      importArr.push(`import ${name} from './${name}';`);
      exportArr.push(name);
    }
  });
  const content = `${importArr.join('\n')}\n\nexport { ${exportArr.join(', ')} };`;
  const writePath = path.join(dirpath, 'index.js');
  fs.writeFileSync(writePath, content);
  beautify(writePath);
}

let rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function input(question, isClose = false) {
  if (!rl) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  }
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (isClose) {
        rl.close();
      }
      resolve(answer.trim());
    });
  });
}

module.exports = {
  beautify,
  undo,
  rewriteExport,
  input,
};
