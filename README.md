# MeetETH

[![Build Status](https://travis-ci.org/saurfang/meeteth.svg?branch=master)](https://travis-ci.org/saurfang/meeteth)
[![Coverage Status](https://coveralls.io/repos/github/saurfang/meeteth/badge.svg?branch=master)](https://coveralls.io/github/saurfang/meeteth?branch=master)

Proof of Concept of [ERC809](https://github.com/ethereum/EIPs/issues/809)/[ERC1201](https://github.com/ethereum/EIPs/issues/1201), the standard for rentable non-fungible tokens. The ERC809 token itself represents an ephemeral access to a tokenized (non-)fungible asset. Such asset may be a travel accommodation, some professional service e.g. doctor, or even the right of road.

MeetETH is a simple scheduling Dapp that allows user to create tokenized calendar bound to ethereum account and invite other users to create tokenized reservations on such calendars. While the interaction may look simple, it can be generalized to many exciting use cases. At its core, this is about reserving an ephemeral access to a non-rival goods.

Learn more about the potential applications of ERC809/1201 token standard as well as the technical smart contract architecture at: [ERC809/1201: Tokenizing Non-fungible Access
](https://medium.com/coinmonks/erc809-1201-tokenizing-non-fungible-access-abdc5018c49)

## Development

To setup the development environment, you will need `yarn` and `ganache-cli`

```bash
# install npm packages
yarn
# start development networks
# npm install -g ganache-cli
ganache-cli
# compile and deploy contracts
truffle migrate
# start development webserver
yarn start
```

To register with development ENS:

```bash
truffle exec scripts/ens.js -n ganache2 -a 0x5093eaedcc74bcc56128d74fa300e2ecf40c577c
```

## Contracts

Calendar.sol - ERC721/ERC809 token represents a schedulable calendar.

Reservation.sol - ERC721/ERC809Child token represents an ephemeral access to a specific Calendar token.

**No audit has been performed on these contracts. Use of this code in production is strongly discouraged.**

## Routes

- /meet/:id - schedule a reservation on token with `:id` id
- /manage - manage Calendar(s) owned by current account
- /dashboard - display upcoming reservations current account made or was made to
- /:account - list all calendars owned by `:account`, which can be an ETH or ENS address

## Roadmap

- [ ] basic reservation
- [ ] event type with fixed duration and alignment (e.g. 30 minutes meeting)
- [ ] selection based scheduling (instead of selecting from calendar)
- [ ] reservation management by guest
- [ ] reservation management by host
- [ ] deposit support (e.g. spam prevention)
  - [ ] cancellation fee
  - [ ] noshow fee
- [ ] token transfer and trading (0x?)
- [ ] permissioned booking/trading (hording/scalping prevention)

## Reference

https://github.com/saurfang/solidity-treemap
