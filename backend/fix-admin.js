const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createPool } = require('./database');
const pool = createPool();

async function fixPassword() {
    try {
        const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
        const plainPassword = process.env.ADMIN_PASSWORD;
        if (!email || !plainPassword) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured.');
        
        console.log(`Hashing password for ${email}...`);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(plainPassword, salt);
        
        await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, email]);
        console.log('Successfully updated the password hash to allow login!');
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

fixPassword();
