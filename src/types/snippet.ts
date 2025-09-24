export interface CodeSnippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

export type Language = {
  id: string;
  name: string;
  extension: string;
  icon: string;
};