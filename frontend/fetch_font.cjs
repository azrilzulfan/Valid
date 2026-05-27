const https = require("https");

https
  .get("https://portalipb.site/", (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      const googleFonts = data.match(/fonts\.googleapis\.com\/css2\?family=([^&"']+)/gi);
      console.log("Google Fonts:", googleFonts);

      const fontFamilies = data.match(/font-family[^;>"}]+/gi);
      if (fontFamilies) {
        console.log("Font Families:", fontFamilies.slice(0, 10));
      }
    });
  })
  .on("error", (err) => {
    console.log("Error:", err.message);
  });
