#!/bin/bash

compile_typings() {
  ./node_modules/.bin/ts-node generate.ts
}

format_typings() {
  ./node_modules/.bin/prettier --parser typescript
}

update_typings() {
  compile_typings | format_typings > contracts.d.ts
}

compile_solidity() {
  ./node_modules/.bin/truffle compile
}

compile_solidity
update_typings
