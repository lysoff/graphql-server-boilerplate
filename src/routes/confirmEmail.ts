import { Request, Response } from "express";
import { redis } from "../redis";
import { User } from "../entity/User";

export const confirmEmail = async (req: Request, res: Response) => {
  const userId = await redis.get(req.params.id);

  if (userId) {
    User.update({ id: userId }, { confirmed: true })
  }

  res.status(200).send("Confirmed");
}