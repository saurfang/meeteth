import Web3 from "web3";

type VortexContractProps = {
  contract: any;
  contract_name: string;
  contract_address: string;
  web3: Web3.EthApi;
};
