module.exports = {
  extends: ["airbnb-base", "prettier", "prettier/react"],
  env: {
    browser: true,
    node: true,
    mocha: true,
    jest: true
  },
  globals: {
    artifacts: false,
    assert: false,
    contract: false,
    web3: false
  },
  rules: {
    "no-unused-vars": "warn"
  }
};
