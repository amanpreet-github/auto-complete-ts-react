import React, { useState, useRef, useReducer, useEffect } from "react";

import useDebounceValue from "../../hooks/useDebounce";
import useClickOutside from "../../hooks/useClickOutside";
import Input from "../common/form/Input";
import Loader from "../common/Loaders/Loader";
import Text from "../common/Text";
import {
  PromiseStates,
  KeyboardEvents,
} from "../../const/common";
import LRUCache from "../../utils/LRUCache";
import "./autoComplete.css";
import Button from "../common/Button";
import useKeyPress from "../../hooks/useKeyPress";
import {
  AutoCompleteProps,
} from "../../types/autoComplete";
import SuggestionsDropdown from "./SuggestionsDropdown";
import { FetchAction, FetchState } from "../../types/fetch";
import { TPromiseState, TKeyboardEvents } from "../../types/commonTypes";

const initialState: FetchState = {
  data: [],
  isLoading: false,
  error: "",
};

// Used useReducer to centralized all the api data handling 
const reducer = (
  state: FetchState,
  action: FetchAction<TPromiseState, any>
): FetchState => {
  switch (action.type) {
    case PromiseStates.PENDING as TPromiseState:
      return { ...state, isLoading: true, data: [], error: "" };
    case PromiseStates.FULFILLED as TPromiseState:
      return { ...state, isLoading: false, data: action.payload };
    case PromiseStates.REJECTED as TPromiseState:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

const AutoComplete: React.FC<AutoCompleteProps> = ({
  getSuggestions,
  errorMsg,
  noResultMsg,
  onClear = () => {},
  showClearBtn,
  closeOnEsc,
  cacheSize = 0,
  minInputLength = 1,
  enableCaching,
  debounceDelay,
  renderSuggestion,
  showLoader = true,
  highlightMatchingText,
  width = "15rem",
  height = "15rem",
  maxVisibleResults = 10,
  enableMatchingTextHighLighting = false,
  autoFocus = false,
  onSelect,
}): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [query, setQuery] = useState<string>("");
  const debounceValue: string = useDebounceValue<string>(
    query?.toLowerCase()?.trim(),
    debounceDelay
  );
  const [{ data: suggestions = [], isLoading, error }, dispatch] =
    useReducer(reducer, initialState);

  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef(null);
  const skipFetch = useRef(false);
  // To close dropdown when user clicks out of autocomplete component
  useClickOutside(autoCompleteRef, () => setShowDropDown(false));

  // Closes the dropdown on Esc button press & also removes & attaches the event listener as per DropDown's state
  useKeyPress(
    closeOnEsc && showDropDown
      ? {
          targetKey: KeyboardEvents.Escape as TKeyboardEvents,
          keyDownCb: () => setShowDropDown(false),
        }
      : {}
  );

  // Handing cache using LRU in memory cache but we can leverage indexDB for persisted caching of the search results with the help of a worker service for better performance
  const LRU = useRef(enableCaching ? new LRUCache(cacheSize) : null);

  // Handles Fetching of data
  useEffect(() => {
    if (skipFetch.current) return; // To skip fetch when selected item is saved in query state
    
    const fetch = async () => {
      try {
        if (enableCaching && LRU.current) {
          const cachedData= LRU.current.get(debounceValue);
          if (cachedData) {
            dispatch({ payload: cachedData, type: PromiseStates.FULFILLED as TPromiseState });
            return;
          }
        }
        
        if (!debounceValue?.length && !getSuggestions) return; // can be moved up
        dispatch({ type: PromiseStates.PENDING  as TPromiseState});
        let data = await getSuggestions(debounceValue, maxVisibleResults);
        if (enableMatchingTextHighLighting && highlightMatchingText) {
          data = highlightMatchingText(debounceValue, data);
        }

        if (enableCaching && LRU.current) LRU.current.set(debounceValue, data);

        dispatch({ payload: data, type: PromiseStates.FULFILLED as TPromiseState });
      } catch (err) {
        dispatch({
          payload: (err as Error)?.message || JSON.stringify(err),
          type: PromiseStates.REJECTED as TPromiseState,
        });
      }
    };

    fetch();
 
    return () => {};
  }, [enableCaching, debounceValue, enableMatchingTextHighLighting, getSuggestions, maxVisibleResults, highlightMatchingText]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target?.value;
    if (skipFetch.current) skipFetch.current = false;
    if (val.length < minInputLength) skipFetch.current = true;
    if (val?.toLowerCase() !== debounceValue) {
      setQuery(val);
      onSelect(null);
      if (!showDropDown) setShowDropDown(true);
    }
    if (!val && showDropDown) {
      setShowDropDown(false);
    }
  };

  const handleSuggestionSelect = (value: string, data: unknown) => {
    skipFetch.current = true;
    setQuery(value);
    onSelect(data);
    if (enableMatchingTextHighLighting && highlightMatchingText) {
      data = highlightMatchingText(value, [data]);
    }
    dispatch({ payload: data, type: PromiseStates.FULFILLED as TPromiseState });
    if (enableCaching && LRU.current) LRU.current.set(value, [data]); // TO cache selected item result
    if (showDropDown) setShowDropDown(false); // close dropdown on select
  };

  const handleInputClear = () => {
    if (!showClearBtn) return;
    onClear();
    setQuery("");
    dispatch({ payload: [], type: PromiseStates.FULFILLED as TPromiseState });
    setShowDropDown(false);
    inputRef.current?.focus();
    onSelect(null);
  };

  return (
    <div className="autocomplete" ref={autoCompleteRef} style={{ width }}>
      <h2 className="autocomplete__title">AutoComplete</h2>
      <div className="autocomplete__input">
        <Input
          onChange={handleOnChange}
          onClick={() => debounceValue && setShowDropDown(true)}
          className="autocomplete__input__field"
          type="text"
          value={query}
          ref={inputRef}
          autoComplete="off"
          autoFocus={autoFocus}
          autoCapitalize={"off"}
          autoCorrect={"off"}
          placeholder={"Search Countries"}
        />
        {/* To clear input Field */}
        {showClearBtn && (
          <Button
            onClick={handleInputClear}
            className="autocomplete__input__clear"
            disabled={!debounceValue?.length}
          >
            ❌
          </Button>
        )}
      </div>

      {/* Renders the suggestions list */}
      {!!showDropDown && !!debounceValue.length ? (
        <SuggestionsDropdown
          query={query}
          handleSuggestionSelect={handleSuggestionSelect}
          isLoading={isLoading}
          suggestions={suggestions}
          renderSuggestion={renderSuggestion}
          height={height}
        >
          <>
            {showLoader && isLoading && (
              <Loader className="autocomplete__search-state" />
            )}
            {!!error.length && !isLoading && (
              <Text variant="p" className="autocomplete__search-state">
                {errorMsg}
              </Text>
            )}
            {debounceValue && !suggestions.length && !isLoading && (
              <Text variant="p" className="autocomplete__search-state">
                {noResultMsg}
              </Text>
            )}
          </>
        </SuggestionsDropdown>
      ) : null}
    </div>
  );
};

export default React.memo(AutoComplete);
