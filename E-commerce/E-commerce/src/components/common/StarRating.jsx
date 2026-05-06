import { useState } from 'react';
import { HiStar } from 'react-icons/hi';

const StarRating = ({ value = 0, onChange, readonly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform duration-100 ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          <HiStar
            className={`${sizes[size]} transition-colors duration-150 ${
              star <= (hovered || value) ? 'text-accent' : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
