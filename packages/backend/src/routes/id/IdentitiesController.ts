import { Request, Response } from "express";
import { KYCat, Sismo, Worldcoin } from "src/services/identity";

export const IdentitiesController = {
  get: async (req: Request, res: Response) => {
    const { address } = req.query as {
      address: string | undefined;
    };

    if (!address) {
      res.status(400).json({ error: "Address is required" });
      return;
    }

    const [kyCat, sismo, worldcoin] = await Promise.all([
      KYCat.default.getID(address),
      Sismo.default.getID(address),
      Worldcoin.default.getID(address),
    ]);
    res.json([kyCat, sismo, worldcoin]);
  },
};

export default IdentitiesController;
