/**
 *
 * metro打包配置文件
 * 基础包和业务包通用
 */

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// 项目根路径
const projectRoot = path.resolve(__dirname, '../');

// moduleId的配置文件，固定文件名
const moduleIdConfigFilePath = path.join(__dirname, '/moduleIdConfig.json');

// 打基础包的入口文件，固定文件名
const basicEntryFile = 'basic.js';

// 基础包中的module和id的映射文件，固定文件名
const basicModuleToIdMapFilePath = path.join(
  __dirname,
  '/basicModuleToIdMap.json',
);

// 待打包的文件，默认打基础包, 根据getModulesRunBeforeMainModule修改
let entryFile = basicEntryFile;

// module和id的映射文件
let moduleToIdMapFilePath = basicModuleToIdMapFilePath;

// moduleId，默认取moduleIdConfig.json中的初始值
let nextModuleId = require(moduleIdConfigFilePath)[entryFile];
// 由于递增后再生成moduleToId,这里先减去1
nextModuleId--;

function initData() {
  if (entryFile.indexOf('basic') < 0) {
    // 打业务包，修改xxxModuleToIdMap.json文件名
    const fileName =
      entryFile.substring(0, entryFile.indexOf('.')) + 'ModuleToIdMap.json';
    // module和id的映射文件
    moduleToIdMapFilePath = path.join(__dirname, fileName);
  }

  // 当前的moduleId，默认取moduleIdConfig.json中的初始值
  const currentModuleId = require(moduleIdConfigFilePath)[entryFile];
  if (typeof currentModuleId !== 'number') {
    logger.error('\n' + 'moduleIdConfig.json中缺少打包入口文件，请添加');
    process.exit();
  }
  // 由于递增后再生成moduleId,这里先减去1
  nextModuleId = currentModuleId;
  nextModuleId--;
}

/**
 * 创建moduleId
 */
function createModuleIdFactory() {
  // 所有module和id的映射，默认空对象
  let allModuleToIdMap = {};
  // entryFile文件module和id的映射，默认空对象
  let moduleToIdMap = {};

  /**
   * @param modulepath metro回传的
   */
  return function(modulepath) {
    // xxxModuleToIdMap.json是否存在
    if (fs.existsSync(moduleToIdMapFilePath)) {
      // 读取xxxModuleToIdMap.json文件，并赋值
      const content = fs.readFileSync(moduleToIdMapFilePath, 'utf-8');
      if (content && content.length > 0) {
        moduleToIdMap = JSON.parse(content);
        allModuleToIdMap = Object.assign(allModuleToIdMap, moduleToIdMap);
      }
      if (entryFile.indexOf('basic') < 0) {
        // 打业务包时，需合并基础包查找id
        const basicContent = fs.readFileSync(
          basicModuleToIdMapFilePath,
          'utf-8',
        );
        if (basicContent && basicContent.length > 0) {
          allModuleToIdMap = Object.assign(
            allModuleToIdMap,
            JSON.parse(basicContent),
          );
        }
      }
    }
    // 根据modulepath的相对路径查找对应id
    const relativePath = path.relative(projectRoot, modulepath);
    const currentModuleId = allModuleToIdMap[relativePath];

    if (typeof currentModuleId === 'number') {
      // 查找到赋值
      nextModuleId = currentModuleId;
    } else {
      // 获取最大的moduleId
      const ids = Object.values(moduleToIdMap);
      if (ids instanceof Array && ids.length > 0) {
        nextModuleId = Math.max(...ids);
      }
      nextModuleId++;
      // 写moduleToId文件
      moduleToIdMap[relativePath] = nextModuleId;
      // 由程序写入，切勿手动修改文件moduleToIdMapFilePath指向的文件
      fs.writeFileSync(
        moduleToIdMapFilePath,
        JSON.stringify(moduleToIdMap, null, 2),
      );
    }
    return nextModuleId;
  };
}

/**
 * 主要获取entryFilePath
 * @param {*} entryFilePath
 */
function getModulesRunBeforeMainModule(entryFilePath) {
  let position = entryFilePath.lastIndexOf(path.sep);
  position = position > -1 ? position + 1 : 0;
  entryFile = entryFilePath.substr(position);
  initData();
  logger.info(
    '\n' + 'entryFilePath: ' + entryFilePath,
    'entryFile: ' + entryFile,
  );
  return [];
}

/**
 * 过虑模块
 * path.jion()将'/'转译成相应平台的分隔符
 *
 * @param {*} module
 */
function processModuleFilter(module) {
  if (entryFile.indexOf('basic') === 0) {
    // 打基础包不过虑模块
    return true;
  }
  if (!fs.existsSync(basicModuleToIdMapFilePath)) {
    logger.warn('请先打基础包');
    process.exit();
  }
  const modulepath = module['path'];
  if (
    modulepath.indexOf(path.join('__prelude__')) >= 0 ||
    modulepath.indexOf(
      path.join('/node_modules/react-native/Libraries/polyfills'),
    ) >= 0 ||
    modulepath.indexOf(path.join('source-map')) >= 0 ||
    modulepath.indexOf(path.join('/node_modules/metro/src/lib/polyfills/')) >= 0
  ) {
    return false;
  }
  if (modulepath.indexOf(path.join('/node_modules/')) > 0) {
    // 输出类型为js/script/virtual的模块不能过滤，一般此类型的文件为核心文件，
    // 如InitializeCore.js。每次加载bundle文件时都需要用到。
    if (path.join('js/script/virtual') == module['output'][0]['type']) {
      return true;
    }
    // 根据modulepath的相对路径查找对应id，过虑基础包
    const relativePath = path.relative(projectRoot, modulepath);
    let baiscModuleToIdMap = fs.readFileSync(
      basicModuleToIdMapFilePath,
      'utf-8',
    );
    baiscModuleToIdMap = JSON.parse(baiscModuleToIdMap);
    const currentModuleId = baiscModuleToIdMap[relativePath];
    if (typeof currentModuleId === 'number') {
      return false;
    }
  }
  return true;
}

module.exports = {
  // 项目根路径
  projectRoot: projectRoot,
  // 开始构建时是否应该重置缓存
  resetCache: false,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  serializer: {
    createModuleIdFactory: createModuleIdFactory,
    processModuleFilter: processModuleFilter,
    getModulesRunBeforeMainModule: getModulesRunBeforeMainModule,
  },
};
