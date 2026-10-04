import React, { createContext, useContext, useMemo, useState } from 'react';
import { emptyFilters, type FilterState } from '../data/partners';

type Ctx = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  patch: (p: Partial<FilterState>) => void;
  clear: () => void;
};

const FiltersCtx = createContext<Ctx | null>(null);

// Os filtros da 1b vivem no nível do fluxo de Parceiros: a 1a e a 1b
// compartilham o mesmo estado, e ele se perde ao sair da aba (é uma busca, não
// uma preferência salva).
export function PartnerFiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const value = useMemo<Ctx>(
    () => ({
      filters,
      setFilters,
      patch: (p) => setFilters((f) => ({ ...f, ...p })),
      clear: () => setFilters(emptyFilters),
    }),
    [filters]
  );
  return <FiltersCtx.Provider value={value}>{children}</FiltersCtx.Provider>;
}

export function usePartnerFilters() {
  const ctx = useContext(FiltersCtx);
  if (!ctx) throw new Error('usePartnerFilters must be used within PartnerFiltersProvider');
  return ctx;
}
