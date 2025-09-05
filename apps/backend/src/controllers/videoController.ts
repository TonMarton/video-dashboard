import { Router, Request, Response } from 'express';
import { videoService } from '../services/videoService';
import { validateRequest } from '../middleware/validation';
import { createVideoSchema } from '../schemas/videoSchemas';

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
router.post('/videos', validateRequest(createVideoSchema), async (req: Request, res: Response) => {
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
});

export { router as videoController };
