const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const senEmail = require("./SendMail");

CLIENT_URL = "http://localhost:3000";
exports.SignUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Please fill in all fields." });

    if (!validateEmail(email))
      return res.status(400).json({ msg: "Invalid emails." });

    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ msg: "This email already exists." });

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = {
      email,
      password: passwordHash,
    };
    const activation_token = createActivationToken(newUser);
    const url = `${CLIENT_URL}/user/activate/${activation_token}`;
    senEmail(email, url, "Verify your email address");

    res.json({ msg: "Register Success! Please activate your email to start." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
const createActivationToken = (payload) => {
  return jwt.sign(payload, "c#$Pv)fkxMr[u/K:)2&N?!%Wr~<Y)8^u=+B_V,xd;Aw&c=", {
    expiresIn: "5m",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
