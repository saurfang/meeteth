Calendar.sol - ERC721 token represents a schedulable calendar. The owner can accept/cancel/manage reservations as well as setting reservation and calendar rules.

Reservation.sol - ERC721/ERC809 token represents an ephemeral access to a specific Calendar token.


Routes:

/meet/:id - schedule a reservation on token with `:id` id
/manage - manage Calendar(s) owned by current account
/dashboard - display upcoming reservations current account made or was made to


Roadmap:

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
