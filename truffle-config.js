require('babel-register')({
  ignore: /node_modules\/(?!openzeppelin-solidity)/
});
require('babel-polyfill');
require('mocha-clean');

module.exports = {
  networks: {
    coverage: {
      gas: 0xfffffffffff,
      gasPrice: 0x01,
      host: 'localhost',
      network_id: '*', // eslint-disable-line camelcase
      port: 8555,
    },
    development: {
      host: 'localhost',
      network_id: '*', // eslint-disable-line camelcase
      port: 8545,
    },
    ganache: {
      host: 'localhost',
      network_id: '*', // eslint-disable-line camelcase
      port: 8545,
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    },
  }
};
