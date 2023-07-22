import { Config, Network } from "./types";

export default function getDefaultConfig(): Config {
  return {
    APP_ENV: "dev",
    PORT: 4500,
    REDIS_URL: "redis://127.0.0.1:6379",
    BULL: {
      ENABLE: true,
      ADMIN_PASSWORD: null,
      REPEATABLE_JOBS_ENABLE: true,
    },
    FUSION_API_URL: "https://fusion.1inch.io",
    FUSION_WS_URL: "wss://fusion.1inch.io/ws",
    NETWORKS: {
      [Network.MAINNET]: {
        CHAIN_ID: Network.MAINNET
      },
    },
  };
}
