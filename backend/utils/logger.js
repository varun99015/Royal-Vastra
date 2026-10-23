const redact = (msg = '') => {
  if (typeof msg !== 'string') return msg;
  return msg
    .replace(/(password\s*[=:]\s*)\S+/gi, '$1[REDACTED]')
    .replace(/(token\s*[=:]\s*)\S+/gi, '$1[REDACTED]')
    .replace(/(authorization\s*[=:]\s*)\S+/gi, '$1[REDACTED]')
    .replace(/(signature\s*[=:]\s*)\S+/gi, '$1[REDACTED]');
};

const format = (level, ...args) => {
  const ts = new Date().toISOString();
  const clean = args.map((a) => (typeof a === 'string' ? redact(a) : a));
  return `[${ts}] [${level}] ${clean.join(' ')}`;
};

const logger = {
  info: (...args) => console.log(format('INFO', ...args)),
  warn: (...args) => console.warn(format('WARN', ...args)),
  error: (...args) => console.error(format('ERROR', ...args)),
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') console.log(format('DEBUG', ...args));
  },
};

module.exports = logger;
