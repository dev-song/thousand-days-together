import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import SlidingDoors from './SlidingDoors';
// import { beforeRelationshipEvents } from './assets/events';
import Dots from './Dots';

type MessageContextProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const MessageContext = createContext<MessageContextProps>({
  message: '',
  setMessage: () => {},
});

const progressTo0 = -100;
const progressOnEachClick = 20;
const days = 1000;

function App() {
  const doorRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [progress, setProgress] = useState(progressTo0);
  const isDoorOpened = progress >= 0;
  const increaseProgressBefore0 = useCallback(() => {
    setProgress((prev) => Math.min(prev + progressOnEachClick, 0));
  }, []);

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
    if (progress < progressTo0) return;

    const interval =
      progress < 0
        ? setInterval(() => setProgress((prev) => Math.max(progressTo0, prev - 1)), 100)
        : setInterval(() => setCount((cnt) => Math.min(cnt + 1, days)), 20);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      <h3 className='z-10 absolute w-full top-40 text-4xl text-white/80 text-center'>{count}</h3>
      <div className='relative w-screen h-screen flex items-center justify-center bg-gray-900'>
        <SlidingDoors
          ref={doorRef}
          className='z-10 shadow-white/30'
          openPercentage={progress + 100}
          onClick={increaseProgressBefore0}
        />
        <Dots className='w-full h-full' coordinates={coordinates.slice(0, count)} />
      </div>
    </MessageContext.Provider>
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
