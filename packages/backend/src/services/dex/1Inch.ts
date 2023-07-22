import axios from "axios";

export const OneInch = {
  getQuote: async (fromAsset: string, toAsset: string, amount: BigInt) => {
    const result = {
      name: "1Inch",
      data: {},
      status: "SUCCESS",
    };

    try {
      const params = `src=${fromAsset}&dst=${toAsset}&amount=${amount.toString()}&includeProtocols=true&includeGas=true`;
      const priceUrl = `https://api.1inch.dev/swap/v5.2/1/quote?${params}`;
      const { data } = await axios.get(priceUrl, {
        headers: { Authorization: `Bearer ${process.env.ONEINCH_API_KEY}` },
      });

      result.data = data;
      return result;
    } catch (e) {
      console.log(e);
      result.status = "FAILED";
      return result;
    }
  },
};

export default OneInch;
