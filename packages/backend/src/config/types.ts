import { NetworkEnum } from "@1inch/fusion-sdk";
import { DeepPartial, Immutable } from "src/types";

export type AppEnv = "dev" | "test" | "prod";

export enum Network {
  MAINNET = NetworkEnum.ETHEREUM,
}

export type NetworkConfig = {
  CHAIN_ID: number;
};

export type Config = {
  APP_ENV: AppEnv;
  PORT: number;
  REDIS_URL: string;
  BULL: {
    ENABLE: boolean;
    ADMIN_PASSWORD: string | null;
    REPEATABLE_JOBS_ENABLE: boolean;
  };
  FUSION_API_URL: string;
  FUSION_WS_URL: string;
  NETWORKS: Record<Network, NetworkConfig>;
};

export type ImmutableConfig = Immutable<Config>;

export type ConfigOverride = DeepPartial<Config>;
