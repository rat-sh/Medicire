import { create } from 'zustand';

interface SearchState {
  query: string;
  selectedMedicineId: string | null;
  selectedMedicineName: string;
  recentSearches: string[];
  // Actions
  setQuery: (q: string) => void;
  selectMedicine: (id: string, name: string) => void;
  addRecentSearch: (name: string) => void;
  clearQuery: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  selectedMedicineId: null,
  selectedMedicineName: '',
  recentSearches: [],

  setQuery: (query) => set({ query }),

  selectMedicine: (selectedMedicineId, selectedMedicineName) => {
    get().addRecentSearch(selectedMedicineName);
    set({ selectedMedicineId, selectedMedicineName });
  },

  addRecentSearch: (name) => {
    const prev = get().recentSearches.filter(s => s !== name);
    set({ recentSearches: [name, ...prev].slice(0, 10) });
  },

  clearQuery: () => set({ query: '', selectedMedicineId: null, selectedMedicineName: '' }),
}));
