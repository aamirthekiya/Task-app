const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    // console.log(token);
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decode);
    const user = await User.findOne({ _id: decode.id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ Error: "Please Authenticate." });
  }
};

module.exports = auth;
