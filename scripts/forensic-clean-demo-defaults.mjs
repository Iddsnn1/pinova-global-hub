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
  [/totalSalesPi:\s*1250\.00/g, 'totalSalesPi: 0'],
  [/username:\s*username\s*\|\|\s*['"]pioneer_user['"]/g, "username: username || ''"],
  [/uid:\s*uid\s*\|\|\s*`pi-uid-\$\{Date\.now\(\)\\}`/g, "uid: uid || ''"],
  [/const buyerUsername = req\.user\?\.username \|\| req\.body\.buyerUsername \|\| ['"]Pioneer_User['"]/g, "const buyerUsername = req.user?.username || ''"],
  [/const sellerUsername = req\.body\.sellerUsername \|\| ['"]Seller_Merchant['"]/g, "const sellerUsername = req.body.sellerUsername || ''"],

  // Education marketplace must not silently fall back to fabricated catalog items.
  [/\s*SEED_MARKETPLACE_ITEMS,\n/gs, '\n'],
  [/\s*return SEED_MARKETPLACE_ITEMS;/g, '    return [];'],
  [/\s*import \{ SEED_MARKETPLACE_ITEMS \} from ['"]\.\/src\/data\/educationSeedData['"];\n/g, '\n'],
  [/\s*let items = SEED_MARKETPLACE_ITEMS;/g, '    let items: any[] = [];'],

  // Platform Admin must not expose fabricated users, wallets, KYC records, or merchant identities.
  [/private usersState: UserAccountRecord\[\] = \[[\s\S]*?\n  \];\n\n  private rolesState:/g, 'private usersState: UserAccountRecord[] = [];\n\n  private rolesState:'],
  [/userCount:\s*[0-9]+/g, 'userCount: 0']
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
  'src/components/views/AiSearchView.tsx',
  'src/App.tsx',
  'server.ts',
  'src/services/educationService.ts',
  'src/modules/platform_admin/services.ts'
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
