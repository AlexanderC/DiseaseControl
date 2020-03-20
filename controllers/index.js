const identityCtrls = require('./identity');
const tagCtrls = require('./tag');
const inventoryCtrls = require('./inventory');
const hospitalCtrls = require('./hospital');

module.exports = [
  ...identityCtrls,
  ...tagCtrls,
  ...hospitalCtrls,
  ...inventoryCtrls,
];
