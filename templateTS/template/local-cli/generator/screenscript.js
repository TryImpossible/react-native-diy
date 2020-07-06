const fs = require('fs');
const path = require('path');
const logger = require('../logger');
const { ACTION } = require('./const');
const utils = require('./utils');

const SCREEN_TEMPLATE_DIR_PATH = path.join(__dirname, 'screen.template');
const SCREEN_DIR_PATH = path.resolve(__dirname, '../../src/screens');

function add(name) {
  function execute(sourceDirPath, destDirPath, target) {
    if (!fs.existsSync(destDirPath)) {
      fs.mkdirSync(destDirPath);

      const reg = new RegExp(target, 'g');

      let template = fs.readFileSync(path.join(sourceDirPath, `${target}.js`)).toString();
      template = template.replace(reg, name);
      fs.writeFileSync(path.join(destDirPath, `${name}.js`), template);

      template = fs.readFileSync(path.join(sourceDirPath, 'index.js')).toString();
      template = template.replace(reg, name);
      fs.writeFileSync(path.join(destDirPath, 'index.js'), template);
    } else {
      logger.warn(`${destDirPath} already exist，check it please`);
      process.exit();
    }
  }

  execute(SCREEN_TEMPLATE_DIR_PATH, path.join(SCREEN_DIR_PATH, name), 'ScreenTemplate');
}

function remove(name) {
  function execute(destDirPath) {
    if (fs.existsSync(destDirPath)) {
      if (fs.statSync(destDirPath).isDirectory()) {
        const files = fs.readdirSync(destDirPath);
        files.forEach(element => {
          const p = path.join(destDirPath, element);
          execute(p);
        });
        fs.rmdirSync(destDirPath);
      } else {
        fs.unlinkSync(destDirPath);
      }
    } else {
      logger.warn(`${destDirPath} does not exist, check it please`);
      process.exit();
    }
  }

  execute(path.join(SCREEN_DIR_PATH, name));
}

function rebuildExport() {
  function execute(destDirPath) {
    if (fs.existsSync(destDirPath)) {
      if (fs.statSync(destDirPath).isDirectory()) {
        utils.rewriteExport(destDirPath);
      } else {
        logger.error('file structure is wrong');
      }
    } else {
      logger.warn(`${destDirPath} does not exist, check it please`);
    }
  }

  execute(SCREEN_DIR_PATH);
}

(async function main() {
  // const command = process.argv.slice(2);
  // if (command.length !== 2) {
  //   logger.error('command input error! \nexmaple: yarn g screen AppBar add');
  //   process.exit();
  // }
  // const [action, name] = command;

  const action = await utils.input('choose your screen action, add or remove ?\n');
  const name = await utils.input('input your screen name ?\n', true);
  if (!Object.values(ACTION).includes(action)) {
    logger.error(`${action} is illegal action`);
    process.exit();
  }
  try {
    if (action === ACTION.ADD) {
      add(name);
    } else if (action === ACTION.REMOVE) {
      remove(name);
    }
    rebuildExport();
    logger.info(`${action} ${name} successfully`);
  } catch (error) {
    logger.info(`${action} ${name} failure`);
    process.exit();
  }
})();
