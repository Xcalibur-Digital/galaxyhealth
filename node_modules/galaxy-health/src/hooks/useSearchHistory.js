import { useState, useEffect } from 'react';

const MAX_HISTORY_ITEMS = 5;
const STORAGE_KEY = 'patientSearchHistory';

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Add a search term to history
  const addToHistory = (searchTerm, patientInfo) => {
    const newHistory = [
      {
        term: searchTerm,
        timestamp: new Date().toISOString(),
        patientInfo: {
          id: patientInfo.id,
          name: patientInfo.name,
          birthDate: patientInfo.birthDate
        }
      },
      ...searchHistory.filter(item => item.term !== searchTerm)
    ].slice(0, MAX_HISTORY_ITEMS);

    setSearchHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    searchHistory,
    addToHistory,
    clearHistory
  };
}; 