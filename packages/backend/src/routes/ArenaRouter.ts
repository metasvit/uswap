import Arena from "bull-arena";
import express from "express";
import getConfig from "../config";
import * as Queues from "../queues";
import BaseQueue from "../queues/BaseQueue";
import { DelayedQueue } from "../queues";

const arena = Arena(
  {
    queues: Object.values(Queues)
      .filter((queue) => queue instanceof BaseQueue)
      .map((queue) => ({
        hostId: "main",
        name: queue.name,
        url: getConfig().REDIS_URL as string,
        type: "bullmq",
      })),
    BullMQ: DelayedQueue,
  },
  {
    basePath: "/",
    disableListen: true,
  }
);

// https://github.com/bee-queue/arena/pull/123
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(arena as any).locals.appBasePath = "/api/bull";

export default express.Router().use(
  "/api/bull",
  (req, res, next) => {
    const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
    const [, password] = new Buffer(b64auth, "base64").toString().split(":");

    if (getConfig().APP_ENV === "prod" && !req.secure) {
      return res.set(401).send("Requires HTTPS");
    }

    if (
      getConfig().BULL.ADMIN_PASSWORD === null ||
      getConfig().BULL.ADMIN_PASSWORD === password
    ) {
      return next();
    }

    res.set("WWW-Authenticate", 'Basic realm="401"');
    res.status(401).send("Authentication required.");
  },
  arena
);
