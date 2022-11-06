import type {Request, Response, NextFunction} from 'express';
import FontSwitchCollection from './collection';

/**
 * Checks if a font switch setting with the current user exists
 */
 const isFontSwitchExists = async (req: Request, res: Response, next: NextFunction) => {
  
  const fontSwitch = await FontSwitchCollection.findOneByUserId(req.session.userId as string);

  if (fontSwitch) {
    next();
  } else {
    res.status(404).json({error: 'No font switch setting exists for the user.'});
  }
};

/**
 * Checks if the fontId in req.body is not a stream of empty spaces
 */
 const isFontIdNotEmpty = async (req: Request, res: Response, next: NextFunction) => {
    const {fontId} = req.body as {fontId: string};
    if (!fontId.trim()) {
      res.status(404).json({
        error: 'Font ID to remove must not be empty.'
      });
      return;
    }

    next();
  };
  
/**
 * Checks if the fontName in req.body is not a stream of empty spaces
 */
 const isFontNameNotEmpty = async (req: Request, res: Response, next: NextFunction) => {
  const {fontName} = req.body as {fontName: string};
  if (!fontName.trim()) {
    res.status(404).json({
      error: 'Font name to remove must not be empty.'
    });
    return;
  }

  next();
};

/**
 * Checks if the font in req.body is different from the current one
 */
 const isCurrentFontDifferent = async (req: Request, res: Response, next: NextFunction) => {
    const {fontId} = req.body as {fontId: string};    
    const currentFontId = (await FontSwitchCollection.findOneByUserId(req.session.userId as string)).currentFontId;
    if (currentFontId.trim() === fontId.trim()) {
      res.status(409).json({
        error: 'The font in question is already the current font.'
      });
      return;
    }
  
    next();
  };

export {
  isFontSwitchExists,
  isFontIdNotEmpty,
  isFontNameNotEmpty,
  isCurrentFontDifferent,
};
