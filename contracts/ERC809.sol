pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

/// @title ERC809: a standard interface for renting rival non-fungible tokens.
contract ERC809 is ERC721 {
  /// @dev This emits when a successful reservation is made for accessing any NFT.
  event Reserve(address indexed _renter, uint256 _tokenId, uint256 _start, uint256 _stop);

  /// @dev This emits when a successful cancellation is made for a reservation.
  event CancelReservation(address indexed _renter, uint256 _tokenId, uint256 _start, uint256 _stop);

  /// @notice Find the renter of an NFT token as of `_time`
  /// @dev The renter is who made a reservation on `_tokenId` and the reservation spans over `_time`.
  function renterOf(uint256 _tokenId, uint256 _time) public view returns (address);

  /// @notice Reserve access to token `_tokenId` from time `_start` to time `_stop`
  /// @dev A successful reservation must ensure each time slot in the range _start to _stop
  ///  is not previously reserved (by calling the function checkAvailable() described below)
  ///  and then emit a Reserve event.
  function reserve(uint256 _tokenId, uint256 _start, uint256 _stop) payable external returns (bool success);

  /// @notice Revoke access to token `_tokenId` from `_renter` and settle payments
  /// @dev This function should be callable by either the owner of _tokenId or _renter,
  ///  however, the owner should only be able to call this function if now >= _stop to
  ///  prevent premature settlement of funds.
  function settle(uint256 _tokenId, address _renter, uint256 _stop) external returns (bool success);

  /// @notice Query if token `_tokenId` if available to reserve between `_start` and `_stop` time
  function checkAvailable(uint256 _tokenId, uint256 _start, uint256 _stop) public view returns (bool available);

  /// @notice Cancel reservation for `_tokenId` between `_start` and `_stop`
  /// @dev All reservations between `_start` and `_stop` are cancelled. `_start` and `_stop` do not guarantee
  //   to be the ends for any one of the reservations
  function cancelReservation(uint256 _tokenId, uint256 _start, uint256 _stop) external returns (bool success);
}
