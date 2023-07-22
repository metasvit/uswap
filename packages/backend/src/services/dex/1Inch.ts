import axios from "axios";

export const OneInch = {
  getQuote: async (fromAsset: string, toAsset: string, amount: string) => {
    const priceUrl = `https://api.1inch.dev/swap/v5.2/1/quote?src=${fromAsset}&dst=${toAsset}&amount=${amount}&includeProtocols=true&includeGas=true`;
    const { data } = await axios.get(priceUrl, {
      headers: { Authorization: `Bearer ${process.env.ONEINCH_API_KEY}` },
    });
    return data;
  },
};

export default OneInch;
