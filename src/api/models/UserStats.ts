
import mongoose from 'mongoose';

// Define the document interface for proper TypeScript support
export interface UserStatsDocument extends mongoose.Document {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  streak: number;
  lastPracticed: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserStatsSchema = new mongoose.Schema({
  totalSolved: {
    type: Number,
    default: 0
  },
  easy: {
    type: Number,
    default: 0
  },
  medium: {
    type: Number,
    default: 0
  },
  hard: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastPracticed: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Create a type for the UserStats model
export type UserStatsModel = mongoose.Model<UserStatsDocument> | null;

// Get the model if it exists, otherwise create it (only on server)
let UserStats: UserStatsModel = null;

// Only attempt to create the model if we're in a server environment
if (typeof window === 'undefined') {
  // Check if the model already exists to avoid recompilation errors
  UserStats = (mongoose.models?.UserStats || 
    mongoose.model<UserStatsDocument>('UserStats', UserStatsSchema)) as UserStatsModel;
}

export default UserStats;
