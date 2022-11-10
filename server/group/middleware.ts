import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import GroupCollection from '../group/collection';

/**
 * Checks if a name in req.body is already in use
 */
const isNameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOneByName(req.body.name);

  if (group) {
    res.status(409).json({
      error: `Group with name ${req.body.name} already exists.`
    });
    return;
  }


  next();
};

/**
 * Checks if a name in req.body is empty
 */
 const isNameValid = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name.trim()) {
    res.status(409).json({
      error: `No name was provided.`
    });
    return;
  }


  next();
};

/**
 * Checks if a group with groupId in req.params exists
 */
const isGroupExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.groupId) {
    res.status(400).json({
      error: 'Provided group ID must be nonempty.'
    });
    return;
  }

  const group = await GroupCollection.findOneByGroupId(req.params.groupId);
  if (!group) {
    res.status(404).json({
      error: `A group with groupId ${req.params.groupId as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the privacy setting of the group in req.query is valid, i.e empty space or a boolean "true"/"false"
 */
 const isValidPrivacySettingQuery = (req: Request, res: Response, next: NextFunction) => {
  if (req.query.isPrivate === undefined) {
    res.status(400).json({
      error: 'Privacy setting must be present.'
    });
    return;
  }
  
  const {isPrivate} = req.query as {isPrivate: string};

  if (isPrivate !== "true" && isPrivate !== "false" && isPrivate.trim()) {
    res.status(412).json({
      error: 'Privacy setting must be a boolean value true or false.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is a member of the group
 */
 const isUserMember = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  if (!group.members.includes(req.session.userId as Types.ObjectId)) {
    res.status(403).json({
      error: `User must be a member of the group.`
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is already a member of the group
 */
 const isUserMemberAlready = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  if (group.members.includes(req.session.userId as Types.ObjectId)) {
    res.status(409).json({
      error: `User is already a member of the group.`
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is a member of the group if it's private
 */
 const isUserMemberPrivate = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  if (group.isPrivate) {
    if (!group.members.includes(req.session.userId as Types.ObjectId)) {
      res.status(403).json({
        error: 'User must be a member to see info of a private group.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the user given by username in req.body is a member of the group
 */
 const isGivenUserMember = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  const user = await UserCollection.findOneByUsername(req.body.username);
  if (!group.members.includes(user._id)) {
    res.status(403).json({
      error: 'User must be a member of the group.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user given by username in req.body is NOT a member of the group
 */
 const isGivenUserMemberAlready = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  const user = await UserCollection.findOneByUsername(req.body.username);
  if (group.members.includes(user._id)) {
    res.status(409).json({
      error: 'User is already a member of the group.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is an admin of the group
 */
 const isUserAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  if (!group.administrators.includes(req.session.userId as Types.ObjectId)) {
    res.status(403).json({
      error: 'User must be an admin of the group.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is an admin of the group if the group is private
 */
 const isGroupJoinable = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  if (group.isPrivate) {
    if (!group.administrators.includes(req.session.userId as Types.ObjectId)) {
      res.status(403).json({
        error: 'User must be an admin to add a member to a private group.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the group is public and therefore able to be joined
 */
 const isGroupPublic = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  if (group.isPrivate) {
    res.status(403).json({
      error: 'Group must be public in order for user to be able to add themself.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user given by username in req.body is an admin of the group
 */
 const isGivenUserAdminAlready = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  const user = await UserCollection.findOneByUsername(req.body.username);
  if (group.administrators.includes(user._id)) {
    res.status(409).json({
      error: 'User is already an admin of the group.'
    });
    return;
  }

  next();
};

/**
 * Checks if username given in req.body belongs to an existing user
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const {username} = req.body as {username: string};
  if (!username) {
    res.status(400).json({error: `Missing username.`});
    return;
  }
  const user = await UserCollection.findOneByUsername(req.body.username as string);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${req.body.username as string} does not exist.`
    });
    return;
  }

  next();
}

/**
 * Checks if a freet with freetId in req.body exists
 */
 const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.body.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId in req.body is already in the group
 */
 const isFreetInGroup = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  if (group.posts.includes(req.body.freetId as Types.ObjectId)) {
    res.status(409).json({
      error: `Freet with freet ID ${req.body.freetId} already exists in group.`
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId in req.body is not in the group
 */
 const isFreetNotInGroup = async (req: Request, res: Response, next: NextFunction) => {
  const {groupId} = req.params as {groupId: string};
  const group = await GroupCollection.findOneByGroupId(groupId);

  if (!group.posts.includes(req.body.freetId as Types.ObjectId)) {
    res.status(409).json({
      error: `Freet with freet ID ${req.body.freetId} doesn't exist in group.`
    });
    return;
  }

  next();
};

export {
  isNameNotAlreadyInUse,
  isNameValid,
  isGroupExists,
  isValidPrivacySettingQuery,
  isUserMember,
  isUserMemberAlready,
  isUserMemberPrivate,
  isGivenUserMember,
  isGivenUserMemberAlready,
  isUserAdmin,
  isGroupJoinable,
  isGroupPublic,
  isGivenUserAdminAlready,
  isUserExists,
  isFreetExists,
  isFreetInGroup,
  isFreetNotInGroup,
};
