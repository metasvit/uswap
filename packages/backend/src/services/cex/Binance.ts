import axios from "axios";
const crypto = require("crypto");

export const Binance = {
  getQuote: async (fromAsset: string, toAsset: string) => {
    const [price, exchange, fee] = await Promise.all([
      Binance.getPrice(fromAsset, toAsset),
      Binance.getExchangeInfo(fromAsset, toAsset),
      await Binance.getTradeFee(fromAsset, toAsset),
    ]);
    return {
      price,
      exchange,
      fee,
    };
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
