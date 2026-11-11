import React, { useState } from 'react';
import { initialProducts } from '../data/products';

export function ProductFilter() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [sortDir, setSortDir] = useState('asc');

  let activeFilters = 0;
  if (search) activeFilters++;
  if (category !== 'all') activeFilters++;
  if (minPrice) activeFilters++;
  if (maxPrice) activeFilters++;
  if (sortBy !== 'none') activeFilters++;

  const resetFilters = () => {
    setSearch(''); setCategory('all'); setMinPrice(''); setMaxPrice(''); setSortBy('none'); setSortDir('asc');
  };

  let result = initialProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || p.category === category;
    const matchMin = minPrice === '' || p.price >= +minPrice;
    const matchMax = maxPrice === '' || p.price <= +maxPrice;
    return matchSearch && matchCat && matchMin && matchMax;
  });

  if (sortBy !== 'none') {
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const categories = ['all', ...new Set(initialProducts.map(p => p.category))];

  return (
    <div className="lab-card">
      <h2 className="lab-card__title">04 / Система фільтрації та сортування</h2>
      
      <div className="filter-bar">
        <input type="text" placeholder="Пошук..." value={search} onChange={e => setSearch(e.target.value)} className="lab-input" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="lab-input">
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Всі категорії' : c}</option>)}
        </select>
        <input type="number" placeholder="Мін. ціна" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="lab-input" />
        <input type="number" placeholder="Макс. ціна" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="lab-input" />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="lab-input">
          <option value="none">Без сортування</option>
          <option value="name">За назвою</option>
          <option value="price">За ціною</option>
          <option value="rating">За рейтингом</option>
        </select>
        <button className="btn" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
          {sortDir === 'asc' ? '▲ За зрост.' : '▼ За спад.'}
        </button>
      </div>

      <div className="filter-meta">
        <span>Активних фільтрів: <b>{activeFilters}</b></span>
        {activeFilters > 0 && <button className="btn btn--small" onClick={resetFilters}>Скинути все</button>}
      </div>

      {result.length === 0 ? (
        <p className="empty-state">Нічого не знайдено</p>
      ) : (
        <div className="product-grid">
          {result.map(p => (
            <div key={p.id} className="product-item">
              <div className="product-item__header">
                <span>{p.category}</span>
                <span>★ {p.rating}</span>
              </div>
              <h3>{p.name}</h3>
              <p className="product-item__price">{p.price} грн</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
