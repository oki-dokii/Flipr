import bcrypt from 'bcryptjs';
import db from '../database.js';

export const createUser = async (email, password, name, company, role, city, state) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`
    INSERT INTO users (email, password, name, company, role, city, state)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

    const result = stmt.run(email, hashedPassword, name, company, role, city || null, state || null);
    return result.lastInsertRowid;
};

export const findUserByEmail = (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
};

export const findUserById = (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
};

export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
