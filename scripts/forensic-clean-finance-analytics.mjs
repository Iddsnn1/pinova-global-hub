import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const targets = [
  {
    file: 'src/components/views/FinanceAnalyticsView.tsx',
    replacements: [
      [
        /const sampleTransactions = \[[\s\S]*?\n  \];/g,
        'const sampleTransactions: Array<{ inv: string; ord: string; amt: number; sdkId: string; status: string; date: string }> = [];'
      ],
    ]
  },
  {
    file: 'src/modules/finance_analytics/services.ts',
    replacements: [
      [
        /const merchantOrders = safeOrders\.filter\(\n\s*\(o\) => o\?\.items\?\.some\(\(item\) => item\?\.product\?\.sellerId === merchantId\) \|\| true \/\/ fallback to sample\n\s*\);/g,
        `const merchantOrders = safeOrders.filter(\n      (o) => o?.items?.some((item) => item?.product?.sellerId === merchantId)\n    );`
      ],
      [
        /const totalSalesPi = merchantOrders\.reduce\(\(acc, o\) => acc \+ \(o\?\.totalPi \|\| 0\), 0\) \+ 4280\.00;/g,
        'const totalSalesPi = merchantOrders.reduce((acc, o) => acc + (o?.totalPi || 0), 0);'
      ],
      [
        /private recommendationsState: BIRecommendation\[\] = \[[\s\S]*?\n  \];/g,
        'private recommendationsState: BIRecommendation[] = [];'
      ],
      [
        /private auditLogsState: AnalyticsAuditRecord\[\] = \[[\s\S]*?\n  \];/g,
        'private auditLogsState: AnalyticsAuditRecord[] = [];'
      ],
      [
        /private savedReportsState: SavedReport\[\] = \[[\s\S]*?\n  \];/g,
        'private savedReportsState: SavedReport[] = [];'
      ],
      [
        /private scheduledReportsState: ScheduledReportConfig\[\] = \[[\s\S]*?\n  \];/g,
        'private scheduledReportsState: ScheduledReportConfig[] = [];'
      ],
    ]
  },
  {
    file: 'src/components/merchant/MerchantEcosystemHub.tsx',
    replacements: [
      [
        /setCsvStatusMessage\('Successfully processed catalog CSV file: 128 products updated\/created\.'\)/g,
        "setCsvStatusMessage('CSV import is not connected to a verified server-side catalog workflow yet.')"
      ],
      [
        /Simulate Catalog CSV Processing/g,
        'CSV Import (Server Workflow Required)'
      ],
      [
        /setCsvStatusMessage\(`Export generated successfully for \$\{exp\.name\}\.`\)/g,
        "setCsvStatusMessage('Export requires a connected server-side report job; no file was generated.')"
      ],
    ]
  }
];

let changed = 0;
for (const target of targets) {
  const file = path.join(root, target.file);
  if (!fs.existsSync(file)) continue;

  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [pattern, replacement] of target.replacements) {
    after = after.replace(pattern, replacement);
  }

  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed += 1;
    console.log(`[forensic-clean-finance] sanitized ${target.file}`);
  }
}

console.log(`[forensic-clean-finance] completed; ${changed} source file(s) sanitized before build`);
