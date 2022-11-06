import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in FontSwitch
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Font on the backend
export type FontSwitch = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  currentFontId: string;
  currentFontName: string;
};

export type PopulatedFontSwitch = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  currentFontId: string;
  currentFontName: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Fonts stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FontSwitchSchema = new Schema<FontSwitch>({
  // The user the fonts belong to
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // The current font ID the user is using
  currentFontId: {
    type: String,
    required: true,
  },
  // The name of the current font the user is using
  currentFontName: {
    type: String,
    required: true,
  }
});

const FontSwitchModel = model<FontSwitch>('FontSwitch', FontSwitchSchema);
export default FontSwitchModel;
