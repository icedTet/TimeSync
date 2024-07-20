import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserID } from "../../../../utils/Clients/AuthManager";
import Mongo from "../../../../utils/Clients/Mongo";
import {
  getUser,
  updateUser,
} from "../../../../utils/ServersideHelpers/getUser";
import { GivenUser, User } from "../../../../utils/types/user";
type NotFoundResponse = null;
export type SelfUserResponse = GivenUser | NotFoundResponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SelfUserResponse>
) {
  if (req.method === "POST") {
    const data = req.body.base64 as string;
    if (!data) {
      console.log("No image", { body: req.body });
      return res.status(400).json(null);
    }
    if (data.length >= 10000000) {
      console.log("Image too large");
      return res.status(400).json(null);
    }

    const userID = await getUserID(req);
    if (!userID) {
      return res.status(401).json(null);
    }
    const user = await getUser(userID);
    if (!user) {
      return res.status(404).json(null);
    }

    const upload = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "POST",
        headers: {
          // use form
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          key: process.env.IMGBB_API_KEY as string,
          image: data.replace(/^data:image\/\w+;base64,/, ""),
        }),
      }
    ).then((res) => res.json());
    console.log(upload, data.substring(0, 100));
    if (!upload.success) return res.status(500).json(null);
    await updateUser(userID, {
      pfp: upload.data.url,
    });
    return res.status(200).json({
      ...user,
      pfp: upload.data.url,
    });
  }
}
