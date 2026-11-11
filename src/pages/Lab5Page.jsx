import React from 'react';
import { Timer } from '../components/Timer';
import { MultiplicationTable } from '../components/MultiplicationTable';
import { Calculator } from '../components/Calculator';
import { ProductFilter } from '../components/ProductFilter';
import { FormBuilder } from '../components/FormBuilder';
import { WeeklyScheduler } from '../components/WeeklyScheduler';
import './Lab5Page.css';

export default function Lab5Page() {
  return (
    <div className="lab-page">
      <header className="lab-header">
        <h1 className="lab-title"><br/>USESTATE</h1>
        <p className="lab-subtitle">Управління локальним станом</p>
      </header>

      <main className="lab-main">
        <Timer />
        <MultiplicationTable />
        <Calculator />
        <ProductFilter />
        <FormBuilder />
        <WeeklyScheduler />
      </main>
    </div>
  );
}
