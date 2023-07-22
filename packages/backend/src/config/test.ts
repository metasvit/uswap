import { ConfigOverride } from "./types";

export default function getTestConfigOverride(): ConfigOverride {
  return {
    APP_ENV: "test",
  };
}
