import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (
  schema: Joi.ObjectSchema,
  source: 'body' | 'query' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dataToValidate = source === 'query' ? req.query : req.body;
    const { error, value } = schema.validate(dataToValidate);

    if (error) {
      res.status(400).json({
        error: 'Bad request',
        details: error.details.map(detail => detail.message),
      });
      return;
    }

    if (source === 'body') {
      req.body = value;
    }

    next();
  };
};
