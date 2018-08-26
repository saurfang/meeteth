import chaiSetup from "./utils/chai_setup";
import EVMRevert from "./utils/EVMRevert";
import expectEvent from "./utils/expectEvent";

const Reservation = artifacts.require("Reservation");

chaiSetup();

contract("Reservation", ([owner, nobody]) => {
  let reservation;

  describe("allows owner to", () => {
    beforeEach(async () => {
      reservation = await Reservation.new();
    });

    it("reserve and emits Creation Event", async () => {
      await expectEvent.inTransaction(
        reservation.reserve(nobody, 0, 100, 200),
        "Creation",
        { _renter: nobody, _calendarId: 0, _tokenId: 0 }
      );
      (await reservation.ownerOf(0)).should.equal(nobody);
    });

    it("cancel and emits Cancellation Event", async () => {
      await reservation.reserve(nobody, 0, 100, 200);

      await expectEvent.inTransaction(
        reservation.cancel(nobody, 0),
        "Cancellation",
        { _renter: nobody, _calendarId: 0, _tokenId: 0 }
      );

      // token no longer exists
      reservation.ownerOf(0).should.be.rejectedWith(EVMRevert);
    });
  });

  describe("handles token id", () => {
    beforeEach(async () => {
      reservation = await Reservation.new();
    });

    it("incrementing the id every time", async () => {
      await expectEvent.inTransaction(
        reservation.reserve(nobody, 0, 100, 200),
        "Creation",
        { _renter: nobody, _calendarId: 0, _tokenId: 0 }
      );
      await expectEvent.inTransaction(
        reservation.reserve(nobody, 0, 400, 600),
        "Creation",
        { _renter: nobody, _calendarId: 0, _tokenId: 1 }
      );
      await expectEvent.inTransaction(
        reservation.reserve(owner, 0, 600, 800),
        "Creation",
        { _renter: owner, _calendarId: 0, _tokenId: 2 }
      );
      await expectEvent.inTransaction(
        reservation.reserve(owner, 1, 600, 800),
        "Creation",
        { _renter: owner, _calendarId: 1, _tokenId: 3 }
      );
    });

    it("not affected by cancellation", async () => {
      await reservation.reserve(nobody, 0, 100, 200);
      await reservation.cancel(nobody, 0);

      await expectEvent.inTransaction(
        reservation.reserve(nobody, 0, 400, 600),
        "Creation",
        { _renter: nobody, _calendarId: 0, _tokenId: 1 }
      );
    });
  });

  describe("does not allow non-owner to", () => {
    beforeEach(async () => {
      reservation = await Reservation.new();
    });

    it("reserve", async () => {
      reservation
        .reserve(nobody, 0, 100, 200, {
          from: nobody,
        })
        .should.be.rejectedWith(EVMRevert);
    });

    it("cancel", async () => {
      await reservation.reserve(nobody, 0, 100, 200);

      // verify nobody owns the token now
      (await reservation.ownerOf(0)).should.equal(nobody);

      reservation
        .cancel(nobody, 0, {
          from: nobody,
        })
        .should.be.rejectedWith(EVMRevert);
    });
  });
});
