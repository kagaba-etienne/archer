/**
 * Goal horizon/timeframe (matches Prisma enum)
 */
export type GoalHorizon = "SHORT_TERM" | "MID_TERM" | "LONG_TERM";

/**
 * Goal entity from UML class diagram
 */
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  horizon: GoalHorizon;
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
}

/**
 * Update goal DTO
 */
export interface UpdateGoalDto {
  title?: string;
  description?: string;
  horizon?: GoalHorizon;
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
