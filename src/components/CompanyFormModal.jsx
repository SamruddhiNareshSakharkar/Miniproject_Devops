import React, { useState, useEffect } from 'react';
import { X, Building2, Save } from 'lucide-react';

export default function CompanyFormModal({ isOpen, onClose, onSave, companyToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    entity_type: 'Producer',
    annual_waste_mt: '',
    actual_recycled_mt: '',
    location: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (companyToEdit) {
      setFormData({
        name: companyToEdit.name || '',
        entity_type: companyToEdit.entity_type || 'Producer',
        annual_waste_mt: companyToEdit.annual_waste_mt !== undefined ? companyToEdit.annual_waste_mt : '',
        actual_recycled_mt: companyToEdit.actual_recycled_mt !== undefined ? companyToEdit.actual_recycled_mt : '',
        location: companyToEdit.location || ''
      });
    } else {
      setFormData({
        name: '',
        entity_type: 'Producer',
        annual_waste_mt: '',
        actual_recycled_mt: '',
        location: ''
      });
    }
    setErrors({});
  }, [companyToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Company Name is required';
    if (!formData.annual_waste_mt || parseFloat(formData.annual_waste_mt) < 0) {
      newErrors.annual_waste_mt = 'Valid Annual E-Waste in MT is required';
    }
    if (formData.actual_recycled_mt === '' || parseFloat(formData.actual_recycled_mt) < 0) {
      newErrors.actual_recycled_mt = 'Valid Actual Recycled MT is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData, companyToEdit ? companyToEdit.id : null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={20} className="text-muted" />
            <h3>{companyToEdit ? 'Edit Company Registration' : 'Register New Electronics Company'}</h3>
          </div>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Dixon Technologies, Tata Electronics"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span style={{ color: '#f43f5e', fontSize: '0.78rem' }}>{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Entity Type *</label>
              <select 
                className="form-control"
                value={formData.entity_type}
                onChange={(e) => setFormData({ ...formData, entity_type: e.target.value })}
              >
                <option value="Manufacturer">Manufacturer</option>
                <option value="Producer">Producer</option>
                <option value="Recycler">Recycler</option>
                <option value="Refurbisher">Refurbisher</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location / City</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Noida, UP or Sriperumbudur, TN"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Annual E-Waste Handled (MT) *</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                className="form-control"
                placeholder="Metric Tonnes per annum"
                value={formData.annual_waste_mt}
                onChange={(e) => setFormData({ ...formData, annual_waste_mt: e.target.value })}
              />
              {errors.annual_waste_mt && <span style={{ color: '#f43f5e', fontSize: '0.78rem' }}>{errors.annual_waste_mt}</span>}
            </div>

            <div className="form-group">
              <label>Actual Recycled (MT) *</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                className="form-control"
                placeholder="Actual recycled tonnage"
                value={formData.actual_recycled_mt}
                onChange={(e) => setFormData({ ...formData, actual_recycled_mt: e.target.value })}
              />
              {errors.actual_recycled_mt && <span style={{ color: '#f43f5e', fontSize: '0.78rem' }}>{errors.actual_recycled_mt}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              {companyToEdit ? 'Update Company' : 'Save & Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
