import React from 'react';
import { Recycle, PlusCircle, RefreshCw, Calendar } from 'lucide-react';

export default function Header({ financialYear, onFyChange, onOpenModal, onResetSample, isResetting }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="logo-badge">
          <Recycle size={28} />
        </div>
        <div className="brand-text">
          <h1>E-Waste EPR Target & Fee Calculator</h1>
          <p>Compliance Portal under India's E-Waste (Management) Rules, 2022</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="fy-selector-box">
          <Calendar size={16} className="text-muted" />
          <label htmlFor="fy-select">Financial Year:</label>
          <select 
            id="fy-select" 
            className="fy-select"
            value={financialYear}
            onChange={(e) => onFyChange(e.target.value)}
          >
            <option value="2023-24">FY 2023–24 (60% Target)</option>
            <option value="2024-25">FY 2024–25 (60% Target)</option>
            <option value="2025-26">FY 2025–26 (70% Target)</option>
            <option value="2026-27">FY 2026–27 (70% Target)</option>
            <option value="2027-28">FY 2027–28+ (80% Target)</option>
          </select>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={onResetSample}
          disabled={isResetting}
          title="Reset data to initial 5 sample companies from CPCB list"
        >
          <RefreshCw size={16} className={isResetting ? 'spin' : ''} />
          Reset 5 Samples
        </button>

        <button 
          className="btn btn-primary"
          onClick={() => onOpenModal(null)}
        >
          <PlusCircle size={18} />
          Register Company
        </button>
      </div>
    </header>
  );
}
