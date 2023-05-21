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
  MAINNET_API_KEY: '',
  GOERLI_API_KEY: '',
  MUMBAI_API_KEY: '',
  POLYGON_API_KEY: '',
  API_KEY: '',
}
export const getRPCProvider = (chainId: number) => {
  switch (chainId) {
    case 1:
      return `https://eth-mainnet.g.alchemy.com/v2/${MAINNET_API_KEY}`;
    case 5:
      return `https://eth-goerli.alchemyapi.io/v2/${GOERLI_API_KEY}`;
    case 80001:
      return `https://polygon-mumbai.g.alchemy.com/v2/${MUMBAI_API_KEY}`;
    case 137:
      return `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_API_KEY}`;
    case 42161:
      return `https://rpc.ankr.com/arbitrum`
    default:
      return `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`;
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