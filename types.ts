export interface CommentAnalysis {
  id: string;
  text: string;
  isSpam: boolean;
  confidence: number;
  category: 'Spam' | 'Scam' | 'Self-Promotion' | 'Bot' | 'Safe';
  reason: string;
}

export interface Stats {
  total: number;
  spam: number;
  safe: number;
  averageConfidence: number;
}

export type AppView = 'landing' | 'detector';

