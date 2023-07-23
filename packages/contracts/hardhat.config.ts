import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-solhint";
import "hardhat-tracer";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: 0,
  },
  paths: {
    sources: "src",
  },
  networks: {
    chiado: {
      url: `https://rpc.chiadochain.net`,
      chainId: 10200,
      accounts: process.env.USWAP_TEST_PRIVATE_KEY
        ? [process.env.USWAP_TEST_PRIVATE_KEY]
        : undefined,
      loggingEnabled: true,
    },
    linea: {
      url: `https://linea-mainnet.infura.io/v3/${process.env.POLYGON_INFURA_KEY}`,
      chainId: 59144,
      accounts: process.env.USWAP_TEST_PRIVATE_KEY
        ? [process.env.USWAP_TEST_PRIVATE_KEY]
        : undefined,
      loggingEnabled: true,
    },
    lineaTestnet: {
      url: `https://rpc.goerli.linea.build`,
      chainId: 59140,
      accounts: process.env.USWAP_TEST_PRIVATE_KEY
        ? [process.env.USWAP_TEST_PRIVATE_KEY]
        : undefined,
      loggingEnabled: true,
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.POLYGON_INFURA_KEY}`,
      chainId: 137,
      accounts: process.env.USWAP_TEST_PRIVATE_KEY
        ? [process.env.USWAP_TEST_PRIVATE_KEY]
        : undefined,
      loggingEnabled: true,
    },
    mumbai: {
      url: `https://rpc.ankr.com/polygon_mumbai`,
      chainId: 80001,
      accounts: process.env.USWAP_TEST_PRIVATE_KEY
        ? [process.env.USWAP_TEST_PRIVATE_KEY]
        : undefined,
      loggingEnabled: true,
    },
    mantleTestnet: {
      url: `https://rpc.testnet.mantle.xyz`,
      chainId: 5001,
      accounts: process.env.USWAP_TEST_PRIVATE_KEY
        ? [process.env.USWAP_TEST_PRIVATE_KEY]
        : undefined,
      loggingEnabled: true,
    },
  },
};

export default config;
