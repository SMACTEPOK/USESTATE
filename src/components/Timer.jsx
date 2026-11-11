import React, { useState, useEffect } from 'react';

export function Timer() {
  const [inputVal, setInputVal] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (timeLeft === 0) setTimeLeft(inputVal);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(inputVal);
  };

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">01 / Таймер зворотного відліку</h2>
      <div className="timer-display">
        {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
      </div>
      {timeLeft === 0 && <p className="timer-done">ЧАС ВИЙШОВ!</p>}
      
      <div className="lab-controls">
        <input 
          type="number" 
          value={inputVal} 
          onChange={e => { setInputVal(+e.target.value); if(!isRunning) setTimeLeft(+e.target.value); }} 
          className="lab-input"
          min="1"
        />
        <button className="btn" onClick={handleStart} disabled={isRunning}>Старт</button>
        <button className="btn" onClick={() => setIsRunning(false)} disabled={!isRunning}>Пауза</button>
        <button className="btn" onClick={handleReset}>Скинути</button>
      </div>
    </div>
  );
}
