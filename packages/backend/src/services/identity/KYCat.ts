import axios from "axios";

export const KYCat = {
  getID: async (address: string) => {
    const result = {
      name: "kyCat",
      data: {},
      status: "SUCCESS",
    };

    try {
      const url = `https://api.knowyourcat.id/v1/${address}`;
      const { data } = await axios.get(url);
      result.data = data;
      return result;
    } catch (e) {
      console.log(e);
      result.status = "FAILED";
      return result;
    }
  },
};

export default KYCat;
