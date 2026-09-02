import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import CompanyTable from './components/CompanyTable';
import CompanyFormModal from './components/CompanyFormModal';
import RegulatoryExplanation from './components/RegulatoryExplanation';
import TargetFeeRulesCard from './components/TargetFeeRulesCard';
import { dataService } from './services/dataService';

export default function App() {
  const [financialYear, setFinancialYear] = useState('2024-25');
  const [companies, setCompanies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Fetch Companies & Summary Metrics (Hybrid API + Local Fallback)
  const fetchData = useCallback(async (fy = financialYear) => {
    try {
      setLoading(true);
      const result = await dataService.fetchData(fy);
      setCompanies(result.companies || []);
      setSummary(result.summary || null);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [financialYear]);

  useEffect(() => {
    fetchData(financialYear);
  }, [financialYear, fetchData]);

  // Handle FY Change
  const handleFyChange = (newFy) => {
    setFinancialYear(newFy);
  };

  // Open Modal for Create or Edit
  const handleOpenModal = (company = null) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  // Save Company (POST / PUT)
  const handleSaveCompany = async (formData, companyId) => {
    try {
      await dataService.saveCompany(formData, companyId, financialYear);
      setIsModalOpen(false);
      setEditingCompany(null);
      fetchData(financialYear);
    } catch (err) {
      console.error('Error saving company:', err);
      alert('Failed to save company information.');
    }
  };

  // Delete Company (DELETE)
  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this registered company?')) return;
    try {
      await dataService.deleteCompany(companyId);
      fetchData(financialYear);
    } catch (err) {
      console.error('Error deleting company:', err);
    }
  };

  // Reset to initial 5 sample companies
  const handleResetSample = async () => {
    try {
      setIsResetting(true);
      await dataService.resetSample(financialYear);
      fetchData(financialYear);
    } catch (err) {
      console.error('Error resetting sample data:', err);
    } finally {
      setIsResetting(false);
    }
  };


  return (
    <div className="app-container">
      <Header 
        financialYear={financialYear}
        onFyChange={handleFyChange}
        onOpenModal={handleOpenModal}
        onResetSample={handleResetSample}
        isResetting={isResetting}
      />

      <KpiCards summary={summary} />

      <CompanyTable 
        companies={companies}
        onEdit={handleOpenModal}
        onDelete={handleDeleteCompany}
        financialYear={financialYear}
      />

      <TargetFeeRulesCard />

      <RegulatoryExplanation />

      <CompanyFormModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCompany(null);
        }}
        onSave={handleSaveCompany}
        companyToEdit={editingCompany}
      />
    </div>
  );
}
