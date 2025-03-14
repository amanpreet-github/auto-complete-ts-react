import React from 'react';
import Text from '../Text';
import './loader.css'

interface LoaderProps {
  text?: string;
  className?: string 
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading...", className='' }) => {
  return (
    <Text variant="p" className={`loader ${className}`}>
      {text}
    </Text>
  );
};

export default Loader;