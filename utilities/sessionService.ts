import jwt_decode from "jwt-decode";
import { JwtPayload, Session } from "../types";

const set = (session: Session) => {
  localStorage.setItem("session", JSON.stringify(session));
};

const find = () => {
  const session = localStorage.getItem("session");

  if (session) {
    const data = JSON.parse(session) as Session;
    const exp = jwt_decode<JwtPayload>(data.token).exp;
    const currentTime = Math.floor(Date.now() / 1000);
    if (exp < currentTime) {
      revoke();
      return null;
    } else {
      return data;
    }
  } else {
    return null;
  }
};

const revoke = () => {
  localStorage.removeItem("session");
};

const session = {
  set,
  find,
  revoke,
};

export default session;