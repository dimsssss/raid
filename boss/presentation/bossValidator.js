const Joi = require('joi')

const schema = Joi.object({
  userId: Joi.number().min(1),
  level: Joi.number().min(1),
})

const validator = (req, res, next) => {
  const result = schema.validate(req.query)
  next(result, req, res, next)
}

module.exports = {
  validator,
}
