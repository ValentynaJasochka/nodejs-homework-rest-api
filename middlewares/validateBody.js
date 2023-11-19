const { HttpError } = require("../helpers");
const validateBody = (schema) => {
  const validator = (req, _, next) => {
    const { error } = schema.validate(req.body);
    // const message = error.details[0].message;
    if (error) {
      throw HttpError(400, error.message);
    }
    next();
  };
  return validator;
};
module.exports = validateBody;
