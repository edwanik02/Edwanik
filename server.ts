import { spawn } from 'child_process';
import path from 'path';

const rawArgs = process.argv.slice(2);
let port = process.env.PORT || '3000';
let host = process.env.HOSTNAME || '0.0.0.0';

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host' || arg === '--hostname' || arg === '-H') {
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      host = rawArgs[i + 1];
      i++;
    }
  } else if (arg.startsWith('--host=')) {
    host = arg.split('=')[1];
  } else if (arg.startsWith('--hostname=')) {
    host = arg.split('=')[1];
  } else if (arg === '--port' || arg === '-p') {
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      port = rawArgs[i + 1];
      i++;
    }
  } else if (arg.startsWith('--port=')) {
    port = arg.split('=')[1];
  }
}

console.log(`Starting FunziToys Next.js server on ${host}:${port}...`);

const funzitoysDir = path.join(process.cwd(), 'funzitoys');

const child = spawn('npx', ['next', 'start', '-p', port, '-H', host], {
  cwd: funzitoysDir,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: port,
    HOSTNAME: host,
  },
});

child.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code ?? 0);
});

