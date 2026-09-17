import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const replacements = [
  [/userBalancePi\s*=\s*1250\.00/g, 'userBalancePi = 0'],
  [/userBalancePi\s*=\s*1250\.0/g, 'userBalancePi = 0'],
  [/userBalancePi\s*=\s*1250/g, 'userBalancePi = 0'],
  [/buyerUsername\s*=\s*['"]Pioneer_User['"]/g, "buyerUsername = ''"],
  [/buyerUsername\s*\|\|\s*['"]Pioneer_User['"]/g, "buyerUsername || ''"],
  [/pioneerUsername:\s*pioneerUsername\s*\|\|\s*['"]Pioneer_User['"]/g, "pioneerUsername: pioneerUsername || ''"],
  [/totalSalesPi:\s*1250\.00/g, 'totalSalesPi: 0']
];

const files = [
  'src/components/utility/AirtimeRechargeForm.tsx',
  'src/components/education/ExamCardsPortal.tsx',
  'src/components/utility/FlexibleUtilityModal.tsx',
  'src/components/utility/discovery/EventsDiscovery.tsx',
  'src/components/utility/discovery/TransportDiscovery.tsx',
  'src/components/flight/FlightBookingModal.tsx',
  'src/components/education/EducationDiscovery.tsx',
  'src/components/vendor/VendorApplicationModal.tsx',
  'src/App.tsx'
];

let changed = 0;
for (const relative of files) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [pattern, replacement] of replacements) {
    after = after.replace(pattern, replacement);
  }
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed += 1;
    console.log(`[forensic-clean] sanitized ${relative}`);
  }
}

console.log(`[forensic-clean] completed; ${changed} source file(s) sanitized before build`);
