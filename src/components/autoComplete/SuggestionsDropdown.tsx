import React from "react";
import { AutoCompleteProps } from "../../types/autoComplete";

type TSuggestionsDropdownProps = Pick<
  AutoCompleteProps,
  "showLoader" | "renderSuggestion" | "height"
>;

interface SuggestionsDropdownProps<T> extends TSuggestionsDropdownProps {
  isLoading?: boolean;
  query?: string;
  suggestions: T[];
  handleSuggestionSelect: (value: string, data: T) => void;
  children?: React.ReactNode;
}

const SuggestionsDropdown = <T,>({
  height,
  isLoading = false,
  query,
  suggestions,
  renderSuggestion,
  handleSuggestionSelect,
  children,
}: SuggestionsDropdownProps<T>): React.ReactElement => {
  return (
    <div className="autocomplete__list-wrapper" style={{ maxHeight: height }}>
      {children}
      {
        <ul className="autocomplete__list">
          {query &&
            !!suggestions.length &&
            !isLoading &&
            suggestions.map((item: any) => {
              return (
                <li key={item.id} className={`autocomplete__list__item`}>
                  {renderSuggestion
                    ? renderSuggestion({
                        ...item,
                        onSelect: handleSuggestionSelect,
                      })
                    : null}
                </li>
              );
            })}
        </ul>
      }
    </div>
  );
};

export default SuggestionsDropdown;
