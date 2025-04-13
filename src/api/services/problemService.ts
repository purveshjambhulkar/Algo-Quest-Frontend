
import connectDB from '../db';
import Problem from '../models/Problem';
import UserStats from '../models/UserStats';
import { Problem as ProblemType, UserStats as UserStatsType } from '@/types';
import { toast } from 'sonner';

// Initialize the database if empty
export const initializeDB = async () => {
  const connected = await connectDB();
  if (!connected) return { success: false, message: 'Failed to connect to database' };

  try {
    // Check if there are any problems
    const problemCount = await Problem?.countDocuments?.();
    // Check if there are any user stats
    const statsCount = await UserStats?.countDocuments?.();
    
    return { 
      success: true, 
      message: 'Database check completed',
      isEmpty: problemCount === 0 && statsCount === 0
    };
  } catch (error) {
    console.error('Error checking database:', error);
    return { success: false, message: 'Error checking database' };
  }
};

// Get all problems
export const getAllProblems = async (): Promise<ProblemType[]> => {
  const connected = await connectDB();
  if (!connected || !Problem) {
    toast.error('Failed to connect to database');
    return [];
  }

  try {
    const problems = await Problem.find({}).lean();
    return problems.map((problem: any) => ({
      ...problem,
      id: problem._id.toString()
    }));
  } catch (error) {
    console.error('Error fetching problems:', error);
    toast.error('Failed to fetch problems');
    return [];
  }
};

// Get user stats
export const getUserStats = async (): Promise<UserStatsType> => {
  // Default empty stats
  const emptyStats: UserStatsType = {
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    streak: 0,
    lastPracticed: null
  };

  const connected = await connectDB();
  if (!connected || !UserStats) {
    toast.error('Failed to connect to database');
    return emptyStats;
  }

  try {
    let stats = await UserStats.findOne({}).lean();
    
    if (!stats) {
      // Create default stats if none found
      try {
        stats = await UserStats.create(emptyStats);
      } catch (error) {
        console.error('Error creating default stats:', error);
      }
    }
    
    return stats || emptyStats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    toast.error('Failed to fetch user stats');
    return emptyStats;
  }
};

// Update problem status
export const updateProblemStatus = async (id: string, updates: Partial<ProblemType>) => {
  const connected = await connectDB();
  if (!connected || !Problem) {
    toast.error('Failed to connect to database');
    return { success: false };
  }

  try {
    await Problem.findByIdAndUpdate(id, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating problem:', error);
    toast.error('Failed to update problem');
    return { success: false };
  }
};

// Update user stats
export const updateUserStats = async (updates: Partial<UserStatsType>) => {
  const connected = await connectDB();
  if (!connected || !UserStats) {
    toast.error('Failed to connect to database');
    return { success: false };
  }

  try {
    const emptyStats: UserStatsType = {
      totalSolved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
      streak: 0,
      lastPracticed: null
    };

    const stats = await UserStats.findOne({});
    if (stats) {
      Object.assign(stats, updates);
      await stats.save();
    } else {
      try {
        await UserStats.create({ ...emptyStats, ...updates });
      } catch (error) {
        console.error('Error creating stats:', error);
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error updating user stats:', error);
    toast.error('Failed to update user stats');
    return { success: false };
  }
};

// Add a new problem
export const addNewProblem = async (problem: Omit<ProblemType, 'id'>) => {
  const connected = await connectDB();
  if (!connected || !Problem) {
    toast.error('Failed to connect to database');
    return { success: false, id: null };
  }

  try {
    const newProblem = await Problem.create(problem);
    return { 
      success: true, 
      id: newProblem._id.toString() 
    };
  } catch (error) {
    console.error('Error adding problem:', error);
    toast.error('Failed to add problem');
    return { success: false, id: null };
  }
};