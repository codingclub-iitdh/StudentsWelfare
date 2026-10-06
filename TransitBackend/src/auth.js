const { OAuth2Client } = require('google-auth-library');
const { HttpError } = require('./errors');

function createGoogleAuthenticator(config) {
  const client = new OAuth2Client(config.googleClientId);
  const deanEmails = new Set([config.associateDeanEmail]);
  const managerEmails = new Set([config.transitManagerEmail]);

  return async function authenticate(req, res, next) {
    const authorization = req.get('authorization') || '';
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return next(new HttpError(401, 'Sign in with Google to continue.'));

    try {
      const ticket = await client.verifyIdToken({
        idToken: match[1],
        audience: config.googleClientId,
      });
      const payload = ticket.getPayload();
      const email = (payload.email || '').toLowerCase();
      if (payload.email_verified !== true) {
        throw new HttpError(403, 'A verified Google account is required.');
      }

      let role = null;
      if (deanEmails.has(email)) role = 'associate_dean';
      else if (managerEmails.has(email)) role = 'transit_manager';
      else if (email.endsWith('@iitdh.ac.in') && payload.hd === 'iitdh.ac.in') role = 'student';
      if (!role) throw new HttpError(403, 'This Google account is not authorized for the portal.');

      req.user = {
        sub: payload.sub,
        email,
        name: (payload.name || email.split('@')[0]).trim(),
        role,
      };
      return next();
    } catch (error) {
      if (error instanceof HttpError) return next(error);
      return next(new HttpError(401, 'Google sign-in token is invalid or expired.'));
    }
  };
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, 'Your account is not allowed to perform this action.'));
    }
    return next();
  };
}

module.exports = { createGoogleAuthenticator, requireRole };
