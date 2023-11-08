const { Schema, model } = require("mongoose");
const options = { versionKey: false, timestamps: true };
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");
const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      // match: /^\d{3} \d{3}-\d{4}$/,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  options
);
const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
const schemas = { addSchema, contactSchema, updateStatusSchema };
contactSchema.post("save", handleMongooseError);
const Contact = model("contact", contactSchema);
module.exports = { Contact, schemas };
