import { useState, useEffect } from 'react';
import { Save, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CodeSnippet } from '@/types/snippet';
import Monaco from '@monaco-editor/react';

const languages = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'css', name: 'CSS' },
  { id: 'html', name: 'HTML' },
  { id: 'json', name: 'JSON' },
  { id: 'bash', name: 'Bash' },
  { id: 'sql', name: 'SQL' },
];

const categories = [
  'JavaScript',
  'React',
  'CSS',
  'Python',
  'Utilities',
  'API',
  'Database',
  'DevOps',
];

interface SnippetEditorProps {
  snippet: CodeSnippet | null;
  onSave: (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const SnippetEditor = ({ snippet, onSave, onCancel }: SnippetEditorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [category, setCategory] = useState('JavaScript');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setDescription(snippet.description || '');
      setCode(snippet.code);
      setLanguage(snippet.language);
      setCategory(snippet.category);
      setTags(snippet.tags);
      setIsFavorite(snippet.isFavorite);
    } else {
      // Reset form for new snippet
      setTitle('');
      setDescription('');
      setCode('');
      setLanguage('javascript');
      setCategory('JavaScript');
      setTags([]);
      setNewTag('');
      setIsFavorite(false);
    }
  }, [snippet]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim() || !code.trim()) {
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      code: code.trim(),
      language,
      category,
      tags,
      isFavorite,
    });
  };

  const isValid = title.trim() && code.trim();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-2xl font-bold">
          {snippet ? 'Edit Snippet' : 'New Snippet'}
        </h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter snippet title..."
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.id} value={lang.id}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button variant="outline" size="icon" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Code Editor */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Code *</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <Monaco
                height="500px"
                language={language === 'bash' ? 'shell' : language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};