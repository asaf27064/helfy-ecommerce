// Minimal structured logger — wraps console so we can swap it out later.
// No console.log in committed server code per guidelines; use this instead.

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = process.env.LOG_LEVEL ?? 'info';

function log(level, ...args) {
  if (levels[level] <= levels[currentLevel]) {
    const ts = new Date().toISOString();
    // eslint-disable-next-line no-console
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `[${ts}] [${level.toUpperCase()}]`,
      ...args
    );
  }
}

const logger = {
  error: (...args) => log('error', ...args),
  warn:  (...args) => log('warn',  ...args),
  info:  (...args) => log('info',  ...args),
  debug: (...args) => log('debug', ...args),
};

export default logger;
