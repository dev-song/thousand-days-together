import { motion } from 'framer-motion';
import { cn } from './lib/utils';

interface DotProps extends React.HTMLAttributes<HTMLSpanElement> {
  coordinate: [number, number];
  delay: number;
  flicker?: boolean;
}

interface DotsProps extends React.HTMLAttributes<HTMLDivElement> {
  coordinates: [number, number][];
}

const Dot = ({ className, coordinate, delay, flicker = false }: DotProps) => {
  const [x, y] = coordinate;
  const transitionDuration = 0.5;
  const starSizesAnimation = [3, 3.5, 3, 2.5];

  return (
    <motion.li
      initial={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
      animate={{ x: x, y: y }}
      transition={{ duration: transitionDuration, delay }}
      className={cn('absolute inline-flex items-center justify-center', className)}
    >
      <motion.span
        className='w-[3px] h-[3px] rounded-full bg-white'
        animate={flicker ? { width: starSizesAnimation, height: starSizesAnimation } : undefined}
        transition={flicker ? { duration: 2, repeat: Infinity } : undefined}
      />
    </motion.li>
  );
};
Dot.displayName = 'Dot';

const Dots = ({ className, coordinates, ...props }: DotsProps) => {
  return (
    <div className={cn('absolute top-0 left-0', className)} {...props}>
      {coordinates.map((_, index) => (
        <Dot
          key={index}
          coordinate={coordinates[index]}
          delay={index * 0.02}
          flicker={index % 20 === 0}
        />
      ))}
    </div>
  );
};
Dots.displayName = 'Dots';

export default Dots;
