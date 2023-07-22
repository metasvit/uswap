import { Request, Response } from "express";
import { Binance } from "src/services/cex";

export const QuotesController = {
  get: async (req: Request, res: Response) => {
    const { address } = req.query as {
      address: string | string[] | undefined;
    };
    // if (!address) {
    //   res.status(400).json({ error: "address is required" });
    //   return;
    // }

    const data = await Binance.default.getQuote("BTC", "USDT");
    res.json(data);
  },
};

export default QuotesController;
