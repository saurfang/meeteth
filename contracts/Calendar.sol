pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "solidity-treemap/contracts/TreeMap.sol";
import "./Reservation.sol";
import "./ERC809.sol";


contract Calendar is ERC721Token, ERC809 {
  using TreeMap for TreeMap.Map;

  // mapping of token(calendar) id to mapping from start/end timestamp of a reservation to its id
  mapping(uint256 => TreeMap.Map) public startTimestampsMap;
  mapping(uint256 => TreeMap.Map) public stopTimestampsMap;

  // address of the ERC721 contract tokenizing reseravation/access of this contract's token
  address public reservationContract;

  constructor() public ERC721Token("Calendar", "CAL") {
    reservationContract = new Reservation();
  }

  /// @notice Create a new calendar token
  function mint()
  public
  {
    super._mint(msg.sender, totalSupply());
  }

  /// @notice Destroy a calendar token
  /// TODO: figure out what to do when there are expired and/or outstanding reservations
  function burn(uint256 _tokenId)
  public
  {
    super._burn(msg.sender, _tokenId);
  }

  /// @notice Query if token `_tokenId` if available to reserve between `_start` and `_stop` time
  /// @dev For the requested token, we examine its current resertions, check
  ///   1. whether the last reservation that has `startTime` before `_start` already ended before `_start`
  ///                Okay                            Bad
  ///           *startTime*   stopTime        *startTime*   stopTime
  ///             |---------|                  |---------|
  ///                          |-------               |-------
  ///                          _start                 _start
  ///   2. whether the soonest reservation that has `endTime` after `_end` will start after `_end`.
  ///                Okay                            Bad
  ///          startTime   *stopTime*         startTime   *stopTime*
  ///             |---------|                  |---------|
  ///    -------|                           -------|
  ///           _stop                              _stop
  ///
  //   NB: reservation interval are [start time, stop time] i.e. closed on both ends.
  function isAvailable(uint256 _tokenId, uint256 _start, uint256 _stop)
  public
  view
  returns(bool)
  {
    bool found;
    uint256 reservationId;

    uint256 stopTime;
    (found, stopTime, reservationId) = stopTimestampsMap[_tokenId].floorEntry(_stop);
    if (found && stopTime >= _start) {
      return false;
    }

    uint256 startTime;
    (found, startTime, reservationId) = startTimestampsMap[_tokenId].ceilingEntry(_start);
    if (found && startTime <= _stop) {
      return false;
    }

    return true;
  }

  /// @notice Reserve access to token `_tokenId` from time `_start` to time `_stop`
  /// @dev A successful reservation must ensure each time slot in the range _start to _stop
  ///  is not previously reserved.
  function reserve(uint256 _tokenId, uint256 _start, uint256 _stop)
  public
  returns(uint256)
  {
    if (!isAvailable(_tokenId, _start, _stop)) {
      revert("Token is unavailable during this time period");
    }

    Reservation reservation = Reservation(reservationContract);
    uint256 reservationId = reservation.reserve(msg.sender, _tokenId, _start, _stop);
    startTimestampsMap[_tokenId].put(_start, reservationId);
    stopTimestampsMap[_tokenId].put(_stop, reservationId);

    return reservationId;
  }

  /// @notice Cancel all reservations for `_tokenId` between `_start` and `_stop`
  /// @return number of reservation that has been cancelled
  function cancelAll(uint256 _tokenId, uint256 _start, uint256 _stop)
  public
  returns (uint256)
  {
    // TODO: implement iterator in TreeMap for more efficient batch removal
    TreeMap.Map storage startTimestamps = startTimestampsMap[_tokenId];
    TreeMap.Map storage stopTimestamps = stopTimestampsMap[_tokenId];
    Reservation reservation = Reservation(reservationContract);

    bool found = true;
    uint256 startTime = _start;
    uint256 stopTime;
    uint256 reservationId;
    uint256 cancelled = 0;
    // FIXME: a token could also have a `renter => startTimestamps` mapping to skip
    //   reservations that don't belong to a renter more efficiently
    (found, startTime, reservationId) = startTimestamps.ceilingEntry(startTime);
    while (found) {
      stopTime = reservation.stopTimestamps(reservationId);
      if (stopTime <= _stop && reservation.ownerOf(reservationId) == msg.sender) {
        reservation.cancel(msg.sender, reservationId);
        startTimestamps.remove(startTime);
        stopTimestamps.remove(stopTime);

        cancelled++;
      }

      (found, startTime, reservationId) = startTimestamps.higherEntry(startTime);
    }

    return cancelled;
  }

  function cancel(uint256 _tokenId, uint256 _reservationId)
  public
  {
    Reservation reservation = Reservation(reservationContract);

    uint256 startTime = reservation.startTimestamps(_reservationId);
    uint256 stopTime = reservation.stopTimestamps(_reservationId);
    uint256 calendarId = reservation.calendarIds(_reservationId);
    if (calendarId != _tokenId) {
      revert("Calendar id is invalid");
    }

    reservation.cancel(msg.sender, _reservationId);

    TreeMap.Map storage startTimestamps = startTimestampsMap[_tokenId];
    TreeMap.Map storage stopTimestamps = stopTimestampsMap[_tokenId];
    startTimestamps.remove(startTime);
    stopTimestamps.remove(stopTime);
  }

  function renterOf(uint256 _tokenId, uint256 _timestamp)
  public
  view
  returns (address)
  {
    TreeMap.Map storage startTimestamps = startTimestampsMap[_tokenId];

    // find the last reservation that started before _timestamp
    bool found;
    uint256 startTime;
    uint256 reservationId;
    (found, startTime, reservationId) = startTimestamps.floorEntry(_timestamp);

    if (found) {
      Reservation reservation = Reservation(reservationContract);
      // verify the reservation ends after _timestamp
      if (reservation.stopTimestamps(reservationId) >= _timestamp) {
        return reservation.ownerOf(reservationId);
      }
    }
  }
}
