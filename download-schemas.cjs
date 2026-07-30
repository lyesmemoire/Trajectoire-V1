const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  try {
    console.log('Downloading CycloneDX 1.5...');
    await download('https://raw.githubusercontent.com/CycloneDX/specification/main/schema/bom-1.5.schema.json', 'c:\\Trajectoire\\certification\\schemas\\bom-1.5.schema.json');
    console.log('Downloading SPDX 2.3...');
    await download('https://raw.githubusercontent.com/spdx/spdx-spec/development/v2.3.1/schemas/spdx-schema.json', 'c:\\Trajectoire\\certification\\schemas\\spdx-2.3.schema.json');
    console.log('Done');
  } catch (err) {
    console.error(err);
  }
})();
