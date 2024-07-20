import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserID } from "../../../utils/Clients/AuthManager";
import { cleanUser, getUser } from "../../../utils/ServersideHelpers/getUser";
import { GivenUser } from "../../../utils/types/user";
type NotFoundResponse = null;
export type SelfUserResponse = GivenUser | NotFoundResponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SelfUserResponse>
) {
  if (req.method === "GET") {
    const userID = req.query.user as string;
    if (!ObjectId.isValid(userID)) {
      return res.status(404).json(null);
    }
    console.log(userID);
    if (!userID) {
      return res.status(401).json(null);
    }
    const user = cleanUser(await getUser(userID));
    if (!user) {
      return res.status(404).json(null);
    }
    return res.status(200).json(user);
  }
}
