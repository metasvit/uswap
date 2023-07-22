import { Request, Response } from "express";
import tokens from "src/config/tokens";

export const QuotesController = {
  get: async (req: Request, res: Response) => {
    res.json(tokens);
  },
};

export default QuotesController;
