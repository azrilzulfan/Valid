const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // The regex to match the old logo div block. 
  // It starts with <div className="inline-flex ... bg-yellow-300 ...">
  // contains a <span> with VALID or VALID PRO
  // and ends with </div>
  const regex = /<div\s+className="inline-flex[^>]+>[\s\S]*?<span[^>]+>[\s\S]*?VALID(?: PRO)?[\s\S]*?<\/span>[\s\S]*?<\/div>/g;
  
  const originalContent = content;
  content = content.replace(regex, '<img src="/logo.png" alt="VALID Logo" className="h-[36px] md:h-[40px] object-contain hover:scale-105 transition-transform" />');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src', 'pages'));
walkDir(path.join(__dirname, 'src', 'components'));
