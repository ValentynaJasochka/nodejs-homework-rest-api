const { HttpError } = require("../helpers");
const validateBody = (schema) => {
  const validator = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, "missing fields"));
    }
    next();
  };
  return validator;
};
module.exports = validateBody;
