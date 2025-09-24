import { useState } from 'react';
import { Plus, Code2, Heart, Hash, Filter } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/snippet';

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'css', name: 'CSS', icon: '🎨' },
  { id: 'html', name: 'HTML', icon: '🌐' },
  { id: 'json', name: 'JSON', icon: '📄' },
  { id: 'bash', name: 'Bash', icon: '⚡' },
  { id: 'sql', name: 'SQL', icon: '🗄️' },
];

interface SnippetSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
  onNewSnippet: () => void;
  totalSnippets: number;
  favoriteCount: number;
}

export const SnippetSidebar = ({
  categories,
  selectedCategory,
  onCategorySelect,
  selectedLanguage,
  onLanguageSelect,
  onNewSnippet,
  totalSnippets,
  favoriteCount,
}: SnippetSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'}>
      <SidebarTrigger className="m-2 self-end" onClick={() => setCollapsed(!collapsed)} />
      
      <SidebarContent className="p-2">
        {/* Header */}
        <div className="flex items-center gap-2 px-2 py-4">
          <Code2 className="h-6 w-6 text-primary" />
          {!collapsed && (
            <div>
              <h1 className="font-semibold">Code Snippets</h1>
              <p className="text-xs text-muted-foreground">
                {totalSnippets} snippets
              </p>
            </div>
          )}
        </div>

        {/* New Snippet Button */}
        <div className="px-2 mb-4">
          <Button 
            onClick={onNewSnippet} 
            className={collapsed ? "w-10 h-10" : "w-full"} 
            size={collapsed ? 'icon' : 'default'}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && <span className="ml-2">New Snippet</span>}
          </Button>
        </div>

        {/* Quick Stats */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Hash className="h-4 w-4" />
                  {!collapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>All Snippets</span>
                      <Badge variant="secondary">{totalSnippets}</Badge>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Heart className="h-4 w-4" />
                  {!collapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>Favorites</span>
                      <Badge variant="secondary">{favoriteCount}</Badge>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Categories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onCategorySelect('')}
                  isActive={selectedCategory === ''}
                >
                  <Filter className="h-4 w-4" />
                  {!collapsed && <span>All Categories</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              {categories.map((category) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton
                    onClick={() => onCategorySelect(category.name)}
                    isActive={selectedCategory === category.name}
                  >
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span>{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Languages */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Languages
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onLanguageSelect('')}
                  isActive={selectedLanguage === ''}
                >
                  <Filter className="h-4 w-4" />
                  {!collapsed && <span>All Languages</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              {languages.map((language) => (
                <SidebarMenuItem key={language.id}>
                  <SidebarMenuButton
                    onClick={() => onLanguageSelect(language.id)}
                    isActive={selectedLanguage === language.id}
                  >
                    <span className="text-base">{language.icon}</span>
                    {!collapsed && <span>{language.name}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};