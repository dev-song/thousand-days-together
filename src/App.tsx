import { useCallback, useEffect, useRef, useState } from 'react';
import SlidingDoors from './SlidingDoors';
import Dots from './Dots';
import { motion } from 'framer-motion';

const beforeRelationshipEvents = [
  { type: 'text', value: '안녕하세요' },
  { type: 'text', value: '반가워요' },
  { type: 'text', value: '상암, 커피와 함께 이러쿵저러쿵' },
  { type: 'text', value: '일산, 호수공원과 피자' },
  { type: 'text', value: '강남, 위스키 시음 후 횡설수설' },
  { type: 'text', value: '종묘, 막걸리 한 잔에 건네는 위로' },
  { type: 'text', value: '종로, 끝내주는 노가리 그리고 생맥주' },
  { type: 'text', value: '망원, 장화 신은 고양이에서의 만찬' },
];

const statusMessages = {
  configure: 'configuring relationship...',
  established: 'relationship established',
};

const progressComplete = 100;
const progressOnEachClick = beforeRelationshipEvents.length;
const autoProgressDecrease = 1;
const autoProgressDecreaseInterval = 100;
const days = 1000;
const countInterval = 50;

function App() {
  const doorRef = useRef<HTMLDivElement>(null);
  const [relationshipMessage, setRelationshipMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [count, setCount] = useState(0);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [progress, setProgress] = useState(0);
  const isDoorOpened = progress >= 0;
  const increaseProgressUntilComplete = useCallback(() => {
    setProgress((prev) => Math.min(prev + progressOnEachClick, progressComplete));
    setRelationshipMessage(beforeRelationshipEvents[Math.floor(progress / 10)].value);
    console.log('progress', progress, beforeRelationshipEvents[Math.floor(progress / 10)].value);
  }, [progress]);

  useEffect(() => {
    if (!doorRef.current) return;

    const { x, y, width, height } = doorRef.current.getBoundingClientRect();
    const openedDoorArea = { x: x - width / 2, y, width: width * 2, height };
    const coordinates = !isDoorOpened
      ? new Array(1000).fill([window.innerWidth / 2, window.innerHeight / 2])
      : generateDotCoordinatesInScreen(days, openedDoorArea);
    setCoordinates(coordinates);
  }, [isDoorOpened]);

  useEffect(() => {
    if (progress < 0) return;

    setStatusMessage(
      progress < progressComplete ? statusMessages.configure : statusMessages.established,
    );

    const interval =
      progress < progressComplete
        ? setInterval(
            () => setProgress((prev) => Math.max(0, prev - autoProgressDecrease)),
            autoProgressDecreaseInterval,
          )
        : setInterval(() => setCount((cnt) => Math.min(cnt + 1, days)), countInterval);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <main>
      {!count ? (
        <motion.h3
          key={relationshipMessage}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
          className='z-10 absolute top-40 w-full text-2xl text-center text-white/80'
        >
          {relationshipMessage}
        </motion.h3>
      ) : (
        <h3 className='z-10 absolute top-40 left-1/2 px-2 py-1 -translate-x-16 rounded text-2xl text-center text-white/80 bg-white/20'>
          Day {count}
        </h3>
      )}
      <div className='relative w-screen h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.7),rgba(0,0,0,0.9))]'>
        <SlidingDoors
          ref={doorRef}
          className='z-10'
          openPercentage={progress}
          onClick={increaseProgressUntilComplete}
        />
        <Dots
          className='w-full h-full'
          coordinates={coordinates.slice(0, count)}
          interval={countInterval / 1000}
        />
      </div>
      <p className='z-10 absolute bottom-40 w-full mt-4 text-white/60 text-center'>
        {statusMessage}
      </p>
    </main>
  );
}

export default App;

function generateDotCoordinatesInScreen(
  numDots: number,
  avoidArea = { x: 0, y: 0, width: 0, height: 0 },
): [number, number][] {
  const coordinates = [];
  const avoidMargin = 50;

  function generateRandomPointInScreen() {
    const x = Math.random() * (window.innerWidth - avoidMargin * 2) + avoidMargin;
    const y = Math.random() * (window.innerHeight - avoidMargin * 2) + avoidMargin;
    return { x, y };
  }

  function isInAvoidArea(x: number, y: number) {
    return (
      x >= avoidArea.x - avoidMargin &&
      x <= avoidArea.x + avoidArea.width + avoidMargin &&
      y >= avoidArea.y - avoidMargin &&
      y <= avoidArea.y + avoidArea.height + avoidMargin
    );
  }

  while (coordinates.length < numDots) {
    const { x, y } = generateRandomPointInScreen();

    if (!isInAvoidArea(x, y)) {
      coordinates.push([x, y] as [number, number]);
    }
  }

  return coordinates;
}
