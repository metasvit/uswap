import express from "express";
import TokensController from "./TokensController";

export const QuotesRouter = express
  .Router({ mergeParams: true })
  .get("/tokens", TokensController.get);

export default QuotesRouter;
