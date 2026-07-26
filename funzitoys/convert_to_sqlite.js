const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Quote non-boolean, non-numeric, non-function defaults (e.g. CUSTOMER -> "CUSTOMER")
schema = schema.replace(/@default\(((?!true\b|false\b|now\b|\d+\b)[A-Za-z0-9_]+)\)/g, '@default("$1")');

// 2. Remove any remaining @db.Float attributes
schema = schema.replace(/\s*@db\.Float\(\d+,\s*\d+\)/g, '');

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('Successfully adjusted schema.prisma for SQLite syntax rules!');
