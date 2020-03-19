const identityCtrls = require('./identity');
const tagCtrls = require('./tag');

module.exports = [...identityCtrls, ...tagCtrls];
