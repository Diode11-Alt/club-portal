const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

// Map old exact hexes to Cosmic Artistry hexes
const REPLACEMENTS = {
  // Primary Text & Banners
  '#0D1757': '#212A31',
  '#0d1757': '#212A31',
  
  // Primary Accent & Buttons
  '#C8102E': '#124E66',
  '#c8102e': '#124E66',
  
  // Button Hovers & Secondary Dark
  '#A30D25': '#2E3944',
  '#a30d25': '#2E3944',
  
  // Surfaces / Backgrounds 
  '#FAFAFA': '#D3D9D4',
  '#fafafa': '#D3D9D4',
  '#F8F9FA': '#D3D9D4', // Catch any lingering generic grays
  '#f8f9fa': '#D3D9D4',
  
  // Borders / Muted Accents
  '#E5E5E5': '#748D92',
  '#e5e5e5': '#748D92',
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
        console.log(`Applied Cosmic Artistry to: ${fullPath.replace(__dirname, '')}`);
      }
    }
  }
}

for (const dir of DIRECTORIES) {
  walkDir(dir);
}
console.log('Cosmic theme successfully applied.');
