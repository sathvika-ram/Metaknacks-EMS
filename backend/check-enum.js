const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createPool } = require('./database');
const pool = createPool();

pool.query("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE typname = (SELECT udt_name FROM information_schema.columns WHERE table_name = 'voters' AND column_name = 'enrollment_status')")
    .then(res => { console.table(res.rows); pool.end(); })
    .catch(console.error);
