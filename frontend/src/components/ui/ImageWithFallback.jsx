import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc, 
  ...props 
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  if (error || !src) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-100 text-gray-400", 
        className
      )}>
        {fallbackSrc ? (
          <img 
            src={fallbackSrc} 
            alt={alt} 
            className={cn("w-full h-full object-cover", className)} 
          />
        ) : (
          <ImageIcon className="w-1/3 h-1/3 opacity-20" />
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
