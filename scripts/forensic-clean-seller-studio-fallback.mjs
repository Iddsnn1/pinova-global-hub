import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('src/components/seller/SellerStudioV2.tsx');
let source = fs.readFileSync(file, 'utf8');

const replacements = [
  [
    /storeName: serverStatus\.storeName \|\| `\$\{user\?\.username \|\| 'Pioneer'\}'s Store`,/,
    "storeName: serverStatus.storeName || '',"
  ],
  [
    /bio: 'Official verified PiNova Merchant Store\.',/,
    "bio: '',"
  ],
  [
    /rating: 5\.0,/,
    'rating: 0,'
  ],
  [
    /bannerImage: 'https:\/\/images\.unsplash\.com\/photo-1441986300917-64674bd600d8\?auto=format&fit=crop&w=1200&q=80',/,
    "bannerImage: '',"
  ],
  [
    /logoImage: 'https:\/\/images\.unsplash\.com\/photo-1472851294608-062f824d29cc\?auto=format&fit=crop&w=400&q=80',/,
    "logoImage: '',"
  ],
  [
    /joinedDate: '2025-01-01',/,
    "joinedDate: '',"
  ],
  [
    /shippingCountries: \['Global'\]/,
    'shippingCountries: []'
  ]
];

for (const [pattern, replacement] of replacements) {
  source = source.replace(pattern, replacement);
}

fs.writeFileSync(file, source);
console.log('[forensic-clean-seller-studio] removed synthetic fallback merchant identity');
