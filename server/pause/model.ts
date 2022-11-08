import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in Pause
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Pause on the backend
export type Pause = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  threshold: number;
};

export type PopulatedPause = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  threshold: number;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Pauses stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PauseSchema = new Schema<Pause>({
  // The user the pause settings belong to
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // The threshold of time the user wants the pause notification to pop up after
  threshold: {
    type: Number,
    required: true,
    min: [0, 'Threshold cannot be negative!'],
  }
});

PauseSchema.index({ user: 1 }, { unique: true });

const PauseModel = model<Pause>('Pause', PauseSchema);
export default PauseModel;
