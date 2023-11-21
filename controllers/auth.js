const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const jimp = require("jimp");
const { SECRET_KEY } = process.env;
const { HttpError, ctrlWrapper, standardizeImage } = require("../helpers");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("request");
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  console.log(avatarURL);
  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!user || !passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = { id: user.id };
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "30d" });
  await User.findByIdAndUpdate(user.id, { token });
  res.status(201).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};
const logout = async (req, res) => {
  const { _id: id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  res.status(204).json();
};
const updateSubscription = async (req, res) => {
  const { _id: id } = req.user;
  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json(user);
};
const avatarDir = path.join(__dirname, "../", "public", "avatars");
const updateAvatar = async (req, res, next) => {
  const { _id: id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  await standardizeImage(tmpUpload);
  const filename = `${id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatar", filename);
  await User.findByIdAndUpdate(id, { avatarURL });
  res.status(200).json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
