import { createClient } from "redis";
import getConfig from "./config";

// Redis client
export const redis = createClient({
  url: getConfig().REDIS_URL,
});

export default redis;
