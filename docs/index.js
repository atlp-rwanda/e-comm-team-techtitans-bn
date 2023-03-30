const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');

const dirname = path.resolve();
const docsPath = path.join(dirname, 'docs');
const apiDocs = [];

fs.readdirSync(docsPath).forEach((file) => {
  if (path.extname(file) === '.yaml') {
    const doc = YAML.load(path.join(docsPath, file));
    apiDocs.push(doc);
  }
});

// this will combine each YAML file craeted by team member  into one object
const combinedDocs = {
  swagger: '2.0',
  info: {
    title: 'Tech-titans Ecommerce Swagger Api Documentation ',
    version: '1.0.0',
  },
  paths: {},
};

apiDocs.forEach((doc) => {
  for (const path in doc.paths) {
    combinedDocs.paths[path] = doc.paths[path];
  }
});

module.exports = combinedDocs;


