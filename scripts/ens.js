const ENSRegistry = artifacts.require("ENSRegistry.sol");
const PublicResolver = artifacts.require("PublicResolver.sol");
const ReverseRegistrar = artifacts.require("ReverseRegistrar.sol");
const namehash = require("eth-ens-namehash");
const yargs = require("yargs");

const arg = yargs
  .usage("Usage: truffle exec scripts/ens.js -n $DOMAIN_NAME -a $ADDRESS")
  // avoid address to hex conversion
  .coerce(["a"], x => x)
  .demandOption(["n", "a"]).argv;

const address = arg.a;
const name = arg.n;
const tld = "eth";
const hashedname = namehash.hash(`${name}.eth`);
module.exports = async function ensRegister(callback) {
  const ens = await ENSRegistry.deployed();
  const resolver = await PublicResolver.deployed();
  const reverseresolver = await ReverseRegistrar.deployed();
  const owner = web3.eth.accounts[0];
  await ens.setSubnodeOwner(namehash.hash(tld), web3.sha3(name), owner, {
    from: owner,
  });
  await ens.setResolver(hashedname, PublicResolver.address, { from: owner });
  await resolver.setAddr(hashedname, address, { from: owner });
  const res1 = await resolver.addr.call(hashedname);
  console.log(res1, "==", address);
  await reverseresolver.setName(`${name}.eth`, { from: address });
  const res2 = await resolver.name.call(
    namehash.hash(`${address.slice(2)}.addr.reverse`)
  );
  console.log(res2, "==", `${name}.eth`);
};
