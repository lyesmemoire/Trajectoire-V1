// @ts-nocheck
import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

let count = 0;
walk('C:/Trajectoire/core', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/(from\s+|import\s+|import\()(["'])(\.[^"']+)\2/g, (match, prefix, quote, p) => {
      if (p.endsWith('.js') || p.endsWith('.json')) return match;
      const targetPath = path.join(path.dirname(filePath), p);
      const isDir = fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory();
      if (isDir) {
          return prefix + quote + p + '/index.js' + quote;
      } else {
          return prefix + quote + p + '.js' + quote;
      }
    });
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated ' + filePath);
      count++;
    }
  }
});
console.log(`Updated ${count} files.`);
