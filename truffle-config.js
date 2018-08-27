require("babel-register")({
  ignore: /node_modules\/(?!openzeppelin-solidity)/,
});
require("babel-polyfill");
require("mocha-clean");
require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    coverage: {
      gas: 0xfffffffffff,
      gasPrice: 0x01,
      host: "localhost",
      network_id: "*", // eslint-disable-line camelcase
      port: 8555,
    },
    development: {
      host: "localhost",
      network_id: "*", // eslint-disable-line camelcase
      port: 8545,
    },
    ganache: {
      host: "localhost",
      network_id: "*", // eslint-disable-line camelcase
      port: 8545,
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          process.env["RINKEBY_MNEMONIC"],
          `https://rinkeby.infura.io/${process.env["RINKEBY_INFURA_API_KEY"]}`
        );
      },
      network_id: 4,
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500,
    },
  },
};
