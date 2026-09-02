const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { calculateCompanyMetrics, TARGET_SCHEDULE, FEE_SLABS } = require('./services/calculator');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'companies_store.json');
const SAMPLE_FILE = path.join(__dirname, 'data', 'sampleCompanies.json');
const RULES_FILE = path.join(__dirname, 'data', 'rules.json');

// Helper to read current companies store
function readCompaniesStore() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const sampleData = fs.readFileSync(SAMPLE_FILE, 'utf8');
      fs.writeFileSync(DATA_FILE, sampleData, 'utf8');
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading company store:', err);
    return [];
  }
}

// Helper to write companies store
function writeCompaniesStore(companies) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(companies, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing company store:', err);
  }
}

// --- API ROUTES ---

// GET /api/companies - List companies with calculated metrics for given FY
app.get('/api/companies', (req, res) => {
  const financialYear = req.query.fy || '2024-25';
  const companies = readCompaniesStore();
  
  const calculatedCompanies = companies.map(comp => 
    calculateCompanyMetrics(comp, financialYear)
  );

  res.json({
    success: true,
    financial_year: financialYear,
    companies: calculatedCompanies
  });
});

// GET /api/summary - Dashboard analytics summary
app.get('/api/summary', (req, res) => {
  const financialYear = req.query.fy || '2024-25';
  const companies = readCompaniesStore();
  const calculatedCompanies = companies.map(comp => 
    calculateCompanyMetrics(comp, financialYear)
  );

  const totalCompanies = calculatedCompanies.length;
  const totalAnnualWaste = calculatedCompanies.reduce((acc, c) => acc + c.annual_waste_mt, 0);
  const totalTargetMT = calculatedCompanies.reduce((acc, c) => acc + c.target_mt, 0);
  const totalActualRecycled = calculatedCompanies.reduce((acc, c) => acc + c.actual_recycled_mt, 0);
  const totalRegistrationFee = calculatedCompanies.reduce((acc, c) => acc + c.fee_amount, 0);
  const compliantCount = calculatedCompanies.filter(c => c.is_compliant).length;
  const nonCompliantCount = totalCompanies - compliantCount;

  res.json({
    success: true,
    financial_year: financialYear,
    summary: {
      total_companies: totalCompanies,
      total_annual_waste_mt: Number(totalAnnualWaste.toFixed(2)),
      total_target_mt: Number(totalTargetMT.toFixed(2)),
      total_actual_recycled_mt: Number(totalActualRecycled.toFixed(2)),
      total_registration_fee: totalRegistrationFee,
      compliant_count: compliantCount,
      non_compliant_count: nonCompliantCount,
      compliance_rate: totalCompanies > 0 ? Number(((compliantCount / totalCompanies) * 100).toFixed(1)) : 0
    }
  });
});

// POST /api/companies - Register a new company
app.post('/api/companies', (req, res) => {
  const { name, entity_type, annual_waste_mt, actual_recycled_mt, location } = req.body;

  if (!name || !entity_type || annual_waste_mt === undefined) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: name, entity_type, annual_waste_mt' 
    });
  }

  const companies = readCompaniesStore();
  const newCompany = {
    id: `comp-${Date.now()}`,
    name: name.trim(),
    entity_type: entity_type,
    annual_waste_mt: parseFloat(annual_waste_mt) || 0,
    actual_recycled_mt: parseFloat(actual_recycled_mt) || 0,
    established_year: new Date().getFullYear(),
    location: location ? location.trim() : 'India'
  };

  companies.push(newCompany);
  writeCompaniesStore(companies);

  const financialYear = req.query.fy || '2024-25';
  const processed = calculateCompanyMetrics(newCompany, financialYear);

  res.status(201).json({
    success: true,
    message: 'Company registered successfully',
    company: processed
  });
});

// PUT /api/companies/:id - Update company details
app.put('/api/companies/:id', (req, res) => {
  const { id } = req.params;
  const { name, entity_type, annual_waste_mt, actual_recycled_mt, location } = req.body;

  let companies = readCompaniesStore();
  const index = companies.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Company not found' });
  }

  companies[index] = {
    ...companies[index],
    ...(name && { name: name.trim() }),
    ...(entity_type && { entity_type }),
    ...(annual_waste_mt !== undefined && { annual_waste_mt: parseFloat(annual_waste_mt) }),
    ...(actual_recycled_mt !== undefined && { actual_recycled_mt: parseFloat(actual_recycled_mt) }),
    ...(location && { location: location.trim() })
  };

  writeCompaniesStore(companies);

  const financialYear = req.query.fy || '2024-25';
  const processed = calculateCompanyMetrics(companies[index], financialYear);

  res.json({
    success: true,
    message: 'Company updated successfully',
    company: processed
  });
});

// DELETE /api/companies/:id - Delete company record
app.delete('/api/companies/:id', (req, res) => {
  const { id } = req.params;
  let companies = readCompaniesStore();
  const initialLength = companies.length;
  companies = companies.filter(c => c.id !== id);

  if (companies.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Company not found' });
  }

  writeCompaniesStore(companies);
  res.json({ success: true, message: 'Company removed successfully' });
});

// POST /api/companies/reset - Reset to default 5 sample companies
app.post('/api/companies/reset', (req, res) => {
  try {
    const sampleData = fs.readFileSync(SAMPLE_FILE, 'utf8');
    fs.writeFileSync(DATA_FILE, sampleData, 'utf8');
    const companies = JSON.parse(sampleData);
    const financialYear = req.query.fy || '2024-25';
    const processed = companies.map(c => calculateCompanyMetrics(c, financialYear));

    res.json({
      success: true,
      message: 'Reset data to sample 5 companies',
      companies: processed
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reset sample data' });
  }
});

// GET /api/rules - Regulatory guidance details
app.get('/api/rules', (req, res) => {
  try {
    const rulesData = fs.readFileSync(RULES_FILE, 'utf8');
    res.json({ success: true, data: JSON.parse(rulesData) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load rules data' });
  }
});

// GET /api/schedules - Financial year schedules & fee slabs info
app.get('/api/schedules', (req, res) => {
  res.json({
    success: true,
    target_schedule: TARGET_SCHEDULE,
    fee_slabs: FEE_SLABS
  });
});

// Serve frontend static assets in production if dist/ folder exists
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`E-Waste Calculator Backend API running on http://localhost:${PORT}`);
});

