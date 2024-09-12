import React, { forwardRef } from 'react';
import { cn } from './lib/utils';

interface SlidingDoorsProps extends React.HTMLAttributes<HTMLDivElement> {
  openPercentage: number;
}

const SlidingDoors = forwardRef<HTMLDivElement, SlidingDoorsProps>(
  ({ className, onClick, openPercentage, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative w-64 h-96 bg-gray-100 shadow-lg', className)}
        onClick={onClick}
        {...props}
      >
        {/* Left door */}
        <div
          className='absolute top-0 left-0 w-1/2 h-full bg-gray-600 transition-all duration-300 ease-in-out'
          style={{ left: `-${openPercentage / 2}%` }}
        >
          <div
            className='absolute right-0 w-0 h-full bg-gradient-to-l from-white/80 to-transparent'
            style={{ width: `${Math.max(openPercentage, 1)}%` }}
          />
        </div>

        {/* Right door */}
        <div
          className='absolute top-0 right-0 w-1/2 h-full bg-gray-600 transition-all duration-300 ease-in-out'
          style={{ right: `-${openPercentage / 2}%` }}
        >
          <div
            className='absolute left-0 w-0 h-full bg-gradient-to-r from-white/80 to-transparent'
            style={{ width: `${Math.max(openPercentage, 1)}%` }}
          />
        </div>
      </div>
    );
  },
);
SlidingDoors.displayName = 'SlidingDoors';

export default SlidingDoors;
