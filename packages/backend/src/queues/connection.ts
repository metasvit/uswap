import IORedis from "ioredis";

const getConnection = (redisUrl: string) => {
  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  // BullMQ attaches a lot of listeners to redis client
  connection.setMaxListeners(1000);
  return connection;
};

export default getConnection;
