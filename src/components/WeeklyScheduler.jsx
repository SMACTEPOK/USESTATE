import React, { useState } from 'react';
import './WeeklyScheduler.css';

const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // З 8:00 до 20:00
const COLORS = ['#ff4d00', '#ffe600', '#00e5ff', '#ff00a8', '#d6ff00'];

export function WeeklyScheduler() {
  const [events, setEvents] = useState([]);
  
  // Стан для модального вікна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Стан форми
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 1,
    color: COLORS[0]
  });

  // Перевірка на конфлікт часу
  const checkConflict = (dayIndex, startHour, duration) => {
    return events.some(event => {
      if (event.dayIndex !== dayIndex) return false;
      const existingEnd = event.startHour + event.duration;
      const newEnd = startHour + duration;
      // Умова перетину інтервалів
      return startHour < existingEnd && newEnd > event.startHour;
    });
  };

  // Відкриття вікна додавання
  const handleCellClick = (dayIndex, startHour) => {
    // Перевіряємо, чи не зайнята ця година (чи не є вона частиною іншої події)
    const isOccupied = events.some(e => 
      e.dayIndex === dayIndex && startHour >= e.startHour && startHour < e.startHour + e.duration
    );
    if (isOccupied) return; // Якщо зайнято, ігноруємо клік

    setSelectedSlot({ dayIndex, startHour });
    setFormData({ title: '', description: '', duration: 1, color: COLORS[0] });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  // Додавання події
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Назва події є обов’язковою');
      return;
    }

    // Перевірка виходу за межі робочого дня (20:00)
    if (selectedSlot.startHour + formData.duration > 20) {
      setErrorMsg('Подія не може виходити за межі 20:00');
      return;
    }

    // Перевірка конфлікту
    if (checkConflict(selectedSlot.dayIndex, selectedSlot.startHour, formData.duration)) {
      setErrorMsg('Конфлікт часу! У цей проміжок вже є подія.');
      return;
    }

    const newEvent = {
      id: Date.now(),
      dayIndex: selectedSlot.dayIndex,
      startHour: selectedSlot.startHour,
      duration: Number(formData.duration),
      title: formData.title,
      description: formData.description,
      color: formData.color
    };

    setEvents([...events, newEvent]);
    setIsModalOpen(false);
  };

  // Видалення події
  const handleDeleteEvent = (id) => {
    if (window.confirm('Видалити цю подію?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  // Рендер сітки
  const renderGrid = () => {
    return HOURS.map(hour => (
      <React.Fragment key={hour}>
        {/* Колонка з часом */}
        <div className="time-label">{String(hour).padStart(2, '0')}:00</div>
        
        {/* Клітинки для кожного дня */}
        {DAYS.map((_, dayIndex) => {
          // Шукаємо подію, яка починається саме в цю годину
          const event = events.find(e => e.dayIndex === dayIndex && e.startHour === hour);
          
          // Якщо подія є і вона починається тут — рендеримо її
          if (event) {
            return (
              <div 
                key={`${dayIndex}-${hour}`} 
                className="event-block"
                style={{ 
                  gridRow: `span ${event.duration}`,
                  backgroundColor: event.color,
                  borderColor: '#111'
                }}
                onClick={() => handleDeleteEvent(event.id)}
                title="Клікніть, щоб видалити"
              >
                <div className="event-block__title">{event.title}</div>
                <div className="event-block__desc">{event.description}</div>
                <div className="event-block__time">{event.duration} год.</div>
              </div>
            );
          }

          // Перевіряємо, чи не перекрита ця клітинка подією, що почалася раніше
          const isCovered = events.some(e => 
            e.dayIndex === dayIndex && hour > e.startHour && hour < e.startHour + e.duration
          );
          
          if (isCovered) return null; // Нічого не рендеримо (простір зайнятий block'ом вище)

          // Порожня клітинка
          return (
            <div 
              key={`${dayIndex}-${hour}`} 
              className="empty-cell"
              onClick={() => handleCellClick(dayIndex, hour)}
            >
              +
            </div>
          );
        })}
      </React.Fragment>
    ));
  };

  return (
    <div className="lab-card">
      <div className="scheduler-header">
        <h2 className="lab-card__title">ІНДИВІДУАЛЬНЕ / Планувальник тижня</h2>
        <p className="scheduler-hint">Клікніть на вільну клітинку, щоб додати подію. Клік на подію — видаляє її.</p>
      </div>

      <div className="scheduler-wrapper">
        <div className="scheduler-grid">
          {/* Заголовки днів */}
          <div className="corner-cell"></div>
          {DAYS.map(day => <div key={day} className="day-header">{day}</div>)}
          
          {/* Сітка */}
          {renderGrid()}
        </div>
      </div>

      {/* Модальне вікно додавання */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="modal-content">
            <h3 className="modal-title">
              Нова подія: {DAYS[selectedSlot.dayIndex]}, {String(selectedSlot.startHour).padStart(2, '0')}:00
            </h3>
            
            <form onSubmit={handleAddEvent} className="modal-form">
              {errorMsg && <div className="modal-error">{errorMsg}</div>}
              
              <div className="form-group">
                <label>Назва події *</label>
                <input 
                  type="text" 
                  className="lab-input" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Опис</label>
                <textarea 
                  className="lab-input" 
                  rows="2"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Тривалість (год.)</label>
                  <select 
                    className="lab-input" 
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                  >
                    <option value="1">1 година</option>
                    <option value="2">2 години</option>
                    <option value="3">3 години</option>
                    <option value="4">4 години</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Колір</label>
                  <div className="color-picker-row">
                    {COLORS.map(c => (
                      <button 
                        key={c}
                        type="button"
                        className={`color-dot ${formData.color === c ? 'active' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setFormData({...formData, color: c})}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Скасувати</button>
                <button type="submit" className="btn" style={{ background: 'var(--color-white)' }}>Додати</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
