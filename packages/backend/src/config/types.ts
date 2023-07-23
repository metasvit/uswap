import { DeepPartial, Immutable } from "src/types";

export type AppEnv = "dev" | "test" | "prod";

export type Config = {
  APP_ENV: AppEnv;
  PORT: number;
};

export type ImmutableConfig = Immutable<Config>;

export type ConfigOverride = DeepPartial<Config>;
