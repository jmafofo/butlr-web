export type InsightData = {
    keywords: string[];
    tags: string[];
    title_variants: string[];
    thumbnail_prompt: string;
    insight: string;
  };
  
  export type SavedSuggestion = {
    id: string;
    query: string;
    tone: string;
    created_at: string;
    keywords: string[];
    tags: string[];
  };