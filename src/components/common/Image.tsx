import React from 'react';

const Image: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  src = "",
  alt = "",
  className = "",
  loading,
  ...props
}) => {
  return (
    <img src={src} alt={alt} className={className} loading={loading} {...props} />
  );
};

export default Image;