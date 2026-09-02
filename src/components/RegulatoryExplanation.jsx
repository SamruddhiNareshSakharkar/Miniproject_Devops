import React from 'react';
import { BookOpen, ShieldCheck, FileText, Scale } from 'lucide-react';

export default function RegulatoryExplanation() {
  return (
    <div className="section-card">
      <div className="section-title-group" style={{ marginBottom: '20px' }}>
        <BookOpen size={24} style={{ color: '#a5b4fc' }} />
        <h2>CPCB E-Waste Rules 2022 — Regulatory Clause Mapping</h2>
      </div>

      <div className="alert-box">
        <FileText size={18} style={{ shrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Legal Basis & Regulatory Reference:</strong> Calculations in this application strictly enforce the 
          <strong> Central Pollution Control Board (CPCB) FAQ</strong> and notified statutory provisions under India's 
          <strong> E-Waste (Management) Rules, 2022</strong>.
        </div>
      </div>

      <div className="grid-2col" style={{ marginBottom: 0 }}>
        <div className="rule-card">
          <h3>
            <Scale size={18} />
            Rule 4 & Schedule III: EPR Recycling Target Formulas
          </h3>
          <p>
            Under <strong>Rule 4 & Schedule III</strong> of India's E-Waste (Management) Rules 2022, every registered Manufacturer, Producer, Recycler, or Refurbisher is legally mandated to achieve annual Extended Producer Responsibility (EPR) recycling targets calculated as:
          </p>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', margin: '10px 0', fontFamily: 'monospace', color: '#38bdf8' }}>
            EPR Target (MT) = Annual E-Waste Generated (MT) × Target %
          </div>
          <p>
            The mandatory percentage starts at <strong>60%</strong> for FY 2023–24 & FY 2024–25, steps up to <strong>70%</strong> for FY 2025–26 & FY 2026–27, and reaches <strong>80%</strong> from FY 2027–28 onward.
          </p>
        </div>

        <div className="rule-card">
          <h3>
            <ShieldCheck size={18} />
            Rule 14 & Section 16: Registration Fee Tiers & Compliance Audits
          </h3>
          <p>
            Per <strong>Rule 14 & CPCB Portal Guidelines</strong>, official registration fees are computed directly from the company's annual recycling target (MT) using 5 statutory fee brackets ranging from <strong>₹2,500</strong> (for targets &lt; 50 MT) to <strong>₹15,00,000</strong> (for targets &gt; 5,000 MT).
          </p>
          <p style={{ marginTop: '8px' }}>
            Under <strong>Section 16</strong>, compliance status is evaluated as <em>Compliant</em> when actual verified recycling meets or exceeds the EPR target (MT), while non-compliance triggers environmental compensation under CPCB audit guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
