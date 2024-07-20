import { compare } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next/types";
import { Encryptions } from "../../../utils/classes/Encryptions";
import {
  getUser,
  getUserByEmail,
} from "../../../utils/ServersideHelpers/getUser";
import { GivenUser } from "../../../utils/types/user";

export type LoginResultResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: GivenUser;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResultResponse>
) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
      });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const passwordMatch = await compare(password, user.password || "");
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }
    delete user.password;
    const token = await Encryptions.issueUserToken(user._id);
    res.setHeader(
      "Set-Cookie",
      `auth_cookie=${token};Max-Age=2592000;Path=/;SameSite=Strict`
    );
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token: token,
    });
  }
}
