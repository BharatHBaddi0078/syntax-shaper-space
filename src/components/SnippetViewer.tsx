import { useState } from 'react';
import { Copy, Edit, Trash2, Heart, Calendar, Tag, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CodeSnippet } from '@/types/snippet';
import { format } from 'date-fns';

interface SnippetViewerProps {
  snippet: CodeSnippet;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export const SnippetViewer = ({
  snippet,
  onEdit,
  onDelete,
  onToggleFavorite,
}: SnippetViewerProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'Code has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getLanguageIcon(snippet.language)}</span>
          <div>
            <h1 className="text-2xl font-bold">{snippet.title}</h1>
            {snippet.description && (
              <p className="text-muted-foreground mt-1">{snippet.description}</p>
            )}
          </div>
          {snippet.isFavorite && (
            <Heart className="h-5 w-5 fill-destructive text-destructive" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            disabled={copied}
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFavorite}
          >
            <Heart className="h-4 w-4 mr-2" />
            {snippet.isFavorite ? 'Unfavorite' : 'Favorite'}
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-6 border-b bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Category:</span>
            <Badge variant="outline">{snippet.category}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Updated:</span>
            <span className="text-sm text-muted-foreground">
              {format(new Date(snippet.updatedAt), 'PPP')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {snippet.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Code Display */}
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {snippet.language.toUpperCase()} Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre 
                className="overflow-auto p-4 rounded-lg border bg-[hsl(var(--code-bg))] border-[hsl(var(--code-border))] code-scrollbar"
                style={{ 
                  backgroundColor: 'hsl(var(--code-bg))',
                  borderColor: 'hsl(var(--code-border))'
                }}
              >
                <code className="text-sm font-mono whitespace-pre-wrap">
                  {snippet.code}
                </code>
              </pre>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};