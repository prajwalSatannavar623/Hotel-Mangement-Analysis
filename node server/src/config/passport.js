import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/user.model.js";

// local strategy:
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() }).select(
          "+password",
        );

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        if (!user.password) {
          return done(null, false, {
            message:
              "This account uses Google sign-in. Please continue with Google.",
          });
        }

        const valid = await user.isPasswordCorrect(password);
        if (!valid) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// google strategy:
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const fullName = profile.displayName;
        const picture = profile.photos?.[0]?.value;

        // Already linked to this Google account? -> just log them in
        let user = await User.findOne({ "google.id": googleId });
        if (user) return done(null, user);

        // Existing local account with the same email? -> link Google to it
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.google = { id: googleId, email };
            user.emailVerified = true;
            await user.save({ validateBeforeSave: false });
            return done(null, user);
          }
        }

        // Brand new user -> create the account
        user = await User.create({
          email,
          emailVerified: true,
          fullName,
          avatarUrl: picture,
          google: { id: googleId, email },
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// session serialization:-> when User logins
passport.serializeUser((user, done) => done(null, user.id));

// triggred for evrey protected route
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { passport };
