import Joi from 'joi';

export const createVideoSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  thumbnail_url: Joi.string().uri().required(),
  duration: Joi.number().integer().positive().required(),
  views: Joi.number().integer().min(0).optional(),
  tags: Joi.array().items(Joi.string().min(1).max(50)).optional(),
});
