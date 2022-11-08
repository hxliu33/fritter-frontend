import type {Request, Response} from 'express';
import express from 'express';
import FontSwitchCollection from './collection';
import * as fontSwitchValidator from '../fontswitch/middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get the current font setting
 *
 * @name GET /api/font
 *
 * @return {string} - The data of the current font
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user does not have an existing font switch setting
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    fontSwitchValidator.isFontSwitchExists,
  ],
  async (req: Request, res: Response) => {
    const fontSwitch = await FontSwitchCollection.findOneByUserId(req.session.userId as string);
    res.status(200).json({
        message: 'The current font was fetched successfully',
        currentFontId: fontSwitch.currentFontId,
        currentFontName: fontSwitch.currentFontName,
    });
  }
);

/**
 * Create a new font switch setting, with Verdana set as the current font
 *
 * @name POST /api/font
 *
 * @return {FontSwitchResponse} - The created font switch setting
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const fontId = 'verdana';
    const fontName = 'Verdana';
    const fontSwitch = await FontSwitchCollection.addOne(userId, fontId, fontName);

    res.status(201).json({
      message: 'Your font switch setting was created successfully.',
      fontSwitch: util.constructFontSwitchResponse(fontSwitch)
    });
  }
);

/**
 * Modify the current used font to replace with a new preexisting one
 *
 * @name PATCH /api/font/current
 *
 * @param {string} font - The name of the font to make current
 * @return {FontSwitchResponse} - The updated font switch setting
 * @throws {403} - If the user is not logged in
 * @throws {404} - If font is empty or no font switch setting exists for the user
 * @throws {409} - If the current font is already the new font
 */
 router.patch(
    '/current',
    [
      userValidator.isUserLoggedIn,
      fontSwitchValidator.isFontSwitchExists,
      fontSwitchValidator.isFontIdNotEmpty,
      fontSwitchValidator.isFontNameNotEmpty,
      fontSwitchValidator.isCurrentFontDifferent,
    ],
    async (req: Request, res: Response) => {
      const fontSwitchId = (await FontSwitchCollection.findOneByUserId(req.session.userId as string))._id;
      const fontSwitch = await FontSwitchCollection.updateOne(fontSwitchId, req.body.fontId as string, req.body.fontName as string);
      res.status(200).json({
        message: 'Your font switch setting was updated successfully.',
        fontSwitch: util.constructFontSwitchResponse(fontSwitch),
      });
    }
  );

export {router as fontSwitchRouter};
