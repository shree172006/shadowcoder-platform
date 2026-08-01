import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import User from '../models/User.js';

const configurePassport = () => {
  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

  // --- GOOGLE OAUTH 2.0 STRATEGY ---
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${SERVER_URL}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            let user = await User.findOne({
              $or: [{ googleId: profile.id }, ...(email ? [{ email }] : [])],
            });

            if (!user) {
              user = await User.create({
                name: profile.displayName || profile.username || 'Google Developer',
                email: email || `${profile.id}@google.oauth`,
                googleId: profile.id,
                avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                role: 'student',
              });
            } else if (!user.googleId) {
              user.googleId = profile.id;
              if (!user.avatar && profile.photos && profile.photos[0]) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            }

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
  } else {
    console.warn('[Passport Warning]: Google OAuth credentials missing from .env');
  }

  // --- GITHUB OAUTH 2.0 STRATEGY ---
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: `${SERVER_URL}/api/auth/github/callback`,
          scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            let user = await User.findOne({
              $or: [{ githubId: profile.id }, ...(email ? [{ email }] : [])],
            });

            if (!user) {
              user = await User.create({
                name: profile.displayName || profile.username || 'GitHub Developer',
                email: email || `${profile.id}@github.oauth`,
                githubId: profile.id,
                avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                role: 'student',
              });
            } else if (!user.githubId) {
              user.githubId = profile.id;
              if (!user.avatar && profile.photos && profile.photos[0]) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            }

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
  } else {
    console.warn('[Passport Warning]: GitHub OAuth credentials missing from .env');
  }

  // --- LINKEDIN OAUTH 2.0 STRATEGY ---
  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(
      new LinkedInStrategy(
        {
          clientID: process.env.LINKEDIN_CLIENT_ID,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          callbackURL: `${SERVER_URL}/api/auth/linkedin/callback`,
          scope: ['r_emailaddress', 'r_liteprofile'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            let user = await User.findOne({
              $or: [{ linkedinId: profile.id }, ...(email ? [{ email }] : [])],
            });

            if (!user) {
              user = await User.create({
                name: profile.displayName || 'LinkedIn Developer',
                email: email || `${profile.id}@linkedin.oauth`,
                linkedinId: profile.id,
                avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                role: 'student',
              });
            } else if (!user.linkedinId) {
              user.linkedinId = profile.id;
              await user.save();
            }

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
  } else {
    console.warn('[Passport Warning]: LinkedIn OAuth credentials missing from .env');
  }
};

export default configurePassport;
