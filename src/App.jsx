import React from 'react';
import Lab5Page from './pages/Lab5Page';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark">✱</span>
          <span className="app__brand-tag">LAB 5</span>
        </div>
      </header>
      <main className="app__main">
        <Lab5Page />
      </main>
      <footer className="app__footer">
        <p>© 2026 · Лабораторна робота 5 · useState</p>
      </footer>
    </div>
  );
}

export default App;
