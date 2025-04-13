import React, { createContext, useContext, useState, useEffect } from 'react';
import { Problem, UserStats } from '@/types';
import { 
  getAllProblems, 
  getUserStats, 
  updateProblemStatus, 
  updateUserStats, 
  addNewProblem,
  deleteProblem as apiDeleteProblem,
  updateProblemDetails as apiUpdateProblemDetails,
  initializeDB
} from '@/api/services/api';
import { defaultUserStats } from '@/data/problems';
import { toast } from 'sonner';

type ProblemContextType = {
  problems: Problem[];
  userStats: UserStats;
  loading: boolean;
  updateProblem: (id: string, updates: Partial<Problem>) => Promise<void>;
  updateProblemDetails: (id: string, updates: Partial<Problem>, adminPassword: string) => Promise<{success: boolean, message?: string}>;
  updateStats: (updates: Partial<UserStats>) => Promise<void>;
  addProblem: (problem: Omit<Problem, 'id'>) => Promise<string | null>;
  refreshProblems: () => Promise<void>;
  refreshStats: () => Promise<void>;
  initialize: () => Promise<void>;
  getProblemById: (id: string) => Problem | undefined;
  markProblemAsCompleted: (id: string) => Promise<void>;
  markProblemAsAttempted: (id: string) => Promise<void>;
  resetProblemStatus: (id: string) => Promise<void>;
  deleteProblem: (id: string, adminPassword: string) => Promise<{success: boolean, message?: string}>;
};

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const useProblemContext = () => {
  const context = useContext(ProblemContext);
  if (!context) {
    throw new Error('useProblemContext must be used within a ProblemProvider');
  }
  return context;
};

// Export the hook with both names to fix the error
export const useProblems = useProblemContext;

export const ProblemProvider = ({ children }: { children: React.ReactNode }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshProblems = async () => {
    setLoading(true);
    try {
      const fetchedProblems = await getAllProblems();
      setProblems(fetchedProblems);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
      toast.error("Failed to refresh problems.");
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    setLoading(true);
    try {
      const fetchedStats = await getUserStats();
      setUserStats(fetchedStats);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      toast.error("Failed to refresh user stats.");
    } finally {
      setLoading(false);
    }
  };

  const updateProblem = async (id: string, updates: Partial<Problem>) => {
    try {
      await updateProblemStatus(id, updates);
      // Optimistically update the state
      setProblems(prevProblems =>
        prevProblems.map(problem =>
          problem.id === id ? { ...problem, ...updates } : problem
        )
      );
    } catch (error) {
      console.error("Failed to update problem:", error);
      toast.error("Failed to update the problem.");
    }
  };

  const updateStats = async (updates: Partial<UserStats>) => {
    try {
      await updateUserStats(updates);
      setUserStats(prevStats => ({ ...prevStats, ...updates }));
    } catch (error) {
      console.error("Failed to update user stats:", error);
      toast.error("Failed to update user stats.");
    }
  };

  const addProblem = async (problem: Omit<Problem, 'id'>): Promise<string | null> => {
    try {
      const result = await addNewProblem(problem);
      if (result.success) {
        toast.success("Problem added successfully!");
        await refreshProblems(); // Refresh problems to include the new one
        return result.id;
      } else {
        toast.error("Failed to add problem.");
        return null;
      }
    } catch (error) {
      console.error("Error adding problem:", error);
      toast.error("Failed to add problem.");
      return null;
    }
  };

  const initialize = async () => {
    try {
      const result = await initializeDB();
      if (result.success && result.isEmpty) {
        toast.success("Database initialized successfully!");
      } else if (result.success) {
        toast.success("Database already initialized.");
      } else {
        toast.error("Failed to initialize database.");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
      toast.error("Failed to initialize database.");
    }
  };

  const updateProblemDetails = async (id: string, updates: Partial<Problem>, adminPassword: string) => {
    try {
      const result = await apiUpdateProblemDetails(id, updates, adminPassword);
      if (result.success) {
        // Optimistically update the state
        setProblems(prevProblems =>
          prevProblems.map(problem =>
            problem.id === id ? { ...problem, ...updates } : problem
          )
        );
        toast.success("Problem updated successfully!");
      } else {
        toast.error(result.message || "Failed to update problem.");
      }
      return result;
    } catch (error) {
      console.error("Failed to update problem details:", error);
      toast.error("Failed to update problem details.");
      return { success: false, message: "An error occurred" };
    }
  };

  const getProblemById = (id: string) => {
    return problems.find(problem => problem.id === id);
  };

  const markProblemAsCompleted = async (id: string) => {
    await updateProblem(id, { completed: true, attempted: true });
    
    // Update user stats when a problem is completed
    const problem = problems.find(p => p.id === id);
    if (problem && !problem.completed) {
      const today = new Date().toISOString();
      const difficulty = problem.difficulty;
      
      const statsUpdates: Partial<UserStats> = {
        totalSolved: userStats.totalSolved + 1,
        lastPracticed: today,
        streak: userStats.lastPracticed ? 
                (new Date(today).getDate() - new Date(userStats.lastPracticed).getDate() <= 1 ? 
                 userStats.streak + 1 : 1) : 1
      };
      
      // Update difficulty-specific counts
      if (difficulty === 'easy') statsUpdates.easy = (userStats.easy || 0) + 1;
      if (difficulty === 'medium') statsUpdates.medium = (userStats.medium || 0) + 1;
      if (difficulty === 'hard') statsUpdates.hard = (userStats.hard || 0) + 1;
      
      await updateStats(statsUpdates);
    }
  };

  const markProblemAsAttempted = async (id: string) => {
    await updateProblem(id, { attempted: true });
  };

  const resetProblemStatus = async (id: string) => {
    await updateProblem(id, { completed: false, attempted: false });
  };

  const deleteProblem = async (id: string, adminPassword: string) => {
    if (!adminPassword) {
      return { success: false, message: "Admin password is required" };
    }
    
    try {
      const result = await apiDeleteProblem(id, adminPassword);
      if (result.success) {
        // Optimistically update the state
        setProblems(prevProblems => prevProblems.filter(problem => problem.id !== id));
      }
      return result;
    } catch (error) {
      console.error("Failed to delete problem:", error);
      return { success: false, message: "Failed to delete the problem" };
    }
  };

  useEffect(() => {
    refreshProblems();
    refreshStats();
  }, []);

  const value: ProblemContextType = {
    problems,
    userStats,
    loading,
    updateProblem,
    updateProblemDetails,
    updateStats,
    addProblem,
    refreshProblems,
    refreshStats,
    initialize,
    getProblemById,
    markProblemAsCompleted,
    markProblemAsAttempted,
    resetProblemStatus,
    deleteProblem,
  };

  return (
    <ProblemContext.Provider value={value}>
      {children}
    </ProblemContext.Provider>
  );
};