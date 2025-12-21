
// Basic verification that files exist and content is plausible
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function checkFile(relativePath, searchString) {
    const filePath = path.join(process.cwd(), relativePath);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(searchString)) {
            console.log(`✅ ${path.basename(filePath)} contains expected code.`);
        } else {
            console.error(`❌ ${path.basename(filePath)} missing: "${searchString}"`);
            process.exit(1);
        }
    } catch (e) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }
}

try {
    console.log('--- Verifying Google Translate Setup ---');
    checkFile('src/i18n.ts', 'export const translations');
    checkFile('src/contexts/LanguageContext.tsx', 'document.cookie = `googtrans');
    checkFile('src/components/LanguageSelector.tsx', 'changeLanguage(lang.code)');
    checkFile('src/components/Navbar.tsx', 'google_translate_element');
    checkFile('src/App.tsx', '<LanguageProvider>');

    console.log('\n✅ SETUP VERIFIED: All components in place.');
    console.log('To fully verify, open browser and check if dropdown triggers page reload and translation.');
} catch (e) {
    console.error('Verification failed', e);
    process.exit(1);
}
