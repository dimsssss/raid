const Joi = require('joi')

const getSchema = Joi.object({
  userId: Joi.number().min(1),
})

const getValidator = (req, res, next) => {
  const result = getSchema.validate(req.params)
  return next(result, req, res, next)
}

module.exports = {
  getValidator,
}
