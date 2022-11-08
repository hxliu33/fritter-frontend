import type {Request, Response} from 'express';
import express from 'express';
import PauseCollection from './collection';
import * as pauseValidator from '../pause/middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get the pause setting
 *
 * @name GET /api/pause
 *
 * @return {PauseResponse} - A pause setting
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user does not have an existing pause setting
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    pauseValidator.isPauseExists,
  ],
  async (req: Request, res: Response) => {
    const pause = await PauseCollection.findOneByUserId(req.session.userId as string);
    res.status(200).json(util.constructPauseResponse(pause));
  }
);

/**
 * Create a new pause setting.
 *
 * @name POST /api/pause
 *
 * @param {number} threshold - The number of minutes the user wants to be active in their current session before receiving a paise notification
 * @return {PauseResponse} - The created pause setting
 * @throws {403} - If the user is not logged in
 * @throws {400} - If threshold is empty or not a number
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    pauseValidator.isValidPauseContent,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const threshold = (req.body.threshold as number);
    const pause = await PauseCollection.addOne(userId, threshold);

    res.status(201).json({
      message: 'Your pause setting was created successfully.',
      pause: util.constructPauseResponse(pause)
    });
  }
);

/**
 * Modify a pause setting's threshold
 *
 * @name PATCH /api/pause/threshold
 *
 * @param {string} minutes - The number of minutes the user wants to be active in their current session before receiving a paise notification
 * @return {PauseResponse} - The updated pause setting
 * @throws {403} - If the user is not logged in
 * @throws {400} - If time is empty or not a number
 */
 router.patch(
    '/threshold',
    [
      userValidator.isUserLoggedIn,
      pauseValidator.isValidTime,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? '';
      const threshold = (req.body.minutes as number);
      const pauseId = (await PauseCollection.findOneByUserId(userId))._id;
      const pause = await PauseCollection.updateOneThreshold(pauseId, threshold);
      res.status(200).json({
        message: 'Your pause setting was updated successfully.',
        pause: util.constructPauseResponse(pause)
      });
    }
  );

export {router as pauseRouter};
