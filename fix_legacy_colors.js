const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

// Mapping straggler legacy hex codes to the established Cosmic Token system
const REPLACEMENTS = {
  // --- Legacy Grays to Cosmic Neutrals ---
  '#F5F5F5': 'var(--color-cosmic-light)', // Can be used in inline styles, but let's target classes
  'bg-[#F5F5F5]': 'bg-cosmic-light',
  'hover:bg-[#F5F5F5]': 'hover:bg-cosmic-light',
  'border-[#F5F5F5]': 'border-cosmic-muted',
  
  'bg-[#FAFAFA]': 'bg-cosmic-light',

  'text-[#9E9E9E]': 'text-cosmic-accent',
  'border-[#9E9E9E]': 'border-cosmic-accent',
  
  'text-[#757575]': 'text-cosmic-accent',
  'text-[#424242]': 'text-cosmic-dark',
  'text-[#212121]': 'text-cosmic-black',

  // --- Legacy Highlights to Cosmic Brand ---
  'bg-[#FFEBEE]': 'bg-cosmic-brand/10',
  'hover:bg-[#FFEBEE]': 'hover:bg-cosmic-brand/20',

  'bg-[#E1F5FE]': 'bg-cosmic-brand/10',
  'hover:bg-[#E1F5FE]': 'hover:bg-cosmic-brand/20',

  'text-[#0277BD]': 'text-cosmic-brand',
  'hover:text-[#0277BD]': 'hover:text-cosmic-brand',

  // --- Announcement Cards ---
  'bg-[#FFF8E1]': 'bg-cosmic-light',
  'border-[#F57F17]/20': 'border-cosmic-brand/20',

  // --- Arbitrary leftovers ---
  'bg-[#E0E0E0]': 'bg-cosmic-muted',
  'border-[#E0E0E0]': 'border-cosmic-muted'
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
        console.log(`Cleansed legacy colors in: ${fullPath.replace(__dirname, '')}`);
      }
    }
  }
}

for (const dir of DIRECTORIES) {
  walkDir(dir);
}
console.log('Legacy color sweep complete!');
