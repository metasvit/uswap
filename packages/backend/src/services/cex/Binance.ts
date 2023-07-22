import axios from "axios";
import { Big } from "bigdecimal.js";
import { Token } from "src/types";
const crypto = require("crypto");

const TARGET_DIGITS = 18;

const convertDigits = (_price: string, digits: number = 0) => {
  let price = Big(0);
  if (digits >= TARGET_DIGITS) {
    // Scale the returned price value down to Liquity's target precision
    price = Big(_price).divide(10 ** (digits - TARGET_DIGITS));
  } else if (digits < TARGET_DIGITS) {
    // Scale the returned price value up to Liquity's target precision
    price = Big(_price).multiply(10 ** (TARGET_DIGITS - digits));
  }
  return price;
};

export const Binance = {
  getQuote: async (fromToken: Token, toToken: Token, amount: BigInt) => {
    const result = {
      name: "Binance",
      data: {},
      status: "SUCCESS",
    };

    try {
      const [price, exchange, fee] = await Promise.all([
        Binance.getPrice(fromToken.rateSymbol, toToken.rateSymbol),
        Binance.getExchangeInfo(fromToken.rateSymbol, toToken.rateSymbol),
        Binance.getTradeFee(fromToken.rateSymbol, toToken.rateSymbol),
      ]);

      const _amount = convertDigits(price.price)
        .multiply(amount.toString())
        .divide(Big(10 ** fromToken.decimals));

      result.data = {
        toAmount: _amount
          .divide(Big(10 ** (TARGET_DIGITS - toToken.decimals)))
          .toBigInt()
          .toString(),
        price,
        exchange,
        fee,
      };
      return result;
    } catch (e) {
      console.log(e);
      result.status = "FAILED";
      return result;
    }
  },

  getPrice: async (fromAsset: string, toAsset: string) => {
    const priceUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${fromAsset}${toAsset}`;
    const { data } = await axios.get(priceUrl);
    return data;
  },

  getExchangeInfo: async (fromAsset: string, toAsset: string) => {
    const params = {
      fromAsset,
      toAsset,
      recvWindow: 5000,
      timestamp: Date.now(),
    };
    const paramsString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const signature = crypto
      .createHmac("sha256", process.env.BINANCE_SECRET_KEY)
      .update(paramsString)
      .digest("hex");

    const exchangeInfoUrl = `https://api.binance.com/sapi/v1/convert/exchangeInfo?${paramsString}&signature=${signature}`;
    const { data } = await axios.get(exchangeInfoUrl, {
      headers: {
        "X-MBX-APIKEY": process.env.BINANCE_API_KEY,
      },
    });
    return data;
  },

  getTradeFee: async (fromAsset: string, toAsset: string) => {
    const params = {
      symbol: `${fromAsset}${toAsset}`,
      recvWindow: 5000,
      timestamp: Date.now(),
    };
    const paramsString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const signature = crypto
      .createHmac("sha256", process.env.BINANCE_SECRET_KEY)
      .update(paramsString)
      .digest("hex");

    const tradeFeeUrl = `https://api.binance.com/sapi/v1/asset/tradeFee?${paramsString}&signature=${signature}`;
    const { data } = await axios.get(tradeFeeUrl, {
      headers: {
        "X-MBX-APIKEY": process.env.BINANCE_API_KEY,
      },
    });
    return data;
  },
};

export default Binance;
