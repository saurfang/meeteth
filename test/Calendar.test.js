import chaiSetup from "./utils/chai_setup";
import EVMRevert from "./utils/EVMRevert";

const Calendar = artifacts.require("Calendar");

chaiSetup();

contract("Calendar", ([owner, renter1, renter2]) => {
  let calendar;
  const nullAddress = "0x0000000000000000000000000000000000000000";

  describe("availability", () => {
    beforeEach(async () => {
      calendar = await Calendar.new();
      await calendar.mint();
    });

    it("maintains ownership of token to actual owner", async () => {
      (await calendar.ownerOf(0)).should.equal(owner);
    });

    it("lets renter reserve and gain access", async () => {
      await calendar.reserve(0, 1000, 2000, { from: renter1 });

      (await calendar.renterOf(0, 500)).should.equal(nullAddress);
      (await calendar.renterOf(0, 1500)).should.equal(renter1);
    });

    it("blocks after reservation", async () => {
      // available by default
      (await calendar.isAvailable(0, 0, 5000)).should.equal(true);

      await calendar.reserve(0, 1000, 2000, { from: renter1 });
      await calendar.reserve(0, 3000, 4000, { from: renter1 });

      // block time range >> reservation 1 and 2
      //  |---------------------|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 0, 5000)).should.equal(false);
      // block time range >> reservation 1 but not 2
      //  |----------|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 500, 2500)).should.equal(false);
      // block time range >> reservation 2 but not 1
      //              |----------|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 2500, 4500)).should.equal(false);
      // block time range starts before reservation 1 and ends during 1
      //  |----|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 500, 1500)).should.equal(false);
      // block time range starts within reservation 1
      //       |--|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 1500, 1700)).should.equal(false);
      // block time range starts during reservation 1 and ends before 2
      //       |----|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 1500, 2500)).should.equal(false);
      // block time range starts after reservation 1 and ends during 2
      //             |---|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 2500, 3500)).should.equal(false);
      // block time range within reservation 2
      //                  |--|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 3500, 3700)).should.equal(false);
      // block time range starts during reservation 2
      //                    |---|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 3500, 4500)).should.equal(false);

      // available time range before reservation 1
      // |--|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 500, 800)).should.equal(true);
      // available time range between reservation 1 and 2
      //            |--|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 2200, 2500)).should.equal(true);
      // available time range after 2
      //                        |--|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 4500, 5000)).should.equal(true);
    });

    it("prevents double book", async () => {
      await calendar.reserve(0, 1000, 2000, { from: renter1 });
      (await calendar.isAvailable(0, 1000, 2000)).should.equal(false);

      // reserve revert
      // TODO: check revert message once there is test utils support
      calendar
        .reserve(0, 1000, 2000, {
          from: renter2,
        })
        .should.be.rejectedWith(EVMRevert);

      // reserve from renter2 has no effect
      (await calendar.renterOf(0, 1500)).should.equal(renter1);
    });
  });

  describe("cancellation", () => {
    before(async () => {
      calendar = await Calendar.new();
      await calendar.mint();
      await calendar.mint();

      await calendar.reserve(0, 1000, 2000, { from: renter1 });
      await calendar.reserve(0, 3000, 3500, { from: renter1 });
      await calendar.reserve(0, 4000, 5000, { from: renter1 });
      await calendar.reserve(0, 2500, 2700, { from: renter2 });
    });

    it("makes cancelled time period available again", async () => {
      await calendar.cancel(0, 0, { from: renter1 });

      (await calendar.isAvailable(0, 1000, 2000)).should.equal(true);

      (await calendar.renterOf(0, 1500)).should.equal(nullAddress);

      // can be reserved again
      await calendar.reserve(0, 1000, 2000, { from: renter1 });
    });

    it("reverts if requestor doesn't own the reservation", async () => {
      calendar
        .cancel(0, 1, {
          from: renter2,
        })
        .should.be.rejectedWith(EVMRevert);
    });

    it("reverts if the calendar id doesn't match", async () => {
      calendar
        .cancel(1, 0, { from: renter1 })
        .should.be.rejectedWith(EVMRevert);
    });

    it("reverts if the calendar id doesn't exist", async () => {
      calendar
        .cancel(2, 0, { from: renter1 })
        .should.be.rejectedWith(EVMRevert);
    });
  });

  describe("batch cancellation", () => {
    before(async () => {
      calendar = await Calendar.new();
      await calendar.mint();

      await calendar.reserve(0, 1000, 2000, { from: renter1 });
      await calendar.reserve(0, 3000, 3500, { from: renter1 });
      await calendar.reserve(0, 4000, 5000, { from: renter1 });
      await calendar.reserve(0, 2500, 2700, { from: renter2 });

      await calendar.cancelAll(0, 1000, 4000, { from: renter1 });
    });

    it("makes cancelled time period available again", async () => {
      (await calendar.isAvailable(0, 1000, 2000)).should.equal(true);

      (await calendar.renterOf(0, 1500)).should.equal(nullAddress);
      (await calendar.renterOf(0, 3200)).should.equal(nullAddress);
    });

    it("skips reservations that requestor doesn't own", async () => {
      (await calendar.renterOf(0, 2600)).should.equal(renter2);
    });

    it("does not cancel reservations outside requested time range", async () => {
      (await calendar.renterOf(0, 4500)).should.equal(renter1);
    });
  });

  describe("getters", () => {
    before(async () => {
      calendar = await Calendar.new();
      await calendar.mint();
      await calendar.mint();

      await calendar.reserve(0, 1000, 2000, { from: renter1 });
      await calendar.reserve(0, 3000, 3500, { from: renter1 });
      await calendar.reserve(1, 4000, 5000, { from: renter1 });

      await calendar.reserve(0, 2500, 2700, { from: renter2 });
    });

    it("return number of reservations for a calendar", async () => {
      (await calendar.reservationBalanceOf(0)).should.be.bignumber.equal(3);
      (await calendar.reservationBalanceOf(1)).should.be.bignumber.equal(1);
    });

    it("return reservation details for a calendar", async () => {
      const [
        reservationId,
        startTime,
        stopTime,
        renter,
      ] = await calendar.reservationOfCalendarByIndex(0, 1);

      reservationId.should.be.bignumber.equal(3);
      startTime.should.be.bignumber.equal(2500);
      stopTime.should.be.bignumber.equal(2700);
      renter.should.equal(renter2);
    });

    it("reverts if the calendar request is out of bound", async () => {
      calendar
        .reservationOfCalendarByIndex(0, 3)
        .should.be.rejectedWith(EVMRevert);
    });

    it("return reservation details for a renter", async () => {
      const [
        reservationId,
        startTime,
        stopTime,
        calendarId,
      ] = await calendar.reservationOfOwnerByIndex(renter1, 2);

      reservationId.should.be.bignumber.equal(2);
      startTime.should.be.bignumber.equal(4000);
      stopTime.should.be.bignumber.equal(5000);
      calendarId.should.be.bignumber.equal(1);
    });
  });
});
