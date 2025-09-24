import { useState } from 'react';
import { Heart, Edit, Trash2, Copy, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { CodeSnippet } from '@/types/snippet';
import { format } from 'date-fns';

interface SnippetListProps {
  snippets: CodeSnippet[];
  selectedSnippet: CodeSnippet | null;
  onSelectSnippet: (snippet: CodeSnippet) => void;
  onEditSnippet: (snippet: CodeSnippet) => void;
  onDeleteSnippet: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const SnippetList = ({
  snippets,
  selectedSnippet,
  onSelectSnippet,
  onEditSnippet,
  onDeleteSnippet,
  onToggleFavorite,
}: SnippetListProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (code: string, title: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: 'Copied to clipboard',
        description: `"${title}" has been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Unable to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, string> = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      css: '🎨',
      html: '🌐',
      json: '📄',
      bash: '⚡',
      sql: '🗄️',
    };
    return icons[language] || '📝';
  };

  if (snippets.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No snippets found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 h-full overflow-y-auto code-scrollbar">
      {snippets.map((snippet) => (
        <Card
          key={snippet.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedSnippet?.id === snippet.id
              ? 'ring-2 ring-primary bg-accent/50'
              : 'hover:bg-accent/20'
          }`}
          onClick={() => onSelectSnippet(snippet)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">
                    {getLanguageIcon(snippet.language)}
                  </span>
                  <h3 className="font-medium text-sm truncate">
                    {snippet.title}
                  </h3>
                  {snippet.isFavorite && (
                    <Heart className="h-3 w-3 fill-destructive text-destructive" />
                  )}
                </div>
                {snippet.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {snippet.description}
                  </p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(snippet.code, snippet.title);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(snippet.id);
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {snippet.isFavorite ? 'Remove from' : 'Add to'} Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSnippet(snippet);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSnippet(snippet.id);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1 mb-2">
              {snippet.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {snippet.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{snippet.tags.length - 3}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{snippet.category}</span>
              <span>{format(new Date(snippet.updatedAt), 'MMM d')}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};