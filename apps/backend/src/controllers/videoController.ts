import { Router, Request, Response, NextFunction } from 'express';
import { videoService } from '../services/videoService';
import { validateRequest } from '../middleware/validation';
import {
  createVideoSchema,
  getVideosQuerySchema,
} from '../schemas/videoSchemas';
import { decodeCursor, encodeCursor } from '../middleware/cursor';
import { VideoSortField, SortOrder } from '@video-dashboard/shared-types';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the video
 *         title:
 *           type: string
 *           description: Title of the video
 *         thumbnail_url:
 *           type: string
 *           format: uri
 *           description: URL of the video thumbnail
 *         duration:
 *           type: integer
 *           description: Duration of the video in seconds
 *         views:
 *           type: integer
 *           description: Number of views
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               tag:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *     CreateVideoRequest:
 *       type: object
 *       required:
 *         - title
 *         - thumbnail_url
 *         - duration
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Title of the video
 *         thumbnail_url:
 *           type: string
 *           format: uri
 *           description: URL of the video thumbnail
 *         duration:
 *           type: integer
 *           minimum: 1
 *           description: Duration of the video in seconds
 *         views:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           description: Number of views
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *             minLength: 1
 *             maxLength: 50
 *           description: Array of tag names
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         details:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/videos:
 *   post:
 *     summary: Create a new video
 *     description: Creates a new video with optional tags
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVideoRequest'
 *           example:
 *             title: "My Awesome Video"
 *             thumbnail_url: "https://example.com/thumbnail.jpg"
 *             duration: 300
 *             views: 0
 *             tags: ["tutorial", "javascript"]
 *     responses:
 *       201:
 *         description: Video created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Get videos with cursor-based pagination
 *     description: Retrieves a paginated list of videos with cursor-based pagination
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 30
 *         description: Number of videos to return
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [created_at, title, views, duration]
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *         description: Additional filters
 *     responses:
 *       200:
 *         description: Videos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 *                 next_cursor:
 *                   type: string
 *                   nullable: true
 *                 has_more:
 *                   type: boolean
 *                 cursor_version:
 *                   type: integer
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/videos',
  validateRequest(getVideosQuerySchema, 'query'),
  decodeCursor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParams = {
        limit: req.query.limit ? parseInt(req.query.limit as string) : 30,
        sortBy:
          (req.query.sortBy as VideoSortField) || VideoSortField.CREATED_AT,
        sortOrder: (req.query.sortOrder as SortOrder) || SortOrder.DESC,
        filters: req.query.filters as string,
      };

      const videos = await videoService.getVideos(
        queryParams,
        res.locals.decodedCursor
      );
      res.locals.responseData = { items: videos };
      next();
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: ['Failed to fetch videos'],
      });
    }
  },
  encodeCursor
);

router.post(
  '/videos',
  validateRequest(createVideoSchema),
  async (req: Request, res: Response) => {
    try {
      const video = await videoService.createVideo(req.body);
      res.status(201).json(video);
    } catch (error) {
      console.error('Error creating video:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: ['Failed to create video'],
      });
    }
  }
);

export { router as videoController };
