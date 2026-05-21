require('dotenv').config();
const p = require('./src/db/db');
p.query("SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'sales';").then(r => { console.log(r.rows); process.exit(0); })
