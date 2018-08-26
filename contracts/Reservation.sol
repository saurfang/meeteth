pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./ERC809.sol";


contract Reservation is ERC721Token, Ownable, ERC809Child {

  mapping(uint256 => uint256) public calendarIds;
  mapping(uint256 => uint256) public startTimestamps;
  mapping(uint256 => uint256) public stopTimestamps;

  uint256 nextTokenId;

  constructor() public ERC721Token("Reservation", "REZ") {
  }

  /// @notice Reserve access to token `_tokenId` from time `_start` to time `_stop`
  /// @dev A successful reservation must ensure each time slot in the range _start to _stop
  ///  is not previously reserved (by calling the function checkAvailable() described below)
  ///  and then emit a Reserve event.
  function reserve(address _to, uint256 _calendarId, uint256 _start, uint256 _stop)
  external
  onlyOwner()
  returns(uint256)
  {
    uint256 tokenId = nextTokenId;
    nextTokenId = nextTokenId.add(1);

    super._mint(_to, tokenId);

    calendarIds[tokenId] = _calendarId;
    startTimestamps[tokenId] = _start;
    stopTimestamps[tokenId] = _stop;

    emit Creation(_to, _calendarId, tokenId);

    return tokenId;
  }

  function cancel(address _owner, uint256 _tokenId)
  external
  onlyOwner()
  {
    super._burn(_owner, _tokenId);

    uint256 calendarId = calendarIds[_tokenId];
    delete calendarIds[_tokenId];
    delete startTimestamps[_tokenId];
    delete stopTimestamps[_tokenId];

    emit Cancellation(_owner, calendarId, _tokenId);
  }
}
