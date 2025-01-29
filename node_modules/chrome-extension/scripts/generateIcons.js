import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 48, 128];

async function generateIcons() {
  const iconsDir = join(__dirname, '../icons');
  
  // Create icons directory if it doesn't exist
  if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir);
  }

  for (const size of sizes) {
    const svgPath = join(iconsDir, `icon${size}.svg`);
    const pngPath = join(iconsDir, `icon${size}.png`);

    await sharp(svgPath)
      .png()
      .toFile(pngPath);

    console.log(`Generated ${pngPath}`);
  }
}

generateIcons().catch(console.error); 