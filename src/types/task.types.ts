/**
 * Task status from state diagram (matches Prisma enum)
 * CREATED → SCHEDULED → IN_PROGRESS → COMPLETED
 *              ↓           ↓
 *           BLOCKED
 */
export type TaskStatus =
  | "CREATED"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "BLOCKED";

/**
 * Task priority levels (matches Prisma enum)
 */
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

/**
 * Task entity from UML class diagram
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  scheduledDate?: Date;
  completedAt?: Date;
  blockedReason?: string;
  goalIds: string[];
  aiSuggestions?: TaskAISuggestions;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AI suggestions for a task
 */
export interface TaskAISuggestions {
  suggestedPriority?: TaskPriority;
  suggestedGoalId?: string;
  suggestedDueDate?: Date;
  reasoning?: string;
  confidence?: number;
}

/**
 * Create task DTO
 */
export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date | string;
  goalIds?: string[];
}

/**
 * Update task DTO
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date | string;
  scheduledDate?: Date;
  blockedReason?: string;
  goalIds?: string[];
}

/**
 * Task filters for queries
 */
export interface TaskFilters {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  goalId?: string;
  dueBefore?: Date;
  dueAfter?: Date;
  search?: string;
}

/**
 * Task statistics
 */
export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  blocked: number;
  overdue: number;
}
