import { Problem, UserStats } from '@/types';
import { toast } from 'sonner';

const API_URL = 'https://algo-quest-backend.vercel.app/api';

// Initialize the database if empty
export const initializeDB = async () => {
  try {
    const response = await fetch(`${API_URL}/initialize-db`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking database:', error);
    toast.error('Failed to connect to database');
    return { success: false, message: 'Failed to connect to database' };
  }
};

// Get all problems
export const getAllProblems = async (): Promise<Problem[]> => {
  try {
    const response = await fetch(`${API_URL}/problems`);
    if (!response.ok) {
      throw new Error('Failed to fetch problems');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching problems:', error);
    toast.error('Failed to fetch problems');
    return [];
  }
};

// Get user stats
export const getUserStats = async (): Promise<UserStats> => {
  // Default empty stats
  const emptyStats: UserStats = {
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    streak: 0,
    lastPracticed: null
  };

  try {
    const response = await fetch(`${API_URL}/user-stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    toast.error('Failed to fetch user stats');
    return emptyStats;
  }
};

// Update problem status
export const updateProblemStatus = async (id: string, updates: Partial<Problem>) => {
  try {
    const response = await fetch(`${API_URL}/problems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update problem');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating problem:', error);
    toast.error('Failed to update problem');
    return { success: false };
  }
};

// Update problem details (full update)
export const updateProblemDetails = async (id: string, problem: Partial<Problem>, adminPassword: string) => {
  try {
    const response = await fetch(`${API_URL}/problems/${id}/details`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...problem, adminPassword }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || 'Failed to update problem details' 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating problem details:', error);
    toast.error('Failed to update problem details');
    return { success: false, message: 'Server error' };
  }
};

// Update user stats
export const updateUserStats = async (updates: Partial<UserStats>) => {
  try {
    const response = await fetch(`${API_URL}/user-stats`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user stats');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user stats:', error);
    toast.error('Failed to update user stats');
    return { success: false };
  }
};

// Add a new problem
export const addNewProblem = async (problem: Omit<Problem, 'id'>) => {
  try {
    const response = await fetch(`${API_URL}/problems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(problem),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add problem');
    }
    
    const data = await response.json();
    return { 
      success: true, 
      id: data.id 
    };
  } catch (error) {
    console.error('Error adding problem:', error);
    toast.error('Failed to add problem');
    return { success: false, id: null };
  }
};

// Delete a problem
export const deleteProblem = async (id: string, adminPassword: string) => {
  try {
    const response = await fetch(`${API_URL}/problems/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminPassword }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || 'Failed to delete problem' 
      };
    }
    
    return { 
      success: true
    };
  } catch (error) {
    console.error('Error deleting problem:', error);
    toast.error('Failed to delete problem');
    return { 
      success: false, 
      message: 'Failed to delete problem'
    };
  }
};