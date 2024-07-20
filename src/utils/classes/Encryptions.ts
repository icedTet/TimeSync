import jwt, { JwtPayload } from "jsonwebtoken";
export enum UserTokenTypes {
  USER = 0,
  OAUTH = 1,
}
export class Encryptions {
  /**
   * Signs a payload with the JWT secret
   * @param {string|object|Buffer} payload
   * @return {Promise<String>}
   */
  static encrypt(payload: string | object | Buffer) {
    return new Promise((res, rej) =>
      jwt.sign(
        payload,
        Buffer.from(process.env.JWT_SECRET!, "base64").toString("ascii"),
        { algorithm: "RS512" },
        (er, encrypted) => (er ? rej(er) : res(encrypted))
      )
    );
  }
  /**
   * Decrypts a payload with the JWT secret
   * @param {string} encryptedPayload
   * @return {Promise<string|object|Buffer>}
   */
  static decrypt(encryptedPayload: string) {
    return new Promise((res, rej) =>
      jwt.verify(
        encryptedPayload,
        Buffer.from(process.env.JWT_SECRET!, "base64").toString("ascii"),
        { algorithms: ["RS512"], ignoreExpiration: false },
        (er, decrypted) => (er ? rej(er) : res(decrypted as any))
      )
    ) as Promise<{
      data: Partial<{
        tokenType: UserTokenTypes.USER;
        userID: string;
      }>;
      exp: number;
    }>;
  }
  static async decryptUserToken(encryptedPayload: string) {
    let decrypted = await this.decrypt(encryptedPayload).catch((er) => {
      throw er;
    });
    if (decrypted.data.tokenType !== UserTokenTypes.USER) {
      throw new Error("Invalid token type");
    }
    return decrypted.data.userID;
  }

  /**
   * Issues a JWT token with the userID. Expires in 1 month or whatever specified in seconds
   * @param {string} userID
   * @param {number} expiration
   * @return {Promise<string>}
   */
  static issueUserToken(userID: any, expiration = 2700000): Promise<string> {
    let payload = {
      data: {
        tokenType: UserTokenTypes.USER,
        userID: userID,
      },
      exp: Math.floor(Date.now() / 1000) + expiration,
    };
    return this.encrypt(payload) as Promise<string>;
  }
}
/**
 * @typedef {Object} UserPayload
 * @property {string} userID
 * @property {number} tokenType
 */
