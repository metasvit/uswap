import express from "express";
import QuotesController from "./QuotesController";

export const QuotesRouter = express
  .Router({ mergeParams: true })
  .get("/quotes", QuotesController.get);

export default QuotesRouter;
