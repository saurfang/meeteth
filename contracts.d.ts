import * as Web3 from "web3";
import * as BigNumber from "bignumber.js";

type Address = string;
type TransactionOptions = Partial<Transaction>;
type UInt = number | BigNumber.BigNumber;

interface Transaction {
  hash: string;
  nonce: number;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  from: Address | ContractInstance;
  to: string | null;
  value: UInt;
  gasPrice: UInt;
  gas: number;
  input: string;
}

interface ContractInstance {
  address: string;
  sendTransaction(options?: TransactionOptions): Promise<void>;
}

export interface AddressUtilsInstance extends ContractInstance {}

export interface AddressUtilsContract {
  new: () => Promise<AddressUtilsInstance>;
  deployed(): Promise<AddressUtilsInstance>;
  at(address: string): AddressUtilsInstance;
}

export interface CalendarInstance extends ContractInstance {
  name: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  stopTimestampsMap: {
    (unnamed0: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      unnamed0: UInt,
      options?: TransactionOptions
    ): Promise<[BigNumber.BigNumber, BigNumber.BigNumber]>;
  };
  getApproved: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  approve: {
    (to: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  totalSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  startTimestampsMap: {
    (unnamed1: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      unnamed1: UInt,
      options?: TransactionOptions
    ): Promise<[BigNumber.BigNumber, BigNumber.BigNumber]>;
  };
  tokenOfOwnerByIndex: {
    (owner: Address, index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  safeTransferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  exists: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<boolean>;
  };
  tokenByIndex: {
    (index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  ownerOf: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  symbol: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  setApprovalForAll: {
    (to: Address, approved: boolean, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  reservationContract: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  tokenURI: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<string>;
  };
  isApprovedForAll: {
    (owner: Address, operator: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      operator: Address,
      options?: TransactionOptions
    ): Promise<boolean>;
  };

  mint: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
  };
  burn: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  isAvailable: {
    (
      tokenId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      tokenId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  reserve: {
    (
      tokenId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      tokenId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  cancelAll: {
    (
      tokenId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      tokenId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  cancel: {
    (tokenId: UInt, reservationId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      tokenId: UInt,
      reservationId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  renterOf: {
    (tokenId: UInt, timestamp: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      tokenId: UInt,
      timestamp: UInt,
      options?: TransactionOptions
    ): Promise<Address>;
  };
}

export interface CalendarContract {
  new: () => Promise<CalendarInstance>;
  deployed(): Promise<CalendarInstance>;
  at(address: string): CalendarInstance;
}

export interface ERC721Instance extends ContractInstance {
  name: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  getApproved: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  approve: {
    (to: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  totalSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  tokenOfOwnerByIndex: {
    (owner: Address, index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  safeTransferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  exists: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<boolean>;
  };
  tokenByIndex: {
    (index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  ownerOf: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  symbol: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  setApprovalForAll: {
    (
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  tokenURI: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<string>;
  };
  isApprovedForAll: {
    (owner: Address, operator: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      operator: Address,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
}

export interface ERC721Contract {
  new: () => Promise<ERC721Instance>;
  deployed(): Promise<ERC721Instance>;
  at(address: string): ERC721Instance;
}

export interface ERC721BasicInstance extends ContractInstance {
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  ownerOf: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  exists: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<boolean>;
  };
  approve: {
    (to: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  getApproved: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  setApprovalForAll: {
    (
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  isApprovedForAll: {
    (owner: Address, operator: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      operator: Address,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  safeTransferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface ERC721BasicContract {
  new: () => Promise<ERC721BasicInstance>;
  deployed(): Promise<ERC721BasicInstance>;
  at(address: string): ERC721BasicInstance;
}

export interface ERC721BasicTokenInstance extends ContractInstance {
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  ownerOf: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  exists: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<boolean>;
  };
  approve: {
    (to: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  getApproved: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  setApprovalForAll: {
    (to: Address, approved: boolean, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  isApprovedForAll: {
    (owner: Address, operator: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      operator: Address,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  safeTransferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface ERC721BasicTokenContract {
  new: () => Promise<ERC721BasicTokenInstance>;
  deployed(): Promise<ERC721BasicTokenInstance>;
  at(address: string): ERC721BasicTokenInstance;
}

export interface ERC721EnumerableInstance extends ContractInstance {
  getApproved: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  approve: {
    (to: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  safeTransferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  exists: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<boolean>;
  };
  ownerOf: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  setApprovalForAll: {
    (
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  isApprovedForAll: {
    (owner: Address, operator: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      operator: Address,
      options?: TransactionOptions
    ): Promise<boolean>;
  };

  totalSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  tokenOfOwnerByIndex: {
    (owner: Address, index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  tokenByIndex: {
    (index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
}

export interface ERC721EnumerableContract {
  new: () => Promise<ERC721EnumerableInstance>;
  deployed(): Promise<ERC721EnumerableInstance>;
  at(address: string): ERC721EnumerableInstance;
}

export interface ERC721MetadataInstance extends ContractInstance {
  getApproved: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  approve: {
    (to: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  safeTransferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  exists: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<boolean>;
  };
  ownerOf: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  setApprovalForAll: {
    (
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  isApprovedForAll: {
    (owner: Address, operator: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      operator: Address,
      options?: TransactionOptions
    ): Promise<boolean>;
  };

  name: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  symbol: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  tokenURI: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<string>;
  };
}

export interface ERC721MetadataContract {
  new: () => Promise<ERC721MetadataInstance>;
  deployed(): Promise<ERC721MetadataInstance>;
  at(address: string): ERC721MetadataInstance;
}

export interface ERC721ReceiverInstance extends ContractInstance {
  onERC721Received: {
    (
      from: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<string>;
  };
}

export interface ERC721ReceiverContract {
  new: () => Promise<ERC721ReceiverInstance>;
  deployed(): Promise<ERC721ReceiverInstance>;
  at(address: string): ERC721ReceiverInstance;
}

export interface ERC721TokenInstance extends ContractInstance {
  getApproved: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  approve: {
    (to: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  safeTransferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  exists: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<boolean>;
  };
  ownerOf: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  setApprovalForAll: {
    (to: Address, approved: boolean, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  isApprovedForAll: {
    (owner: Address, operator: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      operator: Address,
      options?: TransactionOptions
    ): Promise<boolean>;
  };

  name: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  symbol: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  tokenURI: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<string>;
  };
  tokenOfOwnerByIndex: {
    (owner: Address, index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  totalSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  tokenByIndex: {
    (index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
}

export interface ERC721TokenContract {
  new: (name: string, symbol: string) => Promise<ERC721TokenInstance>;
  deployed(): Promise<ERC721TokenInstance>;
  at(address: string): ERC721TokenInstance;
}

export interface ERC809Instance extends ContractInstance {
  name: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  getApproved: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  approve: {
    (to: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  totalSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  tokenOfOwnerByIndex: {
    (owner: Address, index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  safeTransferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  exists: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<boolean>;
  };
  tokenByIndex: {
    (index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  ownerOf: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  symbol: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  setApprovalForAll: {
    (
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  tokenURI: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<string>;
  };
  isApprovedForAll: {
    (owner: Address, operator: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      operator: Address,
      options?: TransactionOptions
    ): Promise<boolean>;
  };

  renterOf: {
    (tokenId: UInt, time: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      tokenId: UInt,
      time: UInt,
      options?: TransactionOptions
    ): Promise<Address>;
  };
  isAvailable: {
    (
      tokenId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      tokenId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  cancelAll: {
    (
      tokenId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      tokenId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  cancel: {
    (tokenId: UInt, reservationId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      tokenId: UInt,
      reservationId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface ERC809Contract {
  new: () => Promise<ERC809Instance>;
  deployed(): Promise<ERC809Instance>;
  at(address: string): ERC809Instance;
}

export interface ERC809ChildInstance extends ContractInstance {
  name: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  getApproved: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  approve: {
    (to: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  totalSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  tokenOfOwnerByIndex: {
    (owner: Address, index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  safeTransferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  exists: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<boolean>;
  };
  tokenByIndex: {
    (index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  ownerOf: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  symbol: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  setApprovalForAll: {
    (
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      operator: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  tokenURI: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<string>;
  };
  isApprovedForAll: {
    (owner: Address, operator: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      operator: Address,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
}

export interface ERC809ChildContract {
  new: () => Promise<ERC809ChildInstance>;
  deployed(): Promise<ERC809ChildInstance>;
  at(address: string): ERC809ChildInstance;
}

export interface MathUtilInstance extends ContractInstance {}

export interface MathUtilContract {
  new: () => Promise<MathUtilInstance>;
  deployed(): Promise<MathUtilInstance>;
  at(address: string): MathUtilInstance;
}

export interface MigrationsInstance extends ContractInstance {
  last_completed_migration: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  owner: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };

  setCompleted: {
    (completed: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      completed: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  upgrade: {
    (new_address: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      new_address: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface MigrationsContract {
  new: () => Promise<MigrationsInstance>;
  deployed(): Promise<MigrationsInstance>;
  at(address: string): MigrationsInstance;
}

export interface OwnableInstance extends ContractInstance {
  owner: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };

  renounceOwnership: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
  };
  transferOwnership: {
    (newOwner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newOwner: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface OwnableContract {
  new: () => Promise<OwnableInstance>;
  deployed(): Promise<OwnableInstance>;
  at(address: string): OwnableInstance;
}

export interface ReservationInstance extends ContractInstance {
  name: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  getApproved: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  approve: {
    (to: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  totalSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  calendarIds: {
    (unnamed2: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      unnamed2: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  tokenOfOwnerByIndex: {
    (owner: Address, index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  safeTransferFrom: {
    (
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      tokenId: UInt,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  exists: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<boolean>;
  };
  tokenByIndex: {
    (index: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      index: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  ownerOf: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<Address>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  renounceOwnership: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
  };
  owner: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  symbol: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  stopTimestamps: {
    (unnamed3: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      unnamed3: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  setApprovalForAll: {
    (to: Address, approved: boolean, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      approved: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  startTimestamps: {
    (unnamed4: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      unnamed4: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  tokenURI: {
    (tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(tokenId: UInt, options?: TransactionOptions): Promise<string>;
  };
  isApprovedForAll: {
    (owner: Address, operator: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      operator: Address,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  transferOwnership: {
    (newOwner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newOwner: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };

  reserve: {
    (
      to: Address,
      calendarId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      to: Address,
      calendarId: UInt,
      start: UInt,
      stop: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  cancel: {
    (owner: Address, tokenId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      tokenId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface ReservationContract {
  new: () => Promise<ReservationInstance>;
  deployed(): Promise<ReservationInstance>;
  at(address: string): ReservationInstance;
}

export interface SafeMathInstance extends ContractInstance {}

export interface SafeMathContract {
  new: () => Promise<SafeMathInstance>;
  deployed(): Promise<SafeMathInstance>;
  at(address: string): SafeMathInstance;
}

export interface TreeMapInstance extends ContractInstance {}

export interface TreeMapContract {
  new: () => Promise<TreeMapInstance>;
  deployed(): Promise<TreeMapInstance>;
  at(address: string): TreeMapInstance;
}
