const { OAuth2Client } = require('google-auth-library');
const { HttpError } = require('./errors');

function resolvePortalRole(email, hostedDomain, config) {
  const normalizedEmail = email.toLowerCase();
  if (normalizedEmail === config.associateDeanEmail) return 'associate_dean';
  if (normalizedEmail === config.transitManagerEmail) return 'transit_manager';
  if (normalizedEmail.endsWith('@iitdh.ac.in') && hostedDomain === 'iitdh.ac.in') return 'student';
  return null;
}

function createGoogleAuthenticator(config) {
  const client = new OAuth2Client(config.googleClientId);

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

      const role = resolvePortalRole(email, payload.hd, config);
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

module.exports = { createGoogleAuthenticator, requireRole, resolvePortalRole };
