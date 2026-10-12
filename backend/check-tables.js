const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createPool } = require('./database');
const pool = createPool();
pool.query('SELECT DISTINCT "Old District" FROM master_geography LIMIT 5')
    .then(res => { console.table(res.rows); pool.end(); })
    .catch(console.error);
