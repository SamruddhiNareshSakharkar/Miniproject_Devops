import React, { useState } from 'react';
import { Search, Edit3, Trash2, CheckCircle2, AlertTriangle, Filter } from 'lucide-react';

export default function CompanyTable({ companies, onEdit, onDelete, financialYear }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = entityFilter === 'ALL' || company.entity_type === entityFilter;
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'COMPLIANT' && company.is_compliant) ||
      (statusFilter === 'NON_COMPLIANT' && !company.is_compliant);
    
    return matchesSearch && matchesEntity && matchesStatus;
  });

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title-group">
          <h2>Registered Companies & EPR Compliance Report</h2>
          <span className="badge-info">{financialYear} Rules</span>
        </div>

        <div className="table-controls">
          <div className="search-input-box">
            <Search size={16} />
            <input 
              type="text"
              placeholder="Search company or location..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="fy-select"
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
          >
            <option value="ALL">All Entity Types</option>
            <option value="Producer">Producer</option>
            <option value="Manufacturer">Manufacturer</option>
            <option value="Recycler">Recycler</option>
            <option value="Refurbisher">Refurbisher</option>
          </select>

          <select 
            className="fy-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Compliance</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="NON_COMPLIANT">Non-Compliant</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Company & Location</th>
              <th>Entity Type</th>
              <th>Annual E-Waste (MT)</th>
              <th>EPR Target ({financialYear})</th>
              <th>Actual Recycled (MT)</th>
              <th>CPCB Registration Fee (₹)</th>
              <th>Compliance Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No companies found matching filters.
                </td>
              </tr>
            ) : (
              filteredCompanies.map(comp => (
                <tr key={comp.id}>
                  <td>
                    <div className="company-cell">
                      <span className="company-name">{comp.name}</span>
                      <span className="company-sub">{comp.location || 'India'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`entity-badge ${comp.entity_type.toLowerCase()}`}>
                      {comp.entity_type}
                    </span>
                  </td>
                  <td>
                    <strong>{comp.annual_waste_mt.toLocaleString('en-IN')}</strong> MT
                  </td>
                  <td>
                    <div>
                      <strong>{comp.target_mt.toLocaleString('en-IN')} MT</strong>
                      <div className="company-sub">{comp.target_percentage}% of annual</div>
                    </div>
                  </td>
                  <td>
                    <strong>{comp.actual_recycled_mt.toLocaleString('en-IN')}</strong> MT
                  </td>
                  <td>
                    <div>
                      <strong style={{ color: '#fbbf24' }}>{comp.fee_formatted}</strong>
                      <div className="company-sub">{comp.fee_slab_label}</div>
                    </div>
                  </td>
                  <td>
                    <div className="company-cell">
                      {comp.is_compliant ? (
                        <span className="status-pill compliant">
                          <CheckCircle2 size={14} />
                          Compliant
                        </span>
                      ) : (
                        <span className="status-pill non-compliant">
                          <AlertTriangle size={14} />
                          Non-Compliant
                        </span>
                      )}

                      <div className="progress-container" style={{ marginTop: '6px' }}>
                        <div className="progress-bar-bg">
                          <div 
                            className={`progress-bar-fill ${comp.is_compliant ? 'compliant' : 'non-compliant'}`}
                            style={{ width: `${Math.min(100, comp.compliance_percentage)}%` }}
                          />
                        </div>
                        <div className="progress-text">
                          {comp.compliance_percentage}% achieved ({comp.is_compliant ? 'Surplus' : `Deficit: ${comp.deficit_mt} MT`})
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        className="btn-icon-only"
                        title="Edit company metrics"
                        onClick={() => onEdit(comp)}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="btn-icon-only btn-danger-ghost"
                        title="Delete company"
                        onClick={() => onDelete(comp.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
