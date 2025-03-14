import React from "react";

import Image from "../../../common/Image";
import Text from "../../../common/Text";
import "./countrySuggestions.css"
import { CountrySuggestionsProps } from "../../../../types/autoComplete";

// Custom component to render country specific data. We can create more customized suggestion item component & can also make one reusable for the same data format.
const CountrySuggestions: React.FC<CountrySuggestionsProps> = ({
  name,
  flag,
  onSelect,
  highlightedText,
}) => {
  return (
    <div className="country-suggestions" onClick={() => onSelect(name, {name, flag, highlightedText})}>
      <Image
        src={flag?.image}
        alt={flag?.alt}
        className="country-suggestions__img"
        loading="lazy"
      />
      <Text
        variant="p"
        className="country-suggestions__text"
        dangerouslySetInnerHTML={{ __html: highlightedText }} // HTML string is being prepared on Frontend thats why we can avoid the sanitization part for now. we can use DOMpurify to sanitize
      />
    </div>
  );
};

export default CountrySuggestions;
