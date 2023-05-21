export const ChainId = {
  MAINNET: 1, // Ethereum
  GOERLI: 5,
  POLYGON_MUMBAI: 80001,
  POLYGON_MAINNET: 137,
  ARBITRUM: 42161,
};

export let activeChainId = ChainId.ARBITRUM;
export const supportedChains = [
  ChainId.GOERLI,
  ChainId.POLYGON_MAINNET,
  ChainId.POLYGON_MUMBAI,
  ChainId.ARBITRUM,
];

const tempKeys = {
  MAINNET: '',
  GOERLI: '',
  MUMBAI: '',
  POLYGON: '',
  KEY: '',
}
export const getRPCProvider = (chainId: number) => {
  switch (chainId) {
    case 1:
      return `https://eth-mainnet.g.alchemy.com/v2/${tempKeys.MAINNET}`;
    case 5:
      return `https://eth-goerli.alchemyapi.io/v2/${tempKeys.GOERLI}`;
    case 80001:
      return `https://polygon-mumbai.g.alchemy.com/v2/${tempKeys.MUMBAI}`;
    case 137:
      return `https://polygon-mainnet.g.alchemy.com/v2/${tempKeys.POLYGON}`;
    case 42161:
      return `https://rpc.ankr.com/arbitrum`
    default:
      return `https://eth-mainnet.g.alchemy.com/v2/${tempKeys.KEY}`;
  }
};

export const getExplorer = (chainId: number) => {
  switch (chainId) {
    case 1:
      return "https://etherscan.io";
    case 5:
      return "https://goerli.etherscan.io";
    case 80001:
      return "https://mumbai.polygonscan.com";
    case 137:
      return "https://polygonscan.com";
    case 42161:
      return "https://arbiscan.io/"
    default:
      return "https://mumbai.polygonscan.com";
  }
};

export const getSupportedChains = () => {};