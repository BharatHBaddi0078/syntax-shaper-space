import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SnippetSidebar } from './SnippetSidebar';
import { SnippetList } from './SnippetList';
import { SnippetEditor } from './SnippetEditor';
import { SnippetViewer } from './SnippetViewer';
import { SearchBar } from './SearchBar';
import { useSnippets } from '@/hooks/useSnippets';
import { CodeSnippet } from '@/types/snippet';

export const CodeSnippetManager = () => {
  const { 
    snippets, 
    categories, 
    addSnippet, 
    updateSnippet, 
    deleteSnippet, 
    toggleFavorite 
  } = useSnippets();
  
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || snippet.category === selectedCategory;
    const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const handleNewSnippet = () => {
    setSelectedSnippet(null);
    setIsEditing(true);
  };

  const handleEditSnippet = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet);
    setIsEditing(true);
  };

  const handleViewSnippet = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet);
    setIsEditing(false);
  };

  const handleSaveSnippet = (snippetData: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedSnippet) {
      updateSnippet(selectedSnippet.id, snippetData);
    } else {
      addSnippet(snippetData);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (!selectedSnippet) {
      setSelectedSnippet(null);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SnippetSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          selectedLanguage={selectedLanguage}
          onLanguageSelect={setSelectedLanguage}
          onNewSnippet={handleNewSnippet}
          totalSnippets={snippets.length}
          favoriteCount={snippets.filter(s => s.isFavorite).length}
        />
        
        <main className="flex-1 flex flex-col">
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search snippets by title, description, or tags..."
              />
            </div>
          </div>
          
          <div className="flex-1 flex">
            <div className="w-80 border-r bg-muted/50">
              <SnippetList
                snippets={filteredSnippets}
                selectedSnippet={selectedSnippet}
                onSelectSnippet={handleViewSnippet}
                onEditSnippet={handleEditSnippet}
                onDeleteSnippet={deleteSnippet}
                onToggleFavorite={toggleFavorite}
              />
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <SnippetEditor
                  snippet={selectedSnippet}
                  onSave={handleSaveSnippet}
                  onCancel={handleCancelEdit}
                />
              ) : selectedSnippet ? (
                <SnippetViewer
                  snippet={selectedSnippet}
                  onEdit={() => handleEditSnippet(selectedSnippet)}
                  onDelete={() => deleteSnippet(selectedSnippet.id)}
                  onToggleFavorite={() => toggleFavorite(selectedSnippet.id)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-muted-foreground">
                      Welcome to Code Snippet Manager
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                      Select a snippet from the list to view it, or create a new one to get started.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};