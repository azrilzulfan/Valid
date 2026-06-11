const fs = require('fs');

fetch('https://tangroup.id/outlet/pats-x')
  .then(r => r.text())
  .then(html => {
    const fontUrls = html.match(/fonts\.googleapis\.com[^"']+/g) || [];
    const cssLinks = html.match(/href=["']([^"']+\.css(\?[^"']*)?)["']/g) || [];
    console.log("=== Google Fonts ===");
    console.log(fontUrls);
    console.log("=== CSS Links ===");
    console.log(cssLinks);
    fs.writeFileSync('tangroup.html', html);
  });
