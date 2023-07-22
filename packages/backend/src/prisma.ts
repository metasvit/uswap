import { PrismaClient } from "@prisma/client";
import logger from "./logger";

const prisma = new PrismaClient();
logger.info("Prisma client initialized");

export default prisma;
