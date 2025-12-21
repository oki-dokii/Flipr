import bcrypt from 'bcryptjs';
import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function resetPassword() {
    const SQL = await initSqlJs();
    const dbPath = join(__dirname, 'database.sqlite');
    const buffer = readFileSync(dbPath);
    const db = new SQL.Database(buffer);

    const email = 'abct2@gmail.com';
    const newPassword = 'dealer123';

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    const stmt = db.prepare('UPDATE users SET password = ? WHERE email = ?');
    stmt.bind([hashedPassword, email]);
    stmt.step();
    stmt.free();

    // Save the database
    const data = db.export();
    const newBuffer = Buffer.from(data);
    writeFileSync(dbPath, newBuffer);

    console.log(`✅ Password reset successfully for ${email}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 New Password: ${newPassword}`);

    db.close();
}

resetPassword().catch(console.error);
