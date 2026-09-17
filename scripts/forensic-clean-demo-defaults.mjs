import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const replacements = [
  [/userBalancePi\s*=\s*1250\.00/g, 'userBalancePi = 0'],
  [/userBalancePi\s*=\s*1250\.0/g, 'userBalancePi = 0'],
  [/userBalancePi\s*=\s*1250/g, 'userBalancePi = 0'],
  [/userBalancePi\s*=\s*250\.00/g, 'userBalancePi = 0'],
  [/userBalancePi\s*=\s*250\.0/g, 'userBalancePi = 0'],
  [/return 250\.00;/g, 'return 0;'],
  [/buyerUsername\s*=\s*['"]Pioneer_User['"]/g, "buyerUsername = ''"],
  [/buyerUsername\s*\|\|\s*['"]Pioneer_User['"]/g, "buyerUsername || ''"],
  [/pioneerUsername:\s*pioneerUsername\s*\|\|\s*['"]Pioneer_User['"]/g, "pioneerUsername: pioneerUsername || ''"],
  [/username:\s*username\s*\|\|\s*['"]pioneer_user['"]/g, "username: username || ''"],
  [/const buyerUsername = req\.user\?\.username \|\| req\.body\.buyerUsername \|\| ['"]Pioneer_User['"]/g, "const buyerUsername = req.user?.username || ''"],
  [/const sellerUsername = req\.body\.sellerUsername \|\| ['"]Seller_Merchant['"]/g, "const sellerUsername = req.body.sellerUsername || ''"],

  // Education marketplace must not silently fall back to fabricated catalog items.
  [/\s*SEED_MARKETPLACE_ITEMS,\n/gs, '\n'],
  [/\s*return SEED_MARKETPLACE_ITEMS;/g, '    return [];'],
  [/\s*import \{ SEED_MARKETPLACE_ITEMS \} from ['"]\.\/src\/data\/educationSeedData['"];\n/g, '\n'],
  [/\s*let items = SEED_MARKETPLACE_ITEMS;/g, '    let items: any[] = [];'],

  // Platform Admin must not expose fabricated users, wallets, KYC records, or merchant identities.
  [/private usersState: UserAccountRecord\[\] = \[[\s\S]*?\n  \];\n\n  private rolesState:/g, 'private usersState: UserAccountRecord[] = [];\n\n  private rolesState:'],
  [/userCount:\s*[0-9]+/g, 'userCount: 0'],

  // Social/community surfaces must start empty until backed by authenticated/live data.
  [/const \[conversations, setConversations\] = useState\(\[[\s\S]*?\n  \]\);\n\n  \/\/ --- COMMUNITY FEED STATE ---/g, 'const [conversations, setConversations] = useState<any[]>([]);\n\n  // --- COMMUNITY FEED STATE ---'],
  [/const \[feedPosts, setFeedPosts\] = useState\(\[[\s\S]*?\n  \]\);\n  const \[newCommentInput/g, 'const [feedPosts, setFeedPosts] = useState<any[]>([]);\n  const [newCommentInput'],
  [/const \[qaItems, setQaItems\] = useState\(\[[\s\S]*?\n  \]\);\n  const \[newQuestionInput/g, 'const [qaItems, setQaItems] = useState<any[]>([]);\n  const [newQuestionInput'],
  [/const \[liveChatStream, setLiveChatStream\] = useState\(\[[\s\S]*?\n  \]\);/g, 'const [liveChatStream, setLiveChatStream] = useState<any[]>([]);'],
  [/const \[followedStores, setFollowedStores\] = useState<string\[\]>\(\[[\s\S]*?\]\);/g, 'const [followedStores, setFollowedStores] = useState<string[]>([]);'],
  [/const \[blockedUsers, setBlockedUsers\] = useState\(\[[\s\S]*?\n  \]\);/g, 'const [blockedUsers, setBlockedUsers] = useState<string[]>([]);'],

  // Merchant Studio analytics/support/audit must not present fabricated operational history.
  [/const \[announcementBanner, setAnnouncementBanner\] = useState\([^;]+\);/g, "const [announcementBanner, setAnnouncementBanner] = useState('');"],
  [/const \[auditLogs, setAuditLogs\] = useState\(\[[\s\S]*?\n  \]\);/g, 'const [auditLogs, setAuditLogs] = useState<any[]>([]);'],
  [/const \[supportTickets, setSupportTickets\] = useState\(\[[\s\S]*?\n  \]\);/g, 'const [supportTickets, setSupportTickets] = useState<any[]>([]);'],
  [/const revenueChartData = \[[\s\S]*?\n  \];/g, 'const revenueChartData: Array<{ month: string; piRevenue: number; orders: number }> = [];'],
  [/orders\.length \+ 142/g, 'orders.length'],
  [/currentStore\.warehouses\.length > 0 \? currentStore\.warehouses\.length : 2/g, 'currentStore.warehouses.length'],
  [/\+24\.8% from last month/g, 'Historical comparison unavailable until verified sales data exists.'],
  [/Live Data Stream/g, 'Verified data when available'],
  [/currentAdminUsername = ['"]Pi_Pioneer_01['"]/g, "currentAdminUsername = ''"],
  [/['"]Pi_Pioneer_01['"]/g, "''"],
  [/['"]user-uid-892341['"]/g, "''"],
  [/['"]GD5X\.\.\.PINOVA_KEY['"]/g, "''"],
  [/['"]TechNova Global Store['"]/g, "''"],
  [/['"]TechNova Official Store['"]/g, "''"],
  [/['"]Aura Artisanal Crafts & Wearables['"]/g, "''"],
  [/['"]Pioneer Hardware Wholesale Group['"]/g, "''"],
  [/['"]TICK-8801['"]/g, "''"],
  [/['"]TICK-9012['"]/g, "''"],
  [/['"]log-101['"]|['"]log-102['"]|['"]log-103['"]|['"]log-104['"]/g, "''"],
  [/\bSarah Chen \(Owner\)|\bDavid Rodriguez \(Manager\)|\bAlex Mercer \(Warehouse\)/g, ''],
  [/\b192\.168\.1\.104\b|\b10\.0\.4\.12\b|\b172\.16\.0\.44\b/g, ''],
  [/\bTICK-9081\b|\bTICK-8812\b/g, ''],

  // No fabricated active-order identity or shipment should appear when the user has no orders.
  [/const orderId = displayOrder\?\.id \|\| ['"]ORD-PI-892341['"]/g, "const orderId = displayOrder?.id || ''"],
  [/activeOrders && activeOrders\.length > 0 \? activeOrders\[0\]\.id : ['"]ORD-PI-892341['"]/g, "activeOrders && activeOrders.length > 0 ? activeOrders[0].id : ''"],
  [/Your order ORD-PI-892341 was authorized and confirmed via official Pi Network platform API\./g, 'No active order is currently available.'],
  [/PiNova_Invoice_ORD-PI-892341\.pdf/g, ''],

  // Final identity guard: exact fabricated demo identities must never survive the production build.
  [/['"]Pioneer_User['"]/g, "''"],
  [/['"]pioneer_user['"]/g, "''"],
  [/['"]Seller_Merchant['"]/g, "''"],
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
  'src/components/views/PlatformAdminView.tsx',
  'src/components/views/EnterpriseSecurityView.tsx',
  'src/components/views/SocialCommunityHub.tsx',
  'src/components/social/SocialCommunityHub.tsx',
  'src/components/merchant/MerchantEcosystemHub.tsx',
  'src/components/views/HomeView.tsx',
  'src/components/views/ProfileView.tsx',
  'src/components/navigation/FullScreenNavHeader.tsx',
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