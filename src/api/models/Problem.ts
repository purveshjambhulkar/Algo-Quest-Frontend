
import mongoose from 'mongoose';
import { Difficulty } from '@/types';

// Define the document interface for proper TypeScript support
export interface ProblemDocument extends mongoose.Document {
  title: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  completed: boolean;
  attempted: boolean;
  timeComplexity: string;
  spaceComplexity: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  attempted: {
    type: Boolean,
    default: false
  },
  timeComplexity: {
    type: String,
    default: 'O(n)'
  },
  spaceComplexity: {
    type: String,
    default: 'O(n)'
  },
  link: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create a type for the Problem model
export type ProblemModel = mongoose.Model<ProblemDocument>;

// Check if the model already exists to avoid recompilation errors
const Problem = (mongoose.models?.Problem || 
  mongoose.model<ProblemDocument>('Problem', ProblemSchema)) as ProblemModel;

export default Problem;