const fs = require('fs');
const path = require('path');

const targetDirs = [
  'src/pages',
  'src/routes',
  'src/components/valid',
  'src/components/admin',
  'src/components/auth',
  'src/components/interview',
  'src/components/portfolio',
  'src/components/professionals',
  'src/components/reviews'
];

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Exclude auto-generated files
      if (file === 'routeTree.gen.ts') continue;
      
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.startsWith('// HALAMAN:')) {
        const header = `// HALAMAN: ${fullPath.replace(/\\\\/g, '/').replace('src/', '')}
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

`;
        fs.writeFileSync(fullPath, header + content);
        console.log(`Added header to ${fullPath}`);
      }
    }
  }
}

targetDirs.forEach(dir => processDirectory(path.join(__dirname, dir)));
console.log('Headers added successfully!');
