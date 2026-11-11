import React, { useState } from 'react';

export function FormBuilder() {
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldLabel, setNewFieldLabel] = useState('');

  const addField = () => {
    if (!newFieldLabel.trim()) return;
    const id = 'field_' + Date.now();
    const newField = { id, type: newFieldType, label: newFieldLabel, required: true };
    setFields([...fields, newField]);
    setValues({ ...values, [id]: '' });
    setNewFieldLabel('');
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
    const newValues = { ...values };
    delete newValues[id];
    setValues(newValues);
  };

  const handleInputChange = (id, value) => {
    setValues({ ...values, [id]: value });
    validateField(id, value);
  };

  const validateField = (id, value) => {
    const field = fields.find(f => f.id === id);
    let error = '';
    
    if (field.required && !value.trim()) error = 'Обов’язкове поле';
    else if (field.type === 'email' && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) error = 'Невірний email';
    else if (field.type === 'number' && isNaN(value)) error = 'Має бути число';

    setErrors(prev => ({ ...prev, [id]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {};
    
    fields.forEach(f => {
      const val = values[f.id] || '';
      if (f.required && !val.trim()) newErrors[f.id] = 'Обов’язкове поле';
      else if (f.type === 'email' && val && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(val)) newErrors[f.id] = 'Невірний email';
      else if (f.type === 'number' && val && isNaN(val)) newErrors[f.id] = 'Має бути число';
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      hasErrors = true;
    }

    if (!hasErrors) {
      alert('Форма успішно відправлена!\\n' + JSON.stringify(values, null, 2));
    }
  };

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">05 / Конструктор форми</h2>
      
      <div className="builder-controls">
        <select value={newFieldType} onChange={e => setNewFieldType(e.target.value)} className="lab-input">
          <option value="text">Текст (text)</option>
          <option value="number">Число (number)</option>
          <option value="email">Email (email)</option>
        </select>
        <input type="text" placeholder="Назва поля..." value={newFieldLabel} onChange={e => setNewFieldLabel(e.target.value)} className="lab-input" />
        <button className="btn" onClick={addField}>Додати поле</button>
      </div>

      <div className="builder-layout">
        <form onSubmit={handleSubmit} className="generated-form">
          <h4>Згенерована форма</h4>
          {fields.length === 0 && <p className="empty-state">Додайте поля зліва</p>}
          
          {fields.map(f => (
            <div key={f.id} className="form-group">
              <label>{f.label} *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type={f.type} 
                  value={values[f.id] || ''} 
                  onChange={e => handleInputChange(f.id, e.target.value)} 
                  className={`lab-input ${errors[f.id] ? 'input-error' : ''}`}
                  placeholder={f.label}
                />
                <button type="button" className="btn btn--small" onClick={() => removeField(f.id)}>✕</button>
              </div>
              {errors[f.id] && <span className="error-text">{errors[f.id]}</span>}
            </div>
          ))}
          
          {fields.length > 0 && <button type="submit" className="btn" style={{ marginTop: '20px' }}>Відправити</button>}
        </form>

        <div className="json-preview">
          <h4>JSON структура</h4>
          <pre>{JSON.stringify({ fields, values }, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
