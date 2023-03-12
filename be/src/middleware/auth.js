const jwt = require("jsonwebtoken");
const User = require("../model/user");

//auth user and merchant

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (user.role === "hr") {
      req.hr = user;
      req.employee = user;
      next();
    }
    if (user.role === "employee") {
      req.hr = user;
      req.employee = user;
      next();
    }
    if (!user) {
      throw new Error("Not authenticated");
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).send({ error: "Invalid Token" });
  }
};
module.exports = auth;