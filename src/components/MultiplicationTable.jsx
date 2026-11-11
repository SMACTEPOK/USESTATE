import React, { useState } from 'react';

export function MultiplicationTable() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [selected, setSelected] = useState(null);
  const [highlightEven, setHighlightEven] = useState(false);

  const handleCellClick = (r, c) => {
    setSelected({ r, c, value: r * c });
  };

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">02 / Динамічна таблиця множення</h2>
      
      <div className="lab-controls">
        <label>Рядки: <input type="number" min="1" max="10" value={rows} onChange={e => setRows(+e.target.value)} className="lab-input" /></label>
        <label>Стовпці: <input type="number" min="1" max="10" value={cols} onChange={e => setCols(+e.target.value)} className="lab-input" /></label>
        <label className="checkbox-label">
          <input type="checkbox" checked={highlightEven} onChange={e => setHighlightEven(e.target.checked)} />
          Підсвітити парні
        </label>
      </div>

      <div className="table-wrapper">
        <table className="mult-table">
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: cols }).map((_, c) => {
                  const val = (r + 1) * (c + 1);
                  const isEven = val % 2 === 0;
                  return (
                    <td 
                      key={c} 
                      onClick={() => handleCellClick(r + 1, c + 1)}
                      className={`
                        ${highlightEven && isEven ? 'cell-even' : ''} 
                        ${selected?.r === r + 1 && selected?.c === c + 1 ? 'cell-selected' : ''}
                      `}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <p className="table-details">
          Вибрано: <b>{selected.r} × {selected.c} = {selected.value}</b>
        </p>
      )}
    </div>
  );
}
