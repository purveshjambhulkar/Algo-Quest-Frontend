
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  completed: boolean;
  attempted: boolean;
  timeComplexity?: string;
  spaceComplexity?: string;
  link?: string;
}

export interface UserStats {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  streak: number;
  lastPracticed: string | null;
}