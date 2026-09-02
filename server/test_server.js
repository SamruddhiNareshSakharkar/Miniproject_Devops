const { calculateCompanyMetrics, calculateRegistrationFee, getTargetPercentage } = require('./services/calculator');
const assert = require('assert');

console.log('--- Testing Calculator Logic ---');

// Test 1: FY 2024-25 (60% Target)
const comp1 = {
  id: 'test-1',
  name: 'Dixon Technologies',
  entity_type: 'Producer',
  annual_waste_mt: 5200,
  actual_recycled_mt: 4200
};

const res1 = calculateCompanyMetrics(comp1, '2024-25');
console.log('Test 1 (Dixon 5200MT @ 60%):', {
  target_mt: res1.target_mt, // Expect 3120 MT
  fee_formatted: res1.fee_formatted, // Expect ₹15,00,000 (>= 5000 target MT? Wait! 3120 is < 5000, so ₹10,00,000)
  is_compliant: res1.is_compliant // 4200 >= 3120 => true
});

assert.strictEqual(res1.target_mt, 3120);
assert.strictEqual(res1.fee_amount, 1000000);
assert.strictEqual(res1.is_compliant, true);

// Test 2: FY 2027-28 (80% Target)
const res2 = calculateCompanyMetrics(comp1, '2027-28');
console.log('Test 2 (Dixon 5200MT @ 80%):', {
  target_mt: res2.target_mt, // Expect 4160 MT
  fee_formatted: res2.fee_formatted, // Expect ₹10,00,000
  is_compliant: res2.is_compliant // 4200 >= 4160 => true
});

assert.strictEqual(res2.target_mt, 4160);

// Test 3: Fee lookup boundaries
assert.strictEqual(calculateRegistrationFee(40).fee, 2500);
assert.strictEqual(calculateRegistrationFee(50).fee, 7500);
assert.strictEqual(calculateRegistrationFee(99.9).fee, 7500);
assert.strictEqual(calculateRegistrationFee(100).fee, 150000);
assert.strictEqual(calculateRegistrationFee(999).fee, 150000);
assert.strictEqual(calculateRegistrationFee(1000).fee, 1000000);
assert.strictEqual(calculateRegistrationFee(5000).fee, 1500000);

console.log('All backend calculation tests passed successfully! ✅');
