import React from 'react';
import { Building2, Scale, ShieldCheck, IndianRupee } from 'lucide-react';

export default function KpiCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon-box indigo">
          <Building2 size={24} />
        </div>
        <div className="kpi-content">
          <div className="kpi-label">Registered Entities</div>
          <div className="kpi-value">{summary.total_companies}</div>
          <div className="kpi-subtext">Manufacturers, Producers, Recyclers</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon-box cyan">
          <Scale size={24} />
        </div>
        <div className="kpi-content">
          <div className="kpi-label">Annual E-Waste Handled</div>
          <div className="kpi-value">{summary.total_annual_waste_mt.toLocaleString('en-IN')} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>MT</span></div>
          <div className="kpi-subtext">EPR Target: {summary.total_target_mt.toLocaleString('en-IN')} MT</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon-box emerald">
          <ShieldCheck size={24} />
        </div>
        <div className="kpi-content">
          <div className="kpi-label">Compliance Rate</div>
          <div className="kpi-value">{summary.compliance_rate}%</div>
          <div className="kpi-subtext">
            {summary.compliant_count} Compliant / {summary.non_compliant_count} Non-Compliant
          </div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon-box amber">
          <IndianRupee size={24} />
        </div>
        <div className="kpi-content">
          <div className="kpi-label">Total CPCB Registration Fees</div>
          <div className="kpi-value">₹{(summary.total_registration_fee / 100000).toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Lakhs</span></div>
          <div className="kpi-subtext">₹{summary.total_registration_fee.toLocaleString('en-IN')} total lookup</div>
        </div>
      </div>
    </div>
  );
}
