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

// 过滤的基准包配置文件，固定文件名
const filterConfigFilePath = path.join(__dirname, './filterConfig.json');

// 打包入口配置文件，固定文件名
const entryConfigFilePath = path.join(__dirname, './entryConfig.json');

// 打包产物记录路径
const recordPath = path.join(__dirname, 'record');

// 过滤基准包中module和id的映射，默认空对象
let filterModuleToIdMap = {};
// module和id的映射文件
let moduleToIdMapFilePath;
// moduleId，根据entryFile查找moduleIdConfig.json中的初始值
let nextModuleId = 0;

/**
 * 初始化数据
 */
function initData() {
  // 是否创建record目录
  if (!fs.existsSync(recordPath)) {
    fs.mkdirSync(recordPath);
  }

  let entryConfig = fs.readFileSync(entryConfigFilePath, 'utf-8');
  if (!entryConfig) {
    logger.error('\n' + 'entryConfig.json中缺少打包入口文件，请添加');
    process.exit();
  }
  entryConfig = JSON.parse(entryConfig);
  logger.info(
    '\n' + 'entryFilePath: ' + entryConfig.path,
    'entryFileName: ' + entryConfig.name,
    'entryFilePrefix: ' + entryConfig.prefix,
  );

  // 查找过滤的基准包
  let filterConfig = fs.readFileSync(filterConfigFilePath, 'utf-8');
  filterConfig = JSON.parse(filterConfig);
  const filterConfigFiles = filterConfig.map(item => {
    const fileName =
      item.substring(0, item.indexOf('.')) +
      `ModuleToIdMap.${entryConfig.platform}.json`;
    return path.join(recordPath, fileName);
  });
  // 遍历过滤的基准包，合并所有待过滤ModuleToId
  filterConfigFiles.forEach(item => {
    if (fs.existsSync(item)) {
      const content = fs.readFileSync(item, 'utf-8');
      if (content && content.length > 0) {
        filterModuleToIdMap = Object.assign(
          filterModuleToIdMap,
          JSON.parse(content),
        );
      }
    }
  });

  // 修改`${entryFile}ModuleToIdMap.${platform}.json`文件名
  const fileName =
    entryConfig.prefix + `ModuleToIdMap.${entryConfig.platform}.json`;
  // entryFile的module和id的映射文件
  moduleToIdMapFilePath = path.join(recordPath, fileName);
  // 清除上次的记录
  fs.writeFileSync(moduleToIdMapFilePath, JSON.stringify({}, null, 2));

  // 当前的moduleId，默认根据entryFile取moduleIdConfig.json中的初始值
  const currentModuleId = require(moduleIdConfigFilePath)[entryConfig.name];
  if (typeof currentModuleId !== 'number') {
    logger.error('\n' + 'moduleIdConfig.json中缺少模块索引，请添加');
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

  initData();

  /**
   * @param modulepath metro回传的
   */
  return function(modulepath) {
    allModuleToIdMap = Object.assign(allModuleToIdMap, filterModuleToIdMap);

    // `${entryFile}ModuleToIdMap.json`是否存在
    if (fs.existsSync(moduleToIdMapFilePath)) {
      // 读取`${entryFile}ModuleToIdMap.json`，并赋值
      const content = fs.readFileSync(moduleToIdMapFilePath, 'utf-8');
      if (content && content.length > 0) {
        moduleToIdMap = JSON.parse(content);
        // 合并当前的moduleToId
        allModuleToIdMap = Object.assign(allModuleToIdMap, moduleToIdMap);
      }
    }
    // 根据modulepath的相对路径查找对应id
    const reg = new RegExp(path.sep, 'gm');
    const relativePath = path
      .relative(projectRoot, modulepath)
      .replace(reg, '/');
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
  const entryFile = entryFilePath.substr(position);
  return [];
}

/**
 * 过虑模块
 * path.jion()将'/'转译成相应平台的分隔符
 *
 * @param {*} module
 */
function processModuleFilter(module) {
  if (Object.values(filterModuleToIdMap).length === 0) {
    // 过滤基准包中module和id的映射为空，则不过滤当前entryFile
    return true;
  }
  const modulepath = module.path;
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
    if (path.join('js/script/virtual') === module.output[0].type) {
      return true;
    }
  }
  // 根据modulepath的相对路径查找对应id，过虑基准包
  const relativePath = path.relative(projectRoot, modulepath);
  const currentModuleId = filterModuleToIdMap[relativePath];
  if (typeof currentModuleId === 'number') {
    return false;
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
    // processModuleFilter: module => {
    //   let allMoudle = [];
    //   const allMoudlePath = path.join(__dirname, 'module.json');
    //   if (fs.existsSync(allMoudlePath)) {
    //     const content = fs.readFileSync(allMoudlePath);
    //     allMoudle = JSON.parse(content);
    //   }
    //   const modulepath = path.relative(projectRoot, module.path);
    //   if (!allMoudle.includes(modulepath)) {
    //     allMoudle.push(modulepath);
    //   }
    //   fs.writeFileSync(allMoudlePath, JSON.stringify(module, null, 2));
    // },
    // getModulesRunBeforeMainModule: getModulesRunBeforeMainModule,
  },
};
