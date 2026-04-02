#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const files = [
  'app/api/ctf/submit/route.ts',
  'app/api/test-members/route.ts',
  'app/api/test-query/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/auth/magic-link/route.ts',
  'app/api/members/me/route.ts',
  'app/api/members/search/route.ts',
  'app/api/members/deactivate/route.ts',
  'app/api/members/cohort/[intake]/route.ts',
  'app/api/members/[id]/endorse/route.ts',
  'app/api/members/[id]/activity/route.ts',
  'app/portal/(protected)/notifications/page.tsx',
  'app/portal/(protected)/events/page.tsx',
  'app/portal/(protected)/events/[id]/page.tsx',
  'app/portal/(protected)/layout.tsx',
  'app/portal/(protected)/members/page.tsx',
  'app/portal/(protected)/members/[id]/page.tsx',
  'app/portal/(protected)/profile/page.tsx',
  'app/portal/(protected)/profile/actions.ts',
  'app/portal/(protected)/feed/page.tsx',
  'app/portal/(protected)/feed/actions.ts',
  'app/portal/(protected)/feed/[id]/page.tsx',
  'app/portal/(protected)/ctf/page.tsx',
  'app/portal/(protected)/leaderboard/page.tsx',
  'app/portal/(protected)/messages/layout.tsx',
  'app/portal/(protected)/messages/actions.ts',
  'app/portal/(protected)/messages/[id]/page.tsx',
  'app/portal/(protected)/dashboard/page.tsx',
  'app/portal/(protected)/resources/page.tsx',
];

let count = 0;
for (const f of files) {
  const fp = path.join(root, f);
  if (!fs.existsSync(fp)) { console.log('SKIP:', f); continue; }
  let content = fs.readFileSync(fp, 'utf8');
  const orig = content;
  content = content.replace(
    /import\s*\{\s*createServerClient\s*\}\s*from\s*'@\/lib\/supabase-server'/g,
    "import { createAdminSupabaseClient } from '@/lib/supabase/server'"
  );
  content = content.replace(/createServerClient\(\)/g, 'createAdminSupabaseClient()');
  if (content !== orig) {
    fs.writeFileSync(fp, content);
    count++;
    console.log('UPDATED:', f);
  } else {
    console.log('NO CHANGE:', f);
  }
}
console.log('Done.', count, 'files updated.');
