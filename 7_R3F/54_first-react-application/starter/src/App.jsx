import { useState, useMemo } from "react";
import Clicker from "./Clicker";
import People from "./People";

export default function App({ clickersCount, children }) {
  const toggleClickerClick = () => {
    setHasClicker(!hasClicker);
  };
  const [hasClicker, setHasClicker] = useState(true);
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((count) => count + 1);
  };

  const array = Array(clickersCount);
  const clickersArray = [...array];

  const colors = useMemo(() => {
    const colors = [];
    for (let i = 0; i < clickersCount; i++)
      colors.push(`hsl(${Math.random() * 360}deg, 100%, 75%)`);

    return colors;
  }, [clickersCount]);

  return (
    <>
      {children}
      <h3>Global Count: {count}</h3>
      <button onClick={toggleClickerClick}>
        {hasClicker ? "Hide" : "Show"} Clicker
      </button>
      {hasClicker && (
        <>
          {[...Array(clickersCount)].map((value, index) => (
            <Clicker
              key={index}
              increment={increment}
              keyName={`count${index}`}
              color={colors[index]}
            />
          ))}
        </>
      )}

      <People />
    </>
  );
}
