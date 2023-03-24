"use strict";

var _fs = _interopRequireDefault(require("fs"));
var _jsYaml = _interopRequireDefault(require("js-yaml"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import YAML from 'yamljs';
// import fs from 'fs';
// import path from 'path';

// const dirname = path.resolve();

// const docsPath = path.join(dirname, 'docs');
// const apiDocs = [];

// fs.readdirSync(docsPath).forEach((file) => {
//   if (path.extname(file) === '.yaml') {
//      const doc = YAML.load(path.join(docsPath, file));
//         apiDocs.push(doc);
//     }
// });

// // this will combine each YAML file craeted by team member  into one object
// const combinedDocs = {
//     swagger: '2.0',
//     info: {
//         title: 'Tech-titans Ecommerce Swagger Api Documentation ',
//         version: '1.0.0',
//     },
//     paths: {},
// };

// apiDocs.forEach(doc => {
//     for (const path in doc.paths) {
//         combinedDocs.paths[path] = doc.paths[path];
//     }
// });
// export default  combinedDocsa

// import fs from 'fs';
// import path from 'path';
// import yaml from 'js-yaml';

// const dirname = path.resolve();

// const docsPath = path.join(dirname, 'docs');
// const apiDocs = [];
// fs.readdirSync(docsPath).forEach((file) => {
//   if (path.extname(file) === '.yaml') {
//     const doc = yaml.safeLoad(fs.readFileSync(path.join(docsPath, file), 'utf8'));
//     apiDocs.push(doc);
//   }
// });
// // this will combine each YAML file created by team member into one object
// const combinedDocs = {
//   swagger: '2.0',
//   info: {
//     title: 'Tech-titans Ecommerce Swagger Api Documentation ',
//     version: '1.0.0',
//   },
//   paths: {},
// };

// apiDocs.forEach((doc) => {
//   for (const path in doc.paths) {
//     combinedDocs.paths[path] = doc.paths[path];
//   }
// });

// export default combinedDocs;

const doc = _jsYaml.default.safeLoad(_fs.default.readFileSync('example.doc.yml', 'utf8'));
console.log(doc[0].name); // "My Function"