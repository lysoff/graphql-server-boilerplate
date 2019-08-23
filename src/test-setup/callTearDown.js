require('ts-node/register');

const { tearDown } = require('./tearDown');

module.exports = async function () {
  await tearDown();
}