 

export interface Flag {
  image: string;
  alt: string;
}

export interface CountrySuggestionsProps {
  name: string;
  flag: Flag;
  onSelect: (...args: unknown[]) => void;
  highlightedText: string;
}
export interface Country {
  id: number;
  name: string;
  flag: Flag;
}


export type TCountrySuggestions = Pick<
CountrySuggestionsProps,
"name" | "flag" | "highlightedText"
>;
export interface AutoCompleteProps {
  getSuggestions: (query: string,
    maxVisibleResults: number,
    page?: number ) =>  Promise<Country[]>;
  maxVisibleResults?: number;
  enableCaching?: boolean;
  minInputLength?: number;
  debounceDelay?: number;
  showClearBtn?: boolean;
  autoFocus?: boolean;
  onClear?: () => void;
  cacheSize?: number;
  closeOnEsc?: boolean;
  selectUsingKeyboard?: boolean;
  showLoader?: boolean;
  errorMsg: string;
  noResultMsg: string;
  width?: string;
  height?: string;
  highlightMatchingText?: (query: string, data: TCountrySuggestions) => TCountrySuggestions & { highlightedText: string };
  renderSuggestion?: (args: any) => React.ReactNode;
  enableMatchingTextHighLighting?: boolean;
  onSelect: <T>(data: T) => void;
}
