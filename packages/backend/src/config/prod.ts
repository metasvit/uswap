import { ConfigOverride } from "./types";

export default function getProdConfigOverride(): ConfigOverride {
  return {
    APP_ENV: "prod",
  };
}
