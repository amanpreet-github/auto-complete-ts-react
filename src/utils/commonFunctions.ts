
export function objectToQueryString(obj: Record<string, any>): string {
  return new URLSearchParams(obj).toString();
}

export const getHighlightedMatchingText = (query: string, str: string, className = '') => str.replace(new RegExp(query, 'gi'), (match) => (`<mark className={${className}}>${match}</mark>`))