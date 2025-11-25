/**
 * Goal horizon/timeframe
 */
export type GoalHorizon = "short-term" | "mid-term" | "long-term";

/**
 * Goal entity from UML class diagram
 */
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  horizon: GoalHorizon;
  targetDate?: Date;
  progress: number; // 0-100
  taskIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create goal DTO
 */
export interface CreateGoalDto {
  title: string;
  description?: string;
  horizon: GoalHorizon;
  targetDate?: Date;
}

/**
 * Update goal DTO
 */
export interface UpdateGoalDto {
  title?: string;
  description?: string;
  horizon?: GoalHorizon;
  targetDate?: Date;
}

/**
 * Goal progress calculation
 */
export interface GoalProgress {
  goalId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  percentage: number;
}

/**
 * Link task to goal request
 */
export interface LinkTaskToGoalDto {
  taskId: string;
  goalId: string;
}
