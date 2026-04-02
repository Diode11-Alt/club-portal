const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

// Mapping raw hex arrays into semantic Tailwind tokens injected in globals.css
const REPLACEMENTS = {
  // Brand
  'bg-[#124E66]': 'bg-cosmic-brand',
  'text-[#124E66]': 'text-cosmic-brand',
  'border-[#124E66]': 'border-cosmic-brand',
  'ring-[#124E66]': 'ring-cosmic-brand',
  'divide-[#124E66]': 'divide-cosmic-brand',
  
  // Black/Primary Dark
  'bg-[#212A31]': 'bg-cosmic-black',
  'text-[#212A31]': 'text-cosmic-black',
  'border-[#212A31]': 'border-cosmic-black',
  'ring-[#212A31]': 'ring-cosmic-black',
  
  // Dark/Hovers
  'bg-[#2E3944]': 'bg-cosmic-dark',
  'text-[#2E3944]': 'text-cosmic-dark',
  'hover:bg-[#2E3944]': 'hover:bg-cosmic-dark',
  'hover:text-[#2E3944]': 'hover:text-cosmic-dark',
  
  // Backgrounds / Muted Grays
  'bg-[#D3D9D4]': 'bg-cosmic-light',   // Map to soft background instead of hard gray 
  'text-[#D3D9D4]': 'text-cosmic-muted',
  'border-[#D3D9D4]': 'border-cosmic-muted',
  
  // Slate Accent (Borders & Icons)
  'bg-[#748D92]': 'bg-cosmic-accent',
  'text-[#748D92]': 'text-cosmic-accent',
  'border-[#748D92]': 'border-cosmic-accent',
  
  // Legacy cleanup if exist
  'bg-[#FAFAFA]': 'bg-cosmic-light',
  'bg-[#F8F9FA]': 'bg-cosmic-light',
  'border-[#E5E5E5]': 'border-cosmic-muted'
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
        console.log(`Refactored semantic tokens in: ${fullPath.replace(__dirname, '')}`);
      }
    }
  }
}

for (const dir of DIRECTORIES) {
  walkDir(dir);
}
console.log('Semantic Tailwind Token refactor complete!');
