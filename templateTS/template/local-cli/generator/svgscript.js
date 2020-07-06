const fs = require('fs');
const path = require('path');
const logger = require('../logger');

const SVG_DIR_PATH = path.resolve(__dirname, '../../src/resources/svgs');
const SVG_EXPORT_PATH = path.join(SVG_DIR_PATH, 'index.ts');
const needFilterFiles = ['index.ts', '.DS_Store'];

(function main() {
  const files = fs.readdirSync(SVG_DIR_PATH);
  const content = ['export default {'];
  files.forEach((file, index) => {
    if (!needFilterFiles.includes(file)) {
      const mi = file.lastIndexOf('.');

      const name = file.substring(0, mi);
      let line = `  ${name}: require('./${file}'),`;
      if (index === files.length - 1) {
        line = line.substring(0, line.lastIndexOf(','));
      }
      content.push(line);
    }
  });
  content.push('};\n');
  fs.writeFileSync(SVG_EXPORT_PATH, content.join('\n'));
  logger.info('generate satic svgfile successfully');
})();
