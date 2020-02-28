/**
 * metro打包配置
 * 仅支持基础包，已弃用
 */

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// 项目根路径
const projectRoot = path.resolve(__dirname, '../');

// moduleId的配置文件，固定文件名
const moduleIdConfigFilePath = path.join(__dirname, '/moduleIdConfig.json');

// 基础包的入口文件，固定文件名
const entryFile = 'basic.js';

// 基础包中的module和id的映射文件，固定文件名
const moduleToIdMapFilePath = path.join(__dirname, '/basicModuleToIdMap.json');

// moduleId，默认取moduleIdConfig.json中的初始值
let nextModuleId = require(moduleIdConfigFilePath)[entryFile];
// 由于递增后再生成moduleToId,这里先减去1
nextModuleId--;

/**
 * 创建moduleId
 */
function createModuleIdFactory() {
  // 默认空对象
  let moduleToIdMap = {};

  /**
   * @param modulepath metro回传的
   */
  return function(modulepath) {
    // basicModuleToIdMap.json是否存在
    if (fs.existsSync(moduleToIdMapFilePath)) {
      try {
        // 读取basicModuleToIdMap.json文件，并赋值
        const content = fs.readFileSync(moduleToIdMapFilePath, 'utf-8');
        if (content && content.length > 0) {
          moduleToIdMap = JSON.parse(content);
        }
      } catch (error) {
        fs.unlinkSync(moduleToIdMapFilePath);
        logger.error(`${error}\n`);
        logger.error(moduleToIdMapFilePath + '出现错误，删除重新创建');
        process.exit();
      }
    }
    // 根据modulepath的相对路径查找对应id
    const relativePath = path.relative(projectRoot, modulepath);
    const currentModuleId = moduleToIdMap[relativePath];

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
      // 写入basicModuleToIdMap.json文件
      moduleToIdMap[relativePath] = nextModuleId;
      fs.writeFileSync(
        moduleToIdMapFilePath,
        JSON.stringify(moduleToIdMap, null, 2),
      );
    }
    return nextModuleId;
  };
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
  },
};
