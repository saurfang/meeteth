import * as chai from "chai";

const chaiAsPromised = require("chai-as-promised");
const ChaiBigNumber = require("chai-bignumber");
const dirtyChai = require("dirty-chai");

export default () => {
  //   chai.config.includeStack = true;
  chai.use(ChaiBigNumber());
  chai.use(dirtyChai);
  chai.use(chaiAsPromised);
  chai.should();
};
