import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, MapPin, Building2, X, History, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const SEARCH_HISTORY_KEY = "humble_halal_search_history";
const MAX_HISTORY_ITEMS = 5;

interface SearchHistoryItem {
  query: string;
  type: "business" | "location";
  timestamp: number;
}

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: "business" | "location";
  onSelect?: (item: any) => void;
}

// Helper functions for search history
const getSearchHistory = (type: "business" | "location"): SearchHistoryItem[] => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!history) return [];
    const parsed = JSON.parse(history) as SearchHistoryItem[];
    return parsed.filter(item => item.type === type).slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
};

const saveToSearchHistory = (query: string, type: "business" | "location") => {
  if (!query.trim() || query.length < 2) return;

  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    let parsed: SearchHistoryItem[] = history ? JSON.parse(history) : [];

    // Remove duplicate if exists
    parsed = parsed.filter(item => !(item.query.toLowerCase() === query.toLowerCase() && item.type === type));

    // Add new item at the beginning
    parsed.unshift({ query: query.trim(), type, timestamp: Date.now() });

    // Keep only recent items (10 total across both types)
    parsed = parsed.slice(0, 10);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore localStorage errors
  }
};

const removeFromSearchHistory = (query: string, type: "business" | "location") => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!history) return;
    let parsed: SearchHistoryItem[] = JSON.parse(history);
    parsed = parsed.filter(item => !(item.query.toLowerCase() === query.toLowerCase() && item.type === type));
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore localStorage errors
  }
};

const clearSearchHistory = (type: "business" | "location") => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!history) return;
    let parsed: SearchHistoryItem[] = JSON.parse(history);
    parsed = parsed.filter(item => item.type !== type);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore localStorage errors
  }
};

export const SearchAutocomplete = ({
  value,
  onChange,
  placeholder,
  type,
  onSelect
}: SearchAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load search history on mount
  useEffect(() => {
    setSearchHistory(getSearchHistory(type));
  }, [type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      setShowSuggestions(true);
      setShowHistory(false);

      try {
        if (type === "business") {
          // Search businesses and categories
          const [businessRes, categoryRes] = await Promise.all([
            supabase
              .from("businesses")
              .select("id, name, slug, categories (name)")
              .ilike("name", `%${value}%`)
              .eq("status", "approved")
              .limit(5),
            supabase
              .from("categories")
              .select("id, name, slug")
              .ilike("name", `%${value}%`)
              .limit(3)
          ]);

          const businesses = businessRes.data || [];
          const categories = categoryRes.data || [];

          setSuggestions([
            ...categories.map((cat: any) => ({ ...cat, type: "category" })),
            ...businesses.map((biz: any) => ({ ...biz, type: "business" }))
          ]);
        } else {
          // Search neighbourhoods
          const { data } = await supabase
            .from("neighbourhoods")
            .select("id, name, slug, region")
            .or(`name.ilike.%${value}%,region.ilike.%${value}%`)
            .limit(8);

          setSuggestions((data || []).map((hood: any) => ({ ...hood, type: "neighbourhood" })));
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [value, type]);

  const handleSelect = (item: any) => {
    onChange(item.name);
    saveToSearchHistory(item.name, type);
    setSearchHistory(getSearchHistory(type));
    setShowSuggestions(false);
    setShowHistory(false);
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleHistorySelect = (query: string) => {
    onChange(query);
    setShowHistory(false);
  };

  const handleRemoveHistoryItem = (e: React.MouseEvent, query: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromSearchHistory(query, type);
    setSearchHistory(getSearchHistory(type));
  };

  const handleClearAllHistory = () => {
    clearSearchHistory(type);
    setSearchHistory([]);
    setShowHistory(false);
  };

  const handleFocus = () => {
    if (value.length >= 2) {
      setShowSuggestions(true);
    } else if (searchHistory.length > 0 && !value) {
      setShowHistory(true);
    }
  };

  const Icon = type === "business" ? Search : MapPin;

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <div className="relative flex items-center">
        <Icon className="absolute left-3 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0 z-10" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full h-10 sm:h-12 pl-9 sm:pl-11 pr-9 text-foreground text-sm sm:text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setShowSuggestions(false);
              setShowHistory(false);
            }}
            className="absolute right-2 w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search History Dropdown */}
      {showHistory && searchHistory.length > 0 && !value && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">Recent Searches</span>
            <button
              type="button"
              onClick={handleClearAllHistory}
              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear all
            </button>
          </div>
          {searchHistory.map((item, index) => (
            <div
              key={`history-${index}`}
              onClick={() => handleHistorySelect(item.query)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors cursor-pointer border-b last:border-b-0"
            >
              <History className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-foreground">{item.query}</span>
              <button
                type="button"
                onClick={(e) => handleRemoveHistoryItem(e, item.query)}
                className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((item, index) => (
            <Link
              key={`${item.type}-${item.id}-${index}`}
              to={
                item.type === "business"
                  ? `/business/${item.slug}`
                  : item.type === "category"
                  ? `/category/${item.slug}`
                  : `/neighbourhood/${item.slug}`
              }
              onClick={() => handleSelect(item)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
              )}
            >
              {item.type === "business" && (
                <>
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">{item.name}</div>
                    {item.categories && (
                      <div className="text-xs text-muted-foreground">
                        {item.categories.name}
                      </div>
                    )}
                  </div>
                </>
              )}
              {item.type === "category" && (
                <>
                  <Search className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground">Category</div>
                  </div>
                </>
              )}
              {item.type === "neighbourhood" && (
                <>
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">{item.name}</div>
                    {item.region && (
                      <div className="text-xs text-muted-foreground">{item.region}</div>
                    )}
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      )}

      {showSuggestions && loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
          Searching...
        </div>
      )}
    </div>
  );
};
