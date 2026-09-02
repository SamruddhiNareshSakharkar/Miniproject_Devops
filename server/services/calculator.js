/**
 * E-Waste EPR Target & Registration Fee Calculator Service
 * Based on CPCB FAQ & E-Waste (Management) Rules, 2022
 */

// Target Percentage Schedule under E-Waste Rules 2022
const TARGET_SCHEDULE = {
  '2023-24': { percentage: 60, label: '60% Target' },
  '2024-25': { percentage: 60, label: '60% Target' },
  '2025-26': { percentage: 70, label: '70% Target' },
  '2026-27': { percentage: 70, label: '70% Target' },
  '2027-28': { percentage: 80, label: '80% Target (2027-28 Onward)' },
};

// CPCB Fee Structure Schedule based on EPR Target (MT)
const FEE_SLABS = [
  { max: 50, fee: 2500, label: 'Less than 50 MT', formatted: '₹2,500' },
  { max: 100, fee: 7500, label: '50 to under 100 MT', formatted: '₹7,500' },
  { max: 1000, fee: 150000, label: '100 to under 1,000 MT', formatted: '₹1,50,000' },
  { max: 5000, fee: 1000000, label: '1,000 to under 5,000 MT', formatted: '₹10,00,000' },
  { max: Infinity, fee: 1500000, label: 'More than 5,000 MT', formatted: '₹15,00,000' }
];

/**
 * Get target percentage for a financial year
 */
function getTargetPercentage(financialYear) {
  const schedule = TARGET_SCHEDULE[financialYear];
  if (!schedule) {
    // Default fallback to 80% if year is 2027-28 or later
    return { percentage: 80, label: '80% Target (2027-28 Onward)' };
  }
  return schedule;
}

/**
 * Calculate EPR Registration Fee based on target MT
 */
function calculateRegistrationFee(targetMT) {
  const slab = FEE_SLABS.find(s => targetMT < s.max) || FEE_SLABS[FEE_SLABS.length - 1];
  return slab;
}

/**
 * Format Indian Rupee currency standard
 */
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Process company calculations for a specific financial year
 */
function calculateCompanyMetrics(company, financialYear = '2024-25') {
  const annualWaste = parseFloat(company.annual_waste_mt) || 0;
  const actualRecycled = parseFloat(company.actual_recycled_mt) || 0;

  const targetInfo = getTargetPercentage(financialYear);
  const targetMT = Number((annualWaste * (targetInfo.percentage / 100)).toFixed(2));
  const feeInfo = calculateRegistrationFee(targetMT);
  
  const isCompliant = actualRecycled >= targetMT;
  const deficitMT = isCompliant ? 0 : Number((targetMT - actualRecycled).toFixed(2));
  const compliancePercentage = targetMT > 0 
    ? Number(Math.min(100, (actualRecycled / targetMT) * 100).toFixed(1))
    : 100;

  return {
    ...company,
    financial_year: financialYear,
    target_percentage: targetInfo.percentage,
    target_mt: targetMT,
    fee_amount: feeInfo.fee,
    fee_slab_label: feeInfo.label,
    fee_formatted: formatINR(feeInfo.fee),
    is_compliant: isCompliant,
    compliance_status: isCompliant ? 'Compliant' : 'Non-Compliant',
    compliance_percentage: compliancePercentage,
    deficit_mt: deficitMT
  };
}

module.exports = {
  TARGET_SCHEDULE,
  FEE_SLABS,
  getTargetPercentage,
  calculateRegistrationFee,
  calculateCompanyMetrics,
  formatINR
};
