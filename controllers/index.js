const identityCtrls = require('./identity');
const tagCtrls = require('./tag');
const hospitalCtrls = require('./hospital');

module.exports = [...identityCtrls, ...tagCtrls, ...hospitalCtrls];
