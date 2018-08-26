# MeetETH

Proof of Concept of ERC809, the standard for rentable non-fungible tokens. The ERC809 token itself represents an ephemeral access to a tokenized (non-)fungible asset. Such asset may be a travel accommodation, some professional service e.g. doctor, or even the right of road.

MeetETH is a simple scheduling Dapp that allows user to create tokenized calendar bound to ethereum account and invite other users to create tokenized reservations on such calendars. While the interaction may look simple, it has many exciting use cases.

**Human to Human** transferrable reservation: doctor appointments are often made weeks in advance in U.S. and people often have to choose between expensive emergency care and toughing it out while waiting the appointment to come. A lot of doctor office employs receptionist whose worst part of the job is calling patients to juggle appointments based on patient's schedule and preferences.
A tokenized reservation would allow patients to easily swap reservation time and guardrails can be set up in smart contract to prevent squatting and scalping. Furthermore, as ERC809 inherits ERC721, the token can be traded using common protocol such as 0x which dramatically reduces work and improve liquidity.
Lastly, doctors with common practice area can participate in a TCR where reservations can be more efficiently arranged among doctors who have similar experience, reputation, and expertise.

**Human to Machine** reservation: it is not difficult to see how such calendar can belong to other self operating smart contracts as well. For example, one can reserve a self-driving car for a multi-day camping trip. One may also reserve a cloud computing resource at a pre-agreed price akin to AWS reserved instances.

**Machine to Machine** reservation: this naturally extends to machine to machine as well. A self-driving autonomous vehicle can manage its own wallet and bids for rides. When providing the ride, it communicates with traffic management smart contract to bid and reserve the right of road at an intersection. When it does its route planning, it can precisely calculate the time it enters and leaves each intersection, and can further trade the right of road as traffic condition changes.

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

## Contracts

Calendar.sol - ERC721 token represents a schedulable calendar. The owner can accept/cancel/manage reservations as well as setting reservation and calendar rules.

Reservation.sol - ERC721/ERC809 token represents an ephemeral access to a specific Calendar token.

**No audit has been performed on these contracts. Use of this code in production is strongly discouraged.**

## Routes

- /meet/:id - schedule a reservation on token with `:id` id
- /manage - manage Calendar(s) owned by current account
- /dashboard - display upcoming reservations current account made or was made to

## Develop

```bash
truffle exec scripts/ens.js -n ganache2 -a 0x5093eaedcc74bcc56128d74fa300e2ecf40c577c
```

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
