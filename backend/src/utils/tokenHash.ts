//import CryptoJS from "crypto-js";
import crypto from "node:crypto";

//Refresh tokens stored in the DB are hashed. If the DB leaks, raw tokens are useless.
export const hashToken = (token: string): string => {
    //return CryptoJS.SHA256(token).toString(CryptoJS.enc.Hex);
    return crypto.createHash("sha256").update(token).digest("hex");
};
