import { Request, Response } from "express";
import tokens from "src/config/tokens";
import { Binance } from "src/services/cex";
import { OneInch } from "src/services/dex";

export const QuotesController = {
  get: async (req: Request, res: Response) => {
    const { from, to, amount } = req.query as {
      from: string | undefined;
      to: string | undefined;
      amount: string | undefined;
    };

    const _tokens = tokens;
    const fromToken = _tokens.find((token) => token.symbol === from);
    const toToken = _tokens.find((token) => token.symbol === to);

    if (!fromToken || !toToken) {
      res.status(400).json({ error: "From and To token are invalid" });
      return;
    }

    const _amount = BigInt(amount || "");
    if (!_amount) {
      res.status(400).json({ error: "Amount is invalid" });
      return;
    }

    const binance = await Binance.default.getQuote(
      fromToken.rateSymbol,
      toToken.rateSymbol
    );
    const oneInch = await OneInch.default.getQuote(
      fromToken.address,
      toToken.address,
      _amount.toString()
    );
    res.json([binance, oneInch]);
  },
};

export default QuotesController;
