var jwt = require("jsonwebtoken");
const jwt_script = "adarshisagood$oy";

const fetchuser = (req, res, next) => {
  // get the user form the jwt token
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticate using a valid token " });
  }
  try {
    const data = jwt.verify(token, jwt_script);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate using a valid token " });
  }
};
module.exports = fetchuser;
