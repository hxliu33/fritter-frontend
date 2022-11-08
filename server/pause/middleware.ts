import type {Request, Response, NextFunction} from 'express';
import PauseCollection from './collection';

/**
 * Checks if a pause setting with the current user exists
 */
 const isPauseExists = async (req: Request, res: Response, next: NextFunction) => {
  
  const pause = await PauseCollection.findOneByUserId(req.session.userId as string);

  if (pause) {
    next();
  } else {
    res.status(404).json({error: 'No pause setting exists for the user.'});
  }
};

/**
 * Checks if the content of the pause setting in req.body is valid, i.e not empty
 */
const isValidPauseContent = async (req: Request, res: Response, next: NextFunction) => {
  const {threshold} = req.body as {threshold: number};

  if (isNaN(+threshold)) {
    res.status(400).json({
      error: 'Pause threshold must be a number.'
    });
    return;
  }

  next();
};

/**
 * Checks if the time passed into req.body is valid, i.e not a stream of empty
 * spaces and numbers
 */
 const isValidTime = async (req: Request, res: Response, next: NextFunction) => {
    const {minutes} = req.body as {minutes: string};
    if (!minutes.trim()) {
      res.status(400).json({
        error: 'Time must be at least one number long.'
      });
      return;
    }
    
    if (isNaN(+minutes)) {
      res.status(400).json({
        error: 'Time must be a number.'
      });
      return;
    }
  
    next();
};

export {
  isPauseExists,
  isValidPauseContent,
  isValidTime,
};
