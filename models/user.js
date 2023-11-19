const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const options = { versionKey: false, timestamps: true };
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
  },
  options
);
const registerSchema = Joi.object({
  // name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
const updateSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...["starter", "pro", "business"])
    .required(),
});
userSchema.post("save", handleMongooseError);
const schemas = {
  registerSchema,
  loginSchema,
  updateSubscription,
};
const User = model("user", userSchema);
module.exports = {
  User,
  schemas,
};
