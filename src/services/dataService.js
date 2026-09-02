import { calculateCompanyMetrics } from './calculator';

const STORAGE_KEY = 'ewaste_cpcb_companies_store';

const DEFAULT_SAMPLE_COMPANIES = [
  {
    id: "comp-1",
    name: "Dixon Technologies",
    entity_type: "Producer",
    annual_waste_mt: 5200,
    actual_recycled_mt: 4200,
    established_year: 1993,
    location: "Noida, UP"
  },
  {
    id: "comp-2",
    name: "Foxconn India",
    entity_type: "Manufacturer",
    annual_waste_mt: 1250,
    actual_recycled_mt: 700,
    established_year: 2006,
    location: "Sriperumbudur, Tamil Nadu"
  },
  {
    id: "comp-3",
    name: "Tata Electronics",
    entity_type: "Manufacturer",
    annual_waste_mt: 480,
    actual_recycled_mt: 350,
    established_year: 2020,
    location: "Hosur, Tamil Nadu"
  },
  {
    id: "comp-4",
    name: "Kaynes Technology",
    entity_type: "Producer",
    annual_waste_mt: 85,
    actual_recycled_mt: 40,
    established_year: 1988,
    location: "Mysuru, Karnataka"
  },
  {
    id: "comp-5",
    name: "Centum Electronics",
    entity_type: "Refurbisher",
    annual_waste_mt: 30,
    actual_recycled_mt: 22,
    established_year: 1994,
    location: "Bengaluru, Karnataka"
  }
];

// LocalStorage helpers
function getLocalCompanies() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_COMPANIES));
      return DEFAULT_SAMPLE_COMPANIES;
    }
    return JSON.parse(saved);
  } catch (e) {
    console.warn('localStorage not accessible, using in-memory default:', e);
    return DEFAULT_SAMPLE_COMPANIES;
  }
}

function saveLocalCompanies(companies) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

function computeSummary(calculatedCompanies, financialYear) {
  const totalCompanies = calculatedCompanies.length;
  const totalAnnualWaste = calculatedCompanies.reduce((acc, c) => acc + (c.annual_waste_mt || 0), 0);
  const totalTargetMT = calculatedCompanies.reduce((acc, c) => acc + (c.target_mt || 0), 0);
  const totalActualRecycled = calculatedCompanies.reduce((acc, c) => acc + (c.actual_recycled_mt || 0), 0);
  const totalRegistrationFee = calculatedCompanies.reduce((acc, c) => acc + (c.fee_amount || 0), 0);
  const compliantCount = calculatedCompanies.filter(c => c.is_compliant).length;
  const nonCompliantCount = totalCompanies - compliantCount;

  return {
    total_companies: totalCompanies,
    total_annual_waste_mt: Number(totalAnnualWaste.toFixed(2)),
    total_target_mt: Number(totalTargetMT.toFixed(2)),
    total_actual_recycled_mt: Number(totalActualRecycled.toFixed(2)),
    total_registration_fee: totalRegistrationFee,
    compliant_count: compliantCount,
    non_compliant_count: nonCompliantCount,
    compliance_rate: totalCompanies > 0 ? Number(((compliantCount / totalCompanies) * 100).toFixed(1)) : 0
  };
}

export const dataService = {
  /**
   * Fetch company list & summary metrics
   * Tries backend API first; falls back smoothly to client calculations
   */
  async fetchData(financialYear = '2024-25') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const [compRes, sumRes] = await Promise.all([
        fetch(`/api/companies?fy=${financialYear}`, { signal: controller.signal }),
        fetch(`/api/summary?fy=${financialYear}`, { signal: controller.signal })
      ]);
      clearTimeout(timeoutId);

      // Check if response is valid JSON (and not an HTML 404 page)
      const contentType1 = compRes.headers.get('content-type') || '';
      const contentType2 = sumRes.headers.get('content-type') || '';

      if (compRes.ok && sumRes.ok && contentType1.includes('json') && contentType2.includes('json')) {
        const compData = await compRes.json();
        const sumData = await sumRes.json();
        if (compData.success && sumData.success) {
          return {
            companies: compData.companies,
            summary: sumData.summary,
            source: 'api'
          };
        }
      }
      throw new Error('API returned non-JSON or unsuccessful status');
    } catch (err) {
      // Offline / Static deployment fallback
      const rawCompanies = getLocalCompanies();
      const calculated = rawCompanies.map(c => calculateCompanyMetrics(c, financialYear));
      const summary = computeSummary(calculated, financialYear);
      return {
        companies: calculated,
        summary: summary,
        source: 'local'
      };
    }
  },

  /**
   * Save (create or update) company
   */
  async saveCompany(formData, companyId, financialYear = '2024-25') {
    try {
      const url = companyId 
        ? `/api/companies/${companyId}?fy=${financialYear}` 
        : `/api/companies?fy=${financialYear}`;
      const method = companyId ? 'PUT' : 'POST';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('json')) {
        const data = await res.json();
        if (data.success) return { success: true };
      }
      throw new Error('API save failed');
    } catch (err) {
      // Local fallback
      const companies = getLocalCompanies();
      if (companyId) {
        const index = companies.findIndex(c => c.id === companyId);
        if (index !== -1) {
          companies[index] = {
            ...companies[index],
            name: formData.name.trim(),
            entity_type: formData.entity_type,
            annual_waste_mt: parseFloat(formData.annual_waste_mt) || 0,
            actual_recycled_mt: parseFloat(formData.actual_recycled_mt) || 0,
            location: formData.location ? formData.location.trim() : 'India'
          };
        }
      } else {
        const newComp = {
          id: `comp-${Date.now()}`,
          name: formData.name.trim(),
          entity_type: formData.entity_type,
          annual_waste_mt: parseFloat(formData.annual_waste_mt) || 0,
          actual_recycled_mt: parseFloat(formData.actual_recycled_mt) || 0,
          established_year: new Date().getFullYear(),
          location: formData.location ? formData.location.trim() : 'India'
        };
        companies.push(newComp);
      }
      saveLocalCompanies(companies);
      return { success: true };
    }
  },

  /**
   * Delete company
   */
  async deleteCompany(companyId) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`/api/companies/${companyId}`, { 
        method: 'DELETE',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('json')) {
        const data = await res.json();
        if (data.success) return { success: true };
      }
      throw new Error('API delete failed');
    } catch (err) {
      // Local fallback
      let companies = getLocalCompanies();
      companies = companies.filter(c => c.id !== companyId);
      saveLocalCompanies(companies);
      return { success: true };
    }
  },

  /**
   * Reset sample companies
   */
  async resetSample(financialYear = '2024-25') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`/api/companies/reset?fy=${financialYear}`, { 
        method: 'POST',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('json')) {
        const data = await res.json();
        if (data.success) return { success: true };
      }
      throw new Error('API reset failed');
    } catch (err) {
      // Local fallback
      saveLocalCompanies(DEFAULT_SAMPLE_COMPANIES);
      return { success: true };
    }
  }
};
