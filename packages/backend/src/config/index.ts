import _ from "lodash";
import { AppEnv, ConfigOverride, ImmutableConfig } from "./types";
import getDefaultConfig from "./default";
import getTestConfigOverride from "./test";
import getDevConfigOverride from "./dev";
import getProdConfigOverride from "./prod";

function getAppEnv(): AppEnv {
  const appEnv = process.env.APP_ENV;
  if (
    appEnv !== "dev" &&
    appEnv !== "test" &&
    appEnv !== "prod"
  ) {
    throw new Error(
      "APP_ENV must be set to dev, test, prod"
    );
  }
  return appEnv;
}

async function getEnvConfigOverride(appEnv: AppEnv): Promise<ConfigOverride> {
  switch (appEnv) {
    case 'dev':
      return getDevConfigOverride();
    case 'prod':
      return getProdConfigOverride();
    default:
      throw new Error(`Unexpected "${appEnv}" environment`);
  }
}

let loadedConfig: ImmutableConfig | null =
  getAppEnv() === "test"
    ? _.merge(getDefaultConfig(), getTestConfigOverride())
    : null;

export async function loadConfig() {
  if (loadedConfig !== null) {
    return;
  }
  const appEnv = getAppEnv();
  const mergedConfig = _.merge(
    getDefaultConfig(),
    await getEnvConfigOverride(appEnv)
  );

  loadedConfig = mergedConfig;
}

export default function getConfig(): ImmutableConfig {
  if (loadedConfig === null) {
    throw new Error("loadConfig() needs to be called before getConfig()");
  }
  return loadedConfig;
}
