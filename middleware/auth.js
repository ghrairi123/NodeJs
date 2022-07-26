const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ msg: "Invalid Authentication." });

    jwt.verify(
      token,
      "c#$Pv)fkxMr[u/K:)2&N?!%Wr~<Y)8^u=+B_V,xd;Aw&c=",
      (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Invalid Authentication." });

        req.user = user;
        next();
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
