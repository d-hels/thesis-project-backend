import passportJWT from "passport-jwt";
import dotenv from "dotenv";
import { getUserById } from "../db/queries/authQueries";
dotenv.config();

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

let strategy = new JwtStrategy(jwtOptions, async function (jwt_payload, next) {
  const user = await getUserById(jwt_payload.id);
  if (user) {
    next(null, user);
  } else {
    next(null, false, { message: "invalid token" });
  }
});

export { strategy };
