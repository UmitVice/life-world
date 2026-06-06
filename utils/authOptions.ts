import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions, Profile } from 'next-auth';
import type { Session } from 'next-auth';
import connectDB from '@/config/database';
import User from '@/models/User';

// Lightweight shape we actually use from the Google profile payload.
// NextAuth's full Profile type is much wider; we only need a few fields.
interface GoogleProfileShape {
  email?: string;
  name?: string;
  picture?: string;
}

const isGoogleProfile = (profile: unknown): profile is GoogleProfileShape => {
  return typeof profile === 'object' && profile !== null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }: { profile?: Profile }) {
      if (!isGoogleProfile(profile) || !profile.email) {
        return false;
      }
      try {
        await connectDB();
        const userExists = await User.findOne({ email: profile.email });
        if (!userExists) {
          let username = profile.name?.trim().slice(0, 20) || 'user';
          let isTaken = true;
          let counter = 1;

          while (isTaken) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
              username = `${username.slice(0, 18)}${counter}`;
              counter++;
            } else {
              isTaken = false;
            }
          }

          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.error('signIn callback error:', error);
        return false;
      }
    },

    async session({ session }: { session: Session }) {
      try {
        if (!session.user?.email) return session;
        await connectDB();
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          // The augmentation in types/next-auth.d.ts gives us
          // `session.user.id` and `session.user.username` with proper types.
          session.user.id = user._id.toString();
          session.user.username = user.username;
        }
        return session;
      } catch (error) {
        console.error('Session verification error:', error);
        return session;
      }
    },
  },
};
