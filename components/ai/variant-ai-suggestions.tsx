"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";

interface VariantAISuggestionsProps {
  onSuggestion: (suggestion: string) => void;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  productName?: string;
  brandName?: string;
  categoryName?: string;
  variantType?: 'color' | 'size' | 'material' | 'style' | 'other';
}

export function VariantAISuggestions({ 
  onSuggestion, 
  className,
  value = "",
  onChange,
  label = "Variant",
  placeholder = "Enter variant or generate suggestions",
  productName = "",
  brandName = "",
  categoryName = "",
  variantType = 'other'
}: VariantAISuggestionsProps) {
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const generateVariantSuggestions = async () => {
    if (!productName) {
      toast({
        title: "Error",
        description: "Please enter a product name first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await api.post('/ai/generate-product-names', {
        mode: 'variant',
        // product: productName,
        // brand: brandName,
        // category: categoryName,
        // variantType,
        prompt: `Suggest ${variantType} variants for a ${categoryName || 'product'} called "${productName}"${brandName ? ` by ${brandName}` : ''}. ` +
                `The variants should be relevant to the product type and brand. Return only a comma-separated list of variants.`
      });

      if (response.data?.results || response.data?.suggestion) {
        const suggestionData = response.data.results || response.data.suggestion;
        const suggestionList = Array.isArray(suggestionData)
          ? suggestionData
          : suggestionData.split(',').map((s: string) => s.trim());
        
        setSuggestions(suggestionList);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate variant suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    onSuggestion(suggestion);
    if (onChange) {
      onChange(suggestion);
    }
    setShowDropdown(false);
  };

  const handleClear = () => {
    setInputValue('');
    onSuggestion('');
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between mb-1">
        <label className="font-medium text-sm">{label}</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={generateVariantSuggestions}
          disabled={isLoading || !productName}
          className="text-xs text-primary hover:text-primary/80 p-0 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-1 h-3 w-3" />
              Suggest {variantType} variants
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
