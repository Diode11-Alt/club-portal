const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

// Reverting from standard dark reds to the rich IIMS Crimson Red and pure dark accents.
const REPLACEMENTS = {
  '#B71C1C': '#C8102E',
  '#b71c1c': '#c8102e',
  '#D32F2F': '#C8102E',  
  '#d32f2f': '#c8102e',
  '#212121': '#111111'
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
        console.log(`Updated theme colors in: ${fullPath.replace(__dirname, '')}`);
      }
    }
  }
}

for (const dir of DIRECTORIES) {
  walkDir(dir);
}
console.log('Theme color replacement completed successfully!');
