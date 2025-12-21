
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'backend/database.db'));

const dealer = db.prepare('SELECT email, password FROM users WHERE role = "dealer" LIMIT 1').get();

if (dealer) {
    console.log(`Dealer Email: ${dealer.email}`);
    // console.log(`Dealer Password Hash: ${dealer.password}`);
} else {
    console.log('No dealer found.');
}
