var SimpleStorage = artifacts.require("SimpleStorage");
var TutorialToken = artifacts.require("TutorialToken");
var Calendar = artifacts.require("Calendar");
var Reservation = artifacts.require("Reservation");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(TutorialToken);
  return deployer.deploy(Calendar).then(function(instance) {
    return instance.reservationContract().then(function(address) {
      Reservation.address = address;
    });
  });
};
