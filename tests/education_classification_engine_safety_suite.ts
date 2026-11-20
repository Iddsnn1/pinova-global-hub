import { EducationClassificationEngine } from '../src/server/services/EducationClassificationEngine';
import { CountryEducationTaxonomy } from '../src/types/education';

const ok = (value: boolean, name: string) => {
  if (!value) throw new Error('FAILED: ' + name);
  console.log('[PASS] ' + name);
};

const taxonomy: CountryEducationTaxonomy = {
  countryCode: 'XZ',
  countryName: 'Example Country',
  educationSystemName: 'Example system',
  regulatoryAuthorities: ['Example Authority'],
  defaultCurrency: 'XCU',
  supportedLevels: [{
    id: 'primary',
    tier: 'primary',
    standardName: 'Primary Education',
    localName: 'Primary',
    subGrades: ['Grade 1', 'Grade 2'],
    periodType: 'semester',
    periods: ['Semester 1', 'Semester 2']
  }]
};

const engine = new EducationClassificationEngine({ XZ: taxonomy });

ok(engine.validateSubGrade('XZ', 'primary', 'Grade 1'), 'valid sub-grade is accepted');
ok(!engine.validateSubGrade('XZ', 'primary', ''), 'empty sub-grade is rejected');
ok(!engine.validateSubGrade('XZ', 'primary', '   '), 'whitespace-only sub-grade is rejected');
ok(!engine.validateSubGrade('XZ', 'primary', 'Grade 99'), 'unknown sub-grade is rejected');

const single = engine.getTaxonomy('XZ');
if (!single) throw new Error('FAILED: taxonomy is available');
single.countryName = 'Tampered';
single.supportedLevels[0].subGrades.push('Injected Grade');
const afterSingleMutation = engine.getTaxonomy('XZ');
ok(afterSingleMutation?.countryName === 'Example Country', 'single taxonomy reads cannot mutate the internal catalogue');
ok(!engine.validateSubGrade('XZ', 'primary', 'Injected Grade'), 'nested taxonomy arrays are isolated from callers');

const all = engine.getAllTaxonomies();
all.XZ.countryName = 'Tampered Again';
all.XZ.supportedLevels[0].subGrades.push('Another Injected Grade');
const afterAllMutation = engine.getTaxonomy('XZ');
ok(afterAllMutation?.countryName === 'Example Country', 'full catalogue reads cannot mutate the internal catalogue');
ok(!engine.validateSubGrade('XZ', 'primary', 'Another Injected Grade'), 'full catalogue nested arrays are isolated');

console.log('Education classification safety suite: GREEN');
