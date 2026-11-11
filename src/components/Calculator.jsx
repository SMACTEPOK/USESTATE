import React, { useState } from 'react';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState([]);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [operator, setOperator] = useState(null);
  const [value, setValue] = useState(null);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setOperator(null);
    setValue(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);
    if (value === null) {
      setValue(inputValue);
    } else if (operator) {
      const currentValue = value || 0;
      let newValue = currentValue;
      
      switch (operator) {
        case '+': newValue = currentValue + inputValue; break;
        case '-': newValue = currentValue - inputValue; break;
        case '*': newValue = currentValue * inputValue; break;
        case '/': 
          if (inputValue === 0) {
            setDisplay('Error');
            setValue(null);
            setOperator(null);
            setWaitingForOperand(true);
            return;
          }
          newValue = currentValue / inputValue; 
          break;
        default: break;
      }
      
      setValue(newValue);
      setDisplay(String(newValue));
      setHistory(prev => [...prev, `${currentValue} ${operator} ${inputValue} = ${newValue}`]);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">03 / Калькулятор з історією</h2>
      <div className="calc-grid">
        <div>
          <div className="calc-display">{display}</div>
          <div className="calc-pad">
            <button className="btn" onClick={clear}>C</button>
            <button className="btn" onClick={() => performOperation('/')}>/</button>
            <button className="btn" onClick={() => performOperation('*')}>*</button>
            <button className="btn" onClick={() => performOperation('-')}>-</button>
            
            <button className="btn" onClick={() => inputDigit(7)}>7</button>
            <button className="btn" onClick={() => inputDigit(8)}>8</button>
            <button className="btn" onClick={() => inputDigit(9)}>9</button>
            <button className="btn" onClick={() => performOperation('+')}>+</button>
            
            <button className="btn" onClick={() => inputDigit(4)}>4</button>
            <button className="btn" onClick={() => inputDigit(5)}>5</button>
            <button className="btn" onClick={() => inputDigit(6)}>6</button>
            <button className="btn calc-equals" onClick={() => performOperation('=')}>=</button>
            
            <button className="btn" onClick={() => inputDigit(1)}>1</button>
            <button className="btn" onClick={() => inputDigit(2)}>2</button>
            <button className="btn" onClick={() => inputDigit(3)}>3</button>
            <button className="btn" onClick={() => inputDigit(0)}>0</button>
            
            <button className="btn span-3" onClick={inputDot}>.</button>
          </div>
        </div>
        
        <div className="calc-history">
          <h4>Історія</h4>
          {history.length === 0 && <p className="empty-state">Порожньо</p>}
          <ul>
            {history.map((h, i) => (
              <li key={i} onClick={() => { setDisplay(h.split(' = ')[1]); setWaitingForOperand(true); }}>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
