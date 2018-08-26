const should = require("chai").should();

function inLogs(logs, eventName, eventArgs = {}) {
  const event = logs.find(e => e.event === eventName);
  should.exist(event);
  Object.entries(eventArgs).forEach(([k, v]) => {
    should.exist(event.args[k]);

    if (typeof v === "number") {
      event.args[k].should.be.bignumber.equal(v);
    } else {
      event.args[k].should.equal(v);
    }
  });
  return event;
}

async function inTransaction(tx, eventName, eventArgs = {}) {
  const { logs } = await tx;
  return inLogs(logs, eventName, eventArgs);
}

module.exports = {
  inLogs,
  inTransaction,
};
