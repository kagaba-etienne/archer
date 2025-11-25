/**
 * Sentiment analysis result
 */
export type Sentiment = "positive" | "neutral" | "negative";

/**
 * Reflection entity from UML class diagram
 */
export interface Reflection {
  id: string;
  userId: string;
  content: string;
  sentiment?: Sentiment;
  sentimentScore?: number; // -1 to 1
  tags: string[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create reflection DTO
 */
export interface CreateReflectionDto {
  content: string;
  tags?: string[];
}

/**
 * Update reflection DTO
 */
export interface UpdateReflectionDto {
  content?: string;
  tags?: string[];
}

/**
 * Reflection filters
 */
export interface ReflectionFilters {
  sentiment?: Sentiment;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

/**
 * Sentiment analysis request
 */
export interface AnalyzeSentimentDto {
  text: string;
}

/**
 * Sentiment analysis response
 */
export interface SentimentAnalysisResult {
  sentiment: Sentiment;
  score: number;
  keywords: string[];
  summary?: string;
}
