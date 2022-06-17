import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { UuidUtils } from "../utils/UuidUtils";
import { User } from "../models/db-01/User";
import { Request, Response, NextFunction } from "express";

export const blocked_token: string[] = [];

export interface AuthorizedRequest extends Request {
  authorization: string;
  reqUser: Object;
  fetchReqUser: (options?: any) => Promise<User>;
}

const _parseToken = (req: Request) => {
  const token: string = req.get("Authorization") || req.query["Authorization"] || req.body["Authorization"];
  if (!token) return null;
  return token.replace("Bearer", "").replace(/\s/g, "");
};

export const authorization = (props: any) => (req: Request, res: Response, next: NextFunction) => {
  const token = _parseToken(req);
  if (!token) {
    console.warn("Token is not exists");
    return res.sendStatus(401);
  }

  const secret_key = require("../config/jwt-secret-key");
  jwt.verify(token, secret_key, (error: VerifyErrors | any | null, decoded: any) => {
    if (error) {
      switch (error.name) {
        case "TokenExpiredError": {
          // Token 만료
          console.warn("Token expired");
          return res.status(401).json({ code: "TOKEN_EXPIRED" });
        }
        case "NotBeforeError": {
          // Token is not activated(사용 가능 시간전임)
          console.warn("Token is not activated");
          return res.status(401).json({ code: "TOKEN_NOT_ACTIVATED", message: `Retry after ${error.date}` });
        }
        case "JsonWebTokenError": {
          // Invalid token
          console.warn("Invalid token");
          return res.status(401).json({ code: "INVALID_TOKEN" });
        }
        default: {
          // Unknown error
          console.warn("JWT verify problem", error);
          return res.status(401).json({ code: "VERIFY_TOKEN_FAILED" });
        }
      }
    }

    if (blocked_token.includes(token)) {
      return res.status(401).json({ code: "TOKEN_BLOCKED" });
    }

    if (props) {
      if (props.hasOwnProperty("allow_type")) {
        if (Array.isArray(props.allow_type)) {
          if (!props.allow_type.includes(decoded.type)) {
            console.log(`User type ${decoded.type} not contains allow_type(${props.allow_type})`);
            return res.status(403).json({ code: "ACCESS_DENIED" });
          }
        } else {
          if (props.allow_type !== decoded.type) {
            console.log(`User type(${decoded.type}) not equals with allow_type(${props.allow_type})`);
            return res.status(403).json({ code: "ACCESS_DENIED" });
          }
        }
      }
    }

    // @ts-ignore
    const new_req: AuthorizedRequest = req;
    new_req.authorization = token;
    new_req.reqUser = decoded;
    new_req.fetchReqUser = (options) => User.findOne({ where: { uuid: UuidUtils.toBuffer(decoded.uuid) }, ...options });
    next();
  });
};
