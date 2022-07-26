const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const senEmail = require("./SendMail");

CLIENT_URL = "http://localhost:3000";
exports.SignUp = async (req, res) => {
  try {
    const { email, password, PhoneNumber } = req.body;

    if ((!email || !password, !PhoneNumber))
      return res.status(400).json({ msg: "Merci de remplir tous les champs." });

    if (!validateEmail(email))
      return res.status(400).json({ msg: "E-mails invalides." });
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Ce courriel existe déjà." });

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Le mot de passe doit être au moins de 6 caractères." });
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = {
      email,
      password: passwordHash,
      PhoneNumber,
    };
    const activation_token = createActivationToken(newUser);
    const url = `${"http://localhost:3000"}/user/activate/${activation_token}`;
    senEmail(email, url, "Verify your email address");

    res.json({
      msg: "Inscription réussie ! Veuillez activer votre e-mail pour commencer.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};
exports.activateEmail = async (req, res) => {
  try {
    const { activation_token } = req.body;
    const user = jwt.verify(
      activation_token,
      "c#$Pv)fkxMr[u/K:)2&N?!%Wr~<Y)8^u=+B_V,xd;Aw&c="
    );
    const { PhoneNumber, email, password } = user;

    const check = await User.findOne({ email });
    if (check)
      return res.status(400).json({ msg: "This email already exists." });
    const isVerified = true;
    const newUser = new User({
      PhoneNumber,
      email,
      password,
      isVerified,
    });

    await newUser.save();

    res.json({ msg: "Account has been activated!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Cet e-mail n'existe pas." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Le mot de passe est incorrect." });

    const refresh_token = createRefreshToken({ id: user._id });
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/auth/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ msg: "Connexion réussie !" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
exports.getAccessToken = (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

    jwt.verify(
      rf_token,
      "c#$Pv)fkxMr[u/K:)2&N?!%Wr~<Y)8^u=+B_V,xd;Aw&c=",
      (err, user) => {
        if (err) return res.status(400).json({ msg: "Please login now!" });

        const access_token = createAccessToken({ id: user.id });
        res.json({ access_token });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Cet e-mail n'existe pas." });
    const access_token = createAccessToken({ id: user._id });
    const url = `${CLIENT_URL}/user/reset/${access_token}`;
    senEmail(email, url, "réinitialisez votre mot de passe");
    res.json({
      msg: "Renvoyez le mot de passe, veuillez vérifier votre e-mail.",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log(password);
    const passwordHash = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        password: passwordHash,
      }
    );

    res.json({ msg: "Password successfully changed!" });
  } catch (err) {
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

const createRefreshToken = (payload) => {
  return jwt.sign(payload, "c#$Pv)fkxMr[u/K:)2&N?!%Wr~<Y)8^u=+B_V,xd;Aw&c=", {
    expiresIn: "7d",
  });
};
const createAccessToken = (payload) => {
  return jwt.sign(payload, "c#$Pv)fkxMr[u/K:)2&N?!%Wr~<Y)8^u=+B_V,xd;Aw&c=", {
    expiresIn: "15m",
  });
};
