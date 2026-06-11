const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'src/components/valid/CaraKerja.tsx');
const lines = fs.readFileSync(srcFile, 'utf8').split('\n');

const ckMockStart = 164; // line 165

const mockContent = lines.slice(ckMockStart).join('\n');
const caraKerjaContent = lines.slice(0, ckMockStart).join('\n');

const newMockContent = `// HALAMAN: src/components/valid/CaraKerjaMocks.tsx
// FUNGSI: Komponen mockup visual untuk halaman Cara Kerja
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

import { User, CheckCircle2 } from "lucide-react";

export ${mockContent.replace('function CKMock', 'function CKMock')}`;

const newCaraKerjaContent = caraKerjaContent.replace(
  'import { User, CheckCircle2 } from "lucide-react";',
  'import { CKMock } from "./CaraKerjaMocks";'
);

fs.writeFileSync(path.join(__dirname, 'src/components/valid/CaraKerjaMocks.tsx'), newMockContent);
fs.writeFileSync(srcFile, newCaraKerjaContent);

console.log("CaraKerja split successful!");
