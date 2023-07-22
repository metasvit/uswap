import { ConfigOverride } from "./types";

export default function getDevConfigOverride(): ConfigOverride {
  return {
    APP_ENV: "dev",
  };
}
