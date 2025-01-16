export interface NewsItem {
  title: string;
  content: string;
  category: string;
  timestamp: string;
  keywords: string[];
}


export const NEWS_CATEGORIES = ["Technology", "Business", "World", "Science"]
export type NewsCategory = typeof NEWS_CATEGORIES[number];
