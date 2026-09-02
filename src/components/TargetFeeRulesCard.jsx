import React from 'react';
import { Percent, IndianRupee } from 'lucide-react';

export default function TargetFeeRulesCard() {
  return (
    <div className="grid-2col">
      <div className="section-card" style={{ marginBottom: 0 }}>
        <div className="section-title-group" style={{ marginBottom: '16px' }}>
          <Percent size={20} style={{ color: '#818cf8' }} />
          <h3>EPR Recycling Target Schedule</h3>
        </div>
        <table className="mini-table">
          <thead>
            <tr>
              <th>Financial Year</th>
              <th>Mandatory Target %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2023–24 or 2024–25</td>
              <td><strong style={{ color: '#38bdf8' }}>60%</strong></td>
            </tr>
            <tr>
              <td>2025–26 or 2026–27</td>
              <td><strong style={{ color: '#a855f7' }}>70%</strong></td>
            </tr>
            <tr>
              <td>2027–28 onward</td>
              <td><strong style={{ color: '#ec4899' }}>80%</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="section-card" style={{ marginBottom: 0 }}>
        <div className="section-title-group" style={{ marginBottom: '16px' }}>
          <IndianRupee size={20} style={{ color: '#fbbf24' }} />
          <h3>Registration Fee Lookup Slabs</h3>
        </div>
        <table className="mini-table">
          <thead>
            <tr>
              <th>Target Capacity (MT)</th>
              <th>Registration Fee (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Less than 50 MT</td>
              <td><strong>₹2,500</strong></td>
            </tr>
            <tr>
              <td>50 to under 100 MT</td>
              <td><strong>₹7,500</strong></td>
            </tr>
            <tr>
              <td>100 to under 1,000 MT</td>
              <td><strong>₹1,50,000</strong></td>
            </tr>
            <tr>
              <td>1,000 to under 5,000 MT</td>
              <td><strong>₹10,00,000</strong></td>
            </tr>
            <tr>
              <td>More than 5,000 MT</td>
              <td><strong>₹15,00,000</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
