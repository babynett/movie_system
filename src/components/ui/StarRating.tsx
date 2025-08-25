"use client";
import React, { useState } from 'react';
import { Star } from 'phosphor-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 20,
  maxRating = 10
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = (newRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating: number) => {
    if (!readonly) {
      setHoverRating(newRating);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
      setIsHovering(false);
    }
  };

  const displayRating = isHovering ? hoverRating : rating;
  const numberOfStars = 5; // Always show 5 stars, but map to maxRating scale

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(numberOfStars)].map((_, index) => {
          const starValue = ((index + 1) / numberOfStars) * maxRating;
          const isFilled = displayRating >= starValue;
          const isHalfFilled = displayRating >= starValue - (maxRating / numberOfStars / 2) && displayRating < starValue;

          return (
            <button
              key={index}
              type="button"
              className={`transition-all duration-150 ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
            >
              <Star
                size={size}
                weight={isFilled ? 'fill' : isHalfFilled ? 'duotone' : 'regular'}
                className={`${
                  isFilled 
                    ? 'text-yellow-400' 
                    : isHalfFilled 
                    ? 'text-yellow-300' 
                    : 'text-gray-300'
                } ${!readonly && 'hover:text-yellow-500'}`}
              />
            </button>
          );
        })}
      </div>
      
      <span className="text-sm text-gray-600 ml-2 min-w-[2rem]">
        {displayRating > 0 ? displayRating.toFixed(1) : '—'}
      </span>
    </div>
  );
};

export default StarRating;
