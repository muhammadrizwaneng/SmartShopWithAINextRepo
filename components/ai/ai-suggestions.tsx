"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/input";

interface AISuggestionsProps {
  prompt: string;
  onSuggestion: (suggestion: string) => void;
  className?: string;
  buttonText?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function AISuggestions({ 
  prompt, 
  onSuggestion, 
  className,
  buttonText = "Generate",
  value = "",
  onChange,
  label = "Product Name",
  placeholder = "Enter product name or generate suggestions"
}: AISuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const generateSuggestions = async () => {
    try {
      setIsLoading(true);
      
      // Call your AI API endpoint with the prompt
      const { data } = await api.post('/ai/generate-product-names', { prompt,mode:'name' });
      console.log('==-=-data?.results',data?.results)
      if (data?.results && Array.isArray(data.results)) {
        // data.results is already an array, so assign it directly.
        // We still map and trim just to be safe from extra whitespace.
        const suggestionList = data.results.map((s: string) => s.trim()); 
        
        setSuggestions(suggestionList);
        setShowDropdown(true);
      
      } else if (data?.names) {
        // Fallback for backward compatibility
        const suggestionList = Array.isArray(data.names) 
          ? data.names 
          : data.names.split(',').map((s: string) => s.trim());
        setSuggestions(suggestionList);
        setShowDropdown(true);
      }
      
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSuggestion(value);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    onSuggestion(suggestion);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setInputValue('');
    onSuggestion('');
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between mb-1">
        <label className="brand">{label}</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={generateSuggestions}
          disabled={isLoading}
          className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-1 h-3 w-3" />
              {buttonText}
            </>
          )}
        </Button>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder={placeholder}
            className="pr-10"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={suggestions.length === 0}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showDropdown && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {isLoading && suggestions.length === 0 && (
        <div className="flex items-center justify-center py-1">
          <Loader2 className="mr-2 h-3 w-3 animate-spin text-gray-400" />
          <span className="text-xs text-gray-500">Generating suggestions...</span>
        </div>
      )}
    </div>
  );
}

// AI Suggestion component for form fields
export function AISuggestField({
  value,
  onChange,
  fieldName,
  placeholder = "",
  className = "",
  buttonText = "Generate with AI",
  rows = 1
}: {
  value: string;
  onChange: (value: string) => void;
  fieldName: string;
  placeholder?: string;
  className?: string;
  buttonText?: string;
  rows?: number;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSuggestion = async () => {
    try {
      setIsGenerating(true);
      
      // Call your AI API endpoint
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          field: fieldName,
          currentValue: value,
          prompt: `Generate a ${fieldName} for a product`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestion');
      }

      const data = await response.json();
      onChange(data.suggestion);
      
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative">
      {rows > 1 ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        />
      )}
      <button
        type="button"
        onClick={generateSuggestion}
        disabled={isGenerating}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
