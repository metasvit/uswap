import { Config } from "./types";

export default function getDefaultConfig(): Config {
  return {
    APP_ENV: "dev",
    PORT: 4500,
  };
}
