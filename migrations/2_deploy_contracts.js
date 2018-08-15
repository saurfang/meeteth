var Calendar = artifacts.require("Calendar");
var Reservation = artifacts.require("Reservation");

module.exports = function(deployer) {
  return deployer.deploy(Calendar).then(function(instance) {
    return instance.reservationContract().then(function(address) {
      Reservation.address = address;
    });
  });
};
