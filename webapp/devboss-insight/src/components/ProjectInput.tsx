import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Paperclip, FileCheck, Loader2 } from 'lucide-react';

interface ProjectInputProps {
  onSubmit: (project: { query: string; file?: File }) => void;
  isLoading: boolean;
}

export const ProjectInput: React.FC<ProjectInputProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSubmit({ query: query.trim(), file: file || undefined });
      setQuery('');
      setFile(null);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          New Project Request
        </CardTitle> {/* CORRECTED CLOSING TAG */}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Query Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Project Description</label>
          <Textarea
            placeholder="Describe what you need the AI agents to work on..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
        </div>

        {/* File Upload Section */}
        <div>
          <label htmlFor="file-upload" className="w-full">
            <Button asChild variant="outline" disabled={isLoading} className="w-full cursor-pointer">
              <div>
                <Paperclip className="h-4 w-4 mr-2" />
                Attach Diagram (PDF)
              </div>
            </Button>
            <Input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
          </label>
          {file && (
            <div className="mt-2 text-sm text-success flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span>{file.name} attached</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className="w-full gap-2 bg-gradient-primary hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Agents are Working...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Deploy AI Agents
            </>
          )}
        </Button>
        
      </CardContent>
    </Card>
  );
};