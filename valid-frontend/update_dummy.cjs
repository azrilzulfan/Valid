const fs = require('fs');

const dummyFiles = [
  'src/components/admin/AdminUsersDummyData.ts',
  'src/components/admin/AdminVerifyDummyData.ts',
  'src/components/professionals/dummyData.ts',
  'src/components/reviews/dummyData.ts'
];

dummyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const code = fs.readFileSync(file, 'utf8');
    const newCode = code.replace(
      'export const', 
      '// TODO: ganti dengan API call dari backend (contoh: dashboardApi.getStats() atau usersApi.getProfile())\nexport const'
    );
    fs.writeFileSync(file, newCode);
    console.log("Updated", file);
  }
});
