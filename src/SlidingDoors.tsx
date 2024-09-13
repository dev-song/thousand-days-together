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
        className={cn('relative w-64 h-96 bg-gray-200 shadow-lg', className)}
        onClick={onClick}
        {...props}
      >
        {/* Left door */}
        <div
          className='absolute top-0 left-0 w-1/2 h-full bg-gray-700 shadow-inner transition-all duration-300 ease-in-out before:absolute before:top-1/2 before:right-4 before:h-12 before:w-[2px] before:-translate-y-1/2 before:bg-gray-900'
          style={{ left: `-${openPercentage / 2}%` }}
        >
          <div
            className='absolute right-0 w-0 h-full bg-gradient-to-l from-gray-200 to-transparent'
            style={{ width: `${Math.max(openPercentage / 2, 1 / 2)}%` }}
          />
        </div>

        {/* Right door */}
        <div
          className='absolute top-0 right-0 w-1/2 h-full bg-gray-700 shadow-inner transition-all duration-300 ease-in-out before:absolute before:top-1/2 before:left-4 before:h-12 before:w-[2px] before:-translate-y-1/2 before:bg-gray-900'
          style={{ right: `-${openPercentage / 2}%` }}
        >
          <div
            className='absolute left-0 w-0 h-full bg-gradient-to-r from-gray-200 to-transparent'
            style={{ width: `${Math.max(openPercentage / 2, 1 / 2)}%` }}
          />
        </div>
      </div>
    );
  },
);
SlidingDoors.displayName = 'SlidingDoors';

export default SlidingDoors;
