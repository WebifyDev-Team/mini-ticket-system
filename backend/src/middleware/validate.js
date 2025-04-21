// backend/src/middleware/validate.js
const Joi = require('joi');

/**
 * Returns an Express middleware that validates req.body against the given Joi schema.
 */
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
}

module.exports = validate;
