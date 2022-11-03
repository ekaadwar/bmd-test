const jwt = require("jsonwebtoken");
const { response } = require("../helpers/standardResponse");

const auth = (req, res, next) => {
  if (req.headers?.authorization) {
    if (req.headers.authorization.startsWith("Bearer")) {
      try {
        const token = req.headers.authorization.slice(7);
        const user = jwt.verify(token, process.env.APP_KEY);
        req.authUser = user;
        next();
      } catch (error) {
        return response(res, 400, false, "You must login first..");
      }
    }
  } else {
    return response(res, 400, false, "Auth token needed!");
  }
};

module.exports = auth;
