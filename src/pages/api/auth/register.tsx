// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { render } from "@react-email/render";
import type { NextApiRequest, NextApiResponse } from "next";
import Email from "../../../utils/Auth/VerifyEmail";
import Mongo from "../../../utils/Clients/Mongo";
import { UnverifiedUser, User } from "../../../utils/types/user";
import MailTransporter from "../../../utils/Clients/NodeMailer";
import { ObjectId } from "mongodb";
import { Encryptions } from "../../../utils/classes/Encryptions";
import bcrypt from "bcryptjs";
type RegisterSuccessful = {
  success: true;
  token: true;
};
type RegisterActionNeeded = {
  success: true;
  actionNeeded: true;
};
type RegisterFail = {
  success: false;
  error: string;
};

export type RegisterResultResponse =
  | RegisterSuccessful
  | RegisterActionNeeded
  | RegisterFail;

const handleSignupStage1 = async (
  req: NextApiRequest,
  res: NextApiResponse<RegisterResultResponse>
) => {
  const mongo = await Mongo;
  const db = mongo.db("UserData").collection("users");
  const unverifiedDb = mongo.db("UserData").collection("unverifiedUsers");
  const user = req.body.user as Partial<UnverifiedUser>;
  // if any of the fields are empty, return an error
  if (
    !user.username ||
    !user.email ||
    !user.password ||
    !user.firstName ||
    !user.lastName
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Please fill out all fields" });
  }
  const existingUsername =
    (await db.findOne({ username: user.username })) ||
    (await unverifiedDb.findOne({ email: user.username }));
  if (existingUsername) {
    return res
      .status(400)
      .json({ success: false, error: "Username already exists" });
  }
  const existingEmail =
    (await db.findOne({ email: user.email })) ||
    (await unverifiedDb.findOne({ email: user.email }));
  if (existingEmail) {
    return res
      .status(400)
      .json({ success: false, error: "Email already exists" });
  }
  // create unverified user
  const unverifiedUser = {
    username: user.username,
    email: user.email,
    password: await bcrypt.hash(user.password, 10),
    firstName: user.firstName,
    lastName: user.lastName,
  };
  await mongo
    .db("UserData")
    .collection("unverifiedUsers")
    .insertOne(unverifiedUser);
  // get the unverified user's id
  const unverifiedUserId = (
    await mongo
      .db("UserData")
      .collection("unverifiedUsers")
      .findOne({ username: user.username })
  )?._id;
  const renderedEmail = render(
    <Email
      name={`${user.firstName} ${user.lastName}`}
      username={user.username}
      email={user.email}
      url={`${process.env.SITE_URL}/api/auth/register?token=${unverifiedUserId}`}
    />
  );
  const result = await (
    await MailTransporter
  ).sendMail({
    from: '"John Li" <tet@tet.moe>', // sender address
    to: user.email, // list of receivers
    subject: "Verify your email", // Subject line
    text: "Hi there, please verify your email by clicking the link below.", // plain text body
    html: renderedEmail, // html body
  });
  return res.status(200).json({ success: true, actionNeeded: true });
};

const handleSignupStage2 = async (
  req: NextApiRequest,
  res: NextApiResponse<RegisterResultResponse>
) => {
  if (!req.query.token) {
    return res.redirect(`/auth/registerfailed?error=0`);
  }
  const mongo = await Mongo;
  // const db = mongo.db("UserData").collection("users");
  const unverifiedUser = await mongo
    .db("UserData")
    .collection("unverifiedUsers")
    .findOne({
      _id: new ObjectId(req.query.token as string),
    });
  if (!unverifiedUser) {
    return res.redirect(`/auth/registerfailed?error=1`)
  }
  const user = {
    username: unverifiedUser.username,
    email: unverifiedUser.email,
    password: unverifiedUser.password,
    firstName: unverifiedUser.firstName,
    lastName: unverifiedUser.lastName,
    createdAt: Date.now(),
    verifiedBy: "SignupSuccessful"
  } as Partial<User>;
  await mongo
    .db("UserData")
    .collection("users")
    .insertOne(user as any); // add as any because _id is not a valid property
  await mongo
    .db("UserData")
    .collection("unverifiedUsers")
    .deleteOne({ _id: new ObjectId(req.query.token as string) });
  const newUser = await mongo
    .db("UserData")
    .collection("users")
    .findOne({ username: user.username });
  const token = await Encryptions.issueUserToken(newUser!._id);
  return res.redirect(`/auth/next?token=${token}`);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResultResponse>
) {
  if (req.method === "POST") {
    return await handleSignupStage1(req, res);
  }
  if (req.method === "GET") {
    return await handleSignupStage2(req, res);
  }
}
