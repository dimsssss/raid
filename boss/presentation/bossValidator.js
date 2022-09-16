const Joi = require('joi')

const postSchema = Joi.object({
  userId: Joi.number().min(1),
  level: Joi.number().min(1),
})

const postValidator = (req, res, next) => {
  const result = postSchema.validate(req.query)
  next(result, req, res, next)
}

const patchSchema = Joi.object({
  userId: Joi.number().min(1),
  raidRecordId: Joi.number().min(1),
})

const patchValidator = (req, res, next) => {
  const result = patchSchema.validate(req.query)
  next(result, req, res, next)
}

module.exports = {
  postValidator,
  patchValidator,
}
