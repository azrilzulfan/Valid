const fs = require('fs');
const path = require('path');

const srcReadme = path.join(__dirname, 'src/lib/README.md');
const destReadme = path.join(__dirname, 'README.md');

const content = fs.readFileSync(srcReadme, 'utf8');

const newContent = content.replace(
  '# Panduan Struktur Frontend & API',
  '# VALID Frontend - Panduan Struktur Frontend & API'
);

fs.writeFileSync(destReadme, newContent, 'utf8');
console.log('README.md updated for GitHub.');
