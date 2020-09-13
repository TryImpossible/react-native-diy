const path = require('path');
const fs = require('fs');
const readline = require('readline');
const childprocess = require('child_process');

const logger = require('./logger');

// moduleId的配置文件，固定文件名
const moduleIdConfigFilePath = path.join(__dirname, '/moduleIdConfig.json');

// 过滤的基准包配置文件，固定文件名
const filterConfigFilePath = path.join(__dirname, './filterConfig.json');

// 打包入口配置文件，固定文件名
const entryConfigFilePath = path.join(__dirname, './entryConfig.json');

/**
 * 终端输入
 * @param {*} prompt 提示
 * @param {*} isAutoClose 是否自动关闭
 */
function input(prompt, isAutoClose = true) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    const ask = () => {
      rl.question(prompt, answer => {
        if (isAutoClose || answer) {
          rl.close();
          resolve(answer);
        } else {
          ask();
        }
      });
    };
    ask();
  });
}

function buildCmd(platform, entryFilePath, prefix) {
  return `npx react-native bundle --dev false --platform ${platform} --entry-file ${entryFilePath} --bundle-output ./dist/${platform}/${prefix}.${platform}.bundle --assets-dest ./dist/${platform} --minify true --config split_bundle/metro.config.js --verbose true`;
}

function main(filterFiles, entryFilePath, platform) {
  logger.info(
    'filterFiles: ' + filterFiles,
    'entryFilePath: ' + entryFilePath,
    'plaform: ' + platform,
  );

  let filterConfig = [];
  if (filterFiles) {
    filterConfig = filterFiles.split(',');
  }
  // 写入过滤配置文件
  fs.writeFileSync(filterConfigFilePath, JSON.stringify(filterConfig, null, 2));

  if (entryFilePath) {
    /// 解析打包入口文件属性
    let position = entryFilePath.lastIndexOf('/');
    position = position > -1 ? position + 1 : 0;
    const fileName = entryFilePath.substr(position);

    const prefix = fileName.substring(0, fileName.indexOf('.'));

    // 写入打包入口配置文件
    fs.writeFileSync(
      entryConfigFilePath,
      JSON.stringify(
        {
          path: entryFilePath,
          name: fileName,
          prefix: prefix,
          platform,
        },
        null,
        2,
      ),
    );

    // 写入moduleId的配置文件
    let moduleIdConfig = {};
    if (fs.existsSync(moduleIdConfigFilePath)) {
      moduleIdConfig = fs.readFileSync(moduleIdConfigFilePath, 'utf-8');
      moduleIdConfig = JSON.parse(moduleIdConfig);
      if (
        typeof moduleIdConfig === 'object' &&
        !Object.keys(moduleIdConfig).includes(fileName)
      ) {
        // 检测是否配置moduleId
        const ids = Object.values(moduleIdConfig);
        if (ids.length > 0) {
          moduleIdConfig[fileName] = Math.max(...ids) + 100000;
        } else {
          moduleIdConfig[fileName] = 0;
        }
      }
    } else {
      moduleIdConfig[fileName] = 0;
    }
    fs.writeFileSync(
      moduleIdConfigFilePath,
      JSON.stringify(moduleIdConfig, null, 2),
    );

    try {
      logger.info('---开始打包---\n');

      const buildPlatformCmd = function() {
        return buildCmd(platform, entryFilePath, prefix);
      };
      let cmd;
      if (platform === 'android') {
        cmd = buildPlatformCmd('android');
      } else if (platform === 'ios') {
        cmd = buildPlatformCmd('ios');
      } else if (platform === 'all') {
        cmd = buildPlatformCmd('android') + ' && ' + buildPlatformCmd('ios');
      }

      logger.info(cmd);
      childprocess.execSync(cmd).toString();
      logger.info('---打包成功---');
    } catch (error) {
      logger.error('---打包失败---\n');
      logger.error(error);
    }
  }
}

/**
 * 命令行交互式
 */
(async function() {
  const filterFiles = await input(
    '请输入过滤的基准包文件（可不传），多个文件用,分隔，例如basics.js,app1.js' +
      '\n',
  );
  const entryFilePath = await input(
    '请输入待打包的文件路径（必传），例如./src/basics.js' + '\n',
    false,
  );
  const platform = await input(
    '请输入待打包的平台类型（必传），all、android、ios三选一，默认android' +
      '\n',
    false,
  );
  main(filterFiles, entryFilePath, platform);
})();

// /**
//  * 命令行参数
//  */
// (function() {
//   const [filterFiles, entryFilePath, platform] = process.argv.splice(2);
//   main(filterFiles, entryFilePath, platform);
// })();
