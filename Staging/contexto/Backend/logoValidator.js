const fs = require("fs");
const path = require("path");

const LOGO_DIR = path.join(__dirname, "../../frontend/assets/img/logos");
const SUPERMERCADOS = ["carrefour", "dia", "jumbo", "coto", "vea"];
const EXPECTED_SUFFIX = "_logo.png";

function validarLogos() {
  console.log("🔍 Validando logos de supermercados...\n");

  SUPERMERCADOS.forEach(nombre => {
    const logoPath = path.join(LOGO_DIR, `${nombre}${EXPECTED_SUFFIX}`);
    if (fs.existsSync(logoPath)) {
      console.log(`✅ ${nombre}: logo encontrado`);
    } else {
      console.warn(`❌ ${nombre}: logo NO encontrado`);
    }
  });

  console.log("\n✅ Validación completada.");
}

validarLogos();