import { IncomingMessage } from "http";
import { NextApiRequest } from "next/types";
import { Encryptions } from "../classes/Encryptions";

export const getUserID = async (req: IncomingMessage) => {
  if (!req.headers.authorization && !req.headers.cookie) {
    return null;
  }
  const token =
    req.headers?.authorization?.split(" ")?.[1] ||
    req.headers.cookie?.match(/auth_cookie=([^;]+)/)?.[1];
  if (!token) {
    return null;
  }
  const decoded = (await Encryptions.decryptUserToken(token).catch(
    () => null
  )) as string | null;
  return decoded;
};
