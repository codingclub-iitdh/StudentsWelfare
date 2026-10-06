function getConfig(env = process.env) {
  const associateDeanEmail = (env.ASSOCIATE_DEAN_EMAIL || '').trim().toLowerCase();
  const transitManagerEmail = (env.TRANSIT_MANAGER_EMAIL || '').trim().toLowerCase();
  const transitTeamEmail = (
    env.TRANSIT_TEAM_EMAIL || env.TRANSIT_MANAGER_EMAIL || ''
  ).trim().toLowerCase();
  const swOfficeEmail = (env.SW_OFFICE_EMAIL || '').trim().toLowerCase();
  const csOfficeEmail = (env.CS_OFFICE_EMAIL || '').trim().toLowerCase();

  return {
    nodeEnv: env.NODE_ENV || 'development',
    port: Number(env.PORT || 5000),
    frontendOrigins: (env.FRONTEND_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    database: {
      host: env.DB_HOST,
      port: Number(env.DB_PORT || 5432),
      name: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      ssl: env.DB_SSL === 'true',
    },
    googleClientId: env.GOOGLE_CLIENT_ID,
    associateDeanEmail,
    transitManagerEmail,
    transitTeamEmail,
    swOfficeEmail,
    csOfficeEmail,
    termsVersion: env.TERMS_VERSION,
    bookingTimeZone: env.BOOKING_TIME_ZONE || 'Asia/Kolkata',
    smtp: {
      host: env.EMAIL_HOST,
      port: Number(env.EMAIL_PORT || 587),
      secure: env.EMAIL_SECURE === 'true',
      user: env.EMAIL_USER,
      password: env.EMAIL_PASS,
      from: env.EMAIL_FROM,
    },
    confirmationCc: [...new Set([
      associateDeanEmail,
      transitTeamEmail,
      swOfficeEmail,
      csOfficeEmail,
    ].filter(Boolean))],
  };
}

function validateConfig(config) {
  const missing = [];
  const required = [
    ['DB_HOST', config.database.host],
    ['DB_NAME', config.database.name],
    ['DB_USER', config.database.user],
    ['DB_PASSWORD', config.database.password],
    ['GOOGLE_CLIENT_ID', config.googleClientId],
    ['TERMS_VERSION', config.termsVersion],
    ['ASSOCIATE_DEAN_EMAIL', config.associateDeanEmail],
    ['TRANSIT_MANAGER_EMAIL', config.transitManagerEmail],
    ['SW_OFFICE_EMAIL', config.swOfficeEmail],
    ['CS_OFFICE_EMAIL', config.csOfficeEmail],
    ['EMAIL_HOST', config.smtp.host],
    ['EMAIL_USER', config.smtp.user],
    ['EMAIL_PASS', config.smtp.password],
    ['EMAIL_FROM', config.smtp.from],
  ];

  for (const [name, value] of required) {
    if (!value) missing.push(name);
  }
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
    missing.push('PORT (must be 1-65535)');
  }
  if (!Number.isInteger(config.database.port) || config.database.port < 1 || config.database.port > 65535) {
    missing.push('DB_PORT (must be 1-65535)');
  }
  if (!Number.isInteger(config.smtp.port) || config.smtp.port < 1 || config.smtp.port > 65535) {
    missing.push('EMAIL_PORT (must be 1-65535)');
  }
  if (missing.length) {
    throw new Error(`Missing or invalid environment configuration: ${missing.join(', ')}`);
  }
}

module.exports = { getConfig, validateConfig };
