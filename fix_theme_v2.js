const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

// Applying the exact IIMS Navy / Crimson theme from the target vercel deployment
const REPLACEMENTS = {
  // Replace the Pitch Black I applied with the official IIMS Navy
  '#111111': '#0D1757',
  '#0d1757': '#0D1757',
  
  // Replace hover states for buttons to the dark crimson from the screenshot
  'hover:bg-[#B71C1C]': 'hover:bg-[#A30D25]',
  'hover:bg-[#C8102E]': 'hover:bg-[#A30D25]',
  'hover:bg-[#c8102e]': 'hover:bg-[#A30D25]',
  'hover:text-[#B71C1C]': 'hover:text-[#C8102E]',
  'hover:text-[#A30D25]': 'hover:text-[#C8102E]',

  // Surface and borders from screenshot
  '#F8F9FA': '#FAFAFA',
  '#f8f9fa': '#FAFAFA',
  '#E0E0E0': '#E5E5E5',
  '#e0e0e0': '#E5E5E5',
};

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const [oldVal, newVal] of Object.entries(REPLACEMENTS)) {
        if (content.includes(oldVal)) {
          content = content.split(oldVal).join(newVal);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Injecting IIMS Navy/Crimson theme in: ${fullPath.replace(__dirname, '')}`);
      }
    }
  }
}

for (const dir of DIRECTORIES) {
  walkDir(dir);
}
console.log('Final aesthetic styling applied!');
