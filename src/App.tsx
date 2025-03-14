import React, {useState} from "react";

import AutoComplete from "./components/autoComplete/AutoComplete";
import CountrySuggestions from "./components/autoComplete/customSuggestions/CountrySuggestions/CountrySuggestions";
import commonMsgs from "./utils/messages";
import {
  getHighlightedMatchingText,
  objectToQueryString,
} from "./utils/commonFunctions";
import {
  TCountrySuggestions,
} from "./types/autoComplete";
import { HTTPMethods } from "./const/common";
import {FetchUtil } from "./types/fetch";
import {THTTPMethods } from "./types/commonTypes";
import "./App.css";
import APIEndPoints from "./services/api/apiEndPoints";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import fetchUtil from "./services/api/api";
import Image from "./components/common/Image";
import Text from "./components/common/Text";


const highlightMatchingText = (query: string, data:  TCountrySuggestions[]) => {
  return data?.map((e: TCountrySuggestions) => {
    const { name = "" }: TCountrySuggestions = e;
    return {
      ...e,
      highlightedText: getHighlightedMatchingText(query, name),
    };
  });
};

const getSearchedCountryData = async (
  query: string,
  maxVisibleResults: number,
  page: number = 1 
) => {
  try {
    const urlPath = query
      ? `${APIEndPoints.searchCountries}${objectToQueryString({
          query: query,
          limit: maxVisibleResults,
          page,
        })}`
      : "";

    if (!urlPath) return;

    const fetchUtilArgs: FetchUtil = {
      urlPath,
      method: HTTPMethods.GET as THTTPMethods,
    };

    const {data = []} = await fetchUtil(fetchUtilArgs);
    return data;
  } catch (error) {
    console.error(error);
  }
};

function App() {
  const [selectedData, setSelectedData] = useState<TCountrySuggestions | null>(null);

  const handleOnSelect = (data: unknown): void => {
    setSelectedData(data as TCountrySuggestions);
  }

  return (
    <div className="App">
      <ErrorBoundary>
        <AutoComplete
          getSuggestions={getSearchedCountryData}
          maxVisibleResults={10}
          errorMsg={commonMsgs.errAndRetry}
          noResultMsg={commonMsgs.noMatchFound}
          minInputLength={1}
          debounceDelay={500}
          enableCaching={true}
          cacheSize={5}
          showClearBtn={true}
          showLoader={true}
          width={"20rem"}
          height={"22rem"}
          closeOnEsc={true}
          enableMatchingTextHighLighting={true}
          highlightMatchingText={highlightMatchingText}
          renderSuggestion={(props) => <CountrySuggestions {...props} />}
          selectUsingKeyboard={false}
          onSelect={handleOnSelect}
          autoFocus={false}
          // We can also extend it with feature such as showMoreButton or showMoreOnScroll (using intersection Observer)
          // We can add keyboard events such as navigate on list items using arrow keys etc.
        />
      </ErrorBoundary>
     {selectedData && <div className="selected-item">
        <Image
          src={selectedData?.flag?.image}
          alt={selectedData?.flag?.alt}
        />
        <Text variant={'h1'} >{selectedData?.name}</Text>
      </div>}
    </div>
  );
}

export default App;
