import express from "express";
import IdentitiesController from "./IdentitiesController";

export const IdentitiesRouter = express
  .Router({ mergeParams: true })
  .get("/identities", IdentitiesController.get);

export default IdentitiesRouter;