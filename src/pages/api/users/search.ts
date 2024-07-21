import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserID } from "../../../utils/Clients/AuthManager";
import { cleanUser, getUser } from "../../../utils/ServersideHelpers/getUser";
import { GivenUser, PublicUser, User } from "../../../utils/types/user";
import Mongo from "../../../utils/Clients/Mongo";
type NotFoundResponse = null;
export type SelfUserResponse = PublicUser[] | NotFoundResponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SelfUserResponse>
) {
  if (req.method === "GET") {
    const queryTerm = req.query.query as string;
    if (!queryTerm) {
      return res.status(401).json([]);
    }
    const users = await (await Mongo)
      .db("UserData")
      .collection("users")
      .find({
        $or: [
          { username: { $regex: queryTerm, $options: "i" } },
          { firstName: { $regex: queryTerm, $options: "i" } },
            { lastName: { $regex: queryTerm, $options: "i" } },
        ],
      })
      .toArray()
      .then((users) =>
        users.map((user) =>
          cleanUser({ ...user, _id: user._id.toString() } as User)
        ).filter((user) => user) as PublicUser[]
      );

    if (!users) {
      return res.status(404).json([]);
    }
    return res.status(200).json(users);
  }
}
