import Joi from 'joi';
import { VideoSortField, SortOrder } from '@video-dashboard/shared-types';

export const createVideoSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  thumbnail_url: Joi.string().uri().allow('').optional(),
  duration: Joi.number().integer().positive().required(),
  views: Joi.number().integer().min(0).optional(),
  tags: Joi.array().items(Joi.string().min(1).max(50)).optional(),
});

export const getVideosQuerySchema = Joi.object({
  cursor: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(100).default(30),
  sortBy: Joi.string()
    .valid(...Object.values(VideoSortField))
    .default(VideoSortField.CREATED_AT),
  sortOrder: Joi.string()
    .valid(...Object.values(SortOrder))
    .default(SortOrder.DESC),
  filters: Joi.string().optional(),
});
