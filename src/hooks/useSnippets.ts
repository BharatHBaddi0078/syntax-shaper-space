import { useState, useEffect } from 'react';
import { CodeSnippet, Category } from '@/types/snippet';

const STORAGE_KEY = 'code-snippets';
const CATEGORIES_KEY = 'snippet-categories';

// Sample data
const defaultCategories: Category[] = [
  { id: '1', name: 'JavaScript', color: 'hsl(45, 93%, 47%)', count: 0 },
  { id: '2', name: 'React', color: 'hsl(193, 95%, 68%)', count: 0 },
  { id: '3', name: 'CSS', color: 'hsl(218, 79%, 51%)', count: 0 },
  { id: '4', name: 'Python', color: 'hsl(53, 94%, 49%)', count: 0 },
  { id: '5', name: 'Utilities', color: 'hsl(262, 83%, 58%)', count: 0 },
];

const defaultSnippets: CodeSnippet[] = [
  {
    id: '1',
    title: 'React useState Hook',
    description: 'Basic useState hook example with counter',
    code: `import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

export default Counter;`,
    language: 'javascript',
    tags: ['react', 'hooks', 'state'],
    category: 'React',
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: true,
  },
  {
    id: '2',
    title: 'CSS Flexbox Center',
    description: 'Perfect centering with flexbox',
    code: `.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}`,
    language: 'css',
    tags: ['css', 'flexbox', 'center'],
    category: 'CSS',
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
  },
  {
    id: '3',
    title: 'Async Fetch Helper',
    description: 'Reusable async function for API calls',
    code: `const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};`,
    language: 'javascript',
    tags: ['javascript', 'async', 'fetch', 'api'],
    category: 'JavaScript',
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: true,
  },
];

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load from localStorage or use defaults
    const savedSnippets = localStorage.getItem(STORAGE_KEY);
    const savedCategories = localStorage.getItem(CATEGORIES_KEY);
    
    if (savedSnippets) {
      setSnippets(JSON.parse(savedSnippets));
    } else {
      setSnippets(defaultSnippets);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(defaultCategories);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever snippets change
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
    
    // Update category counts
    const updatedCategories = categories.map(cat => ({
      ...cat,
      count: snippets.filter(snippet => snippet.category === cat.name).length,
    }));
    
    setCategories(updatedCategories);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
  }, [snippets]);

  const addSnippet = (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSnippet: CodeSnippet = {
      ...snippet,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSnippets(prev => [newSnippet, ...prev]);
  };

  const updateSnippet = (id: string, updates: Partial<CodeSnippet>) => {
    setSnippets(prev => 
      prev.map(snippet => 
        snippet.id === id 
          ? { ...snippet, ...updates, updatedAt: new Date() }
          : snippet
      )
    );
  };

  const deleteSnippet = (id: string) => {
    setSnippets(prev => prev.filter(snippet => snippet.id !== id));
  };

  const toggleFavorite = (id: string) => {
    updateSnippet(id, { 
      isFavorite: !snippets.find(s => s.id === id)?.isFavorite 
    });
  };

  return {
    snippets,
    categories,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite,
  };
};