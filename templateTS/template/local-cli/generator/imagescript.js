const fs = require('fs');
const path = require('path');
const logger = require('../logger');

const IMAGE_DIR_PATH = path.resolve(__dirname, '../../src/resources/images');

const IMAGE_SUFFIX = ['png', 'jgp', 'jpeg', 'gif'];

const IMAGE_EXPORT_PATH = path.join(IMAGE_DIR_PATH, 'index.ts');

const needFilterFiles = ['index.ts', '.DS_Store'];

(function main() {
  const notSupportImage = [];

  const files = fs.readdirSync(IMAGE_DIR_PATH);
  const content = ['export default {'];
  files.forEach((file, index) => {
    if (!needFilterFiles.includes(file)) {
      const mi = file.lastIndexOf('.');
      const suffix = file.substr(mi + 1);
      if (IMAGE_SUFFIX.includes(suffix)) {
        const name = file.substring(0, mi);
        let line = `  ${name}: require('./${file}'),`;
        if (index === files.length - 1) {
          line = line.substring(0, line.lastIndexOf(','));
        }
        content.push(line);
      } else {
        notSupportImage.push(file);
      }
    }
  });
  content.push('};\n');
  fs.writeFileSync(IMAGE_EXPORT_PATH, content.join('\n'));
  notSupportImage.length && logger.info(`filter ${notSupportImage.length} image: [${notSupportImage}]`);
  logger.info('generate image export successfully');
})();
