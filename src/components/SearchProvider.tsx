"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SearchContextValue = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useRecipeSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useRecipeSearch must be used inside SearchProvider");
  }

  return context;
}
