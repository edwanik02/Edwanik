import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rawArgs = process.argv.slice(2);
let port = process.env.PORT || '3000';
let hostname = process.env.HOSTNAME || '0.0.0.0';

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host' || arg === '--hostname' || arg === '-H') {
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      hostname = rawArgs[i + 1];
      i++;
    }
  } else if (arg.startsWith('--host=')) {
    hostname = arg.split('=')[1];
  } else if (arg.startsWith('--hostname=')) {
    hostname = arg.split('=')[1];
  } else if (arg === '--port' || arg === '-p') {
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      port = rawArgs[i + 1];
      i++;
    }
  } else if (arg.startsWith('--port=')) {
    port = arg.split('=')[1];
  }
}

console.log(`Starting FunziToys Next.js dev server on ${hostname}:${port}...`);

const funzitoysDir = path.join(__dirname, 'funzitoys');

const defaultDbUrl = 'postgresql://user:password@localhost:5432/funzitoys';
const dbUrl = (process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0 && (process.env.DATABASE_URL.startsWith('postgresql://') || process.env.DATABASE_URL.startsWith('postgres://')))
  ? process.env.DATABASE_URL.trim()
  : defaultDbUrl;
const directUrl = (process.env.DIRECT_URL && process.env.DIRECT_URL.trim().length > 0 && (process.env.DIRECT_URL.startsWith('postgresql://') || process.env.DIRECT_URL.startsWith('postgres://')))
  ? process.env.DIRECT_URL.trim()
  : dbUrl;

const child = spawn('npx', ['next', 'dev', '-p', port, '-H', hostname], {
  cwd: funzitoysDir,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    DATABASE_URL: dbUrl,
    DIRECT_URL: directUrl,
    PORT: port,
    HOSTNAME: hostname,
  },
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});
