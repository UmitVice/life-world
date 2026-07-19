import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions, Profile } from 'next-auth';
import type { Session } from 'next-auth';
import bcrypt from 'bcryptjs';
import connectDB from '@/config/database';
import User, { hashPassword } from '@/models/User';

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
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          image: user.image,
          username: user.username,
          role: user.role ?? 'user',
        } as any;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ profile, user, account }: { profile?: Profile; user?: any; account?: any }) {
      // Credentials login: user already validated by authorize(); just accept.
      if (account?.provider === 'credentials') {
        return true;
      }

      // Google login: existing flow (auto-create user on first sign-in).
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
            role: (process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).includes(profile.email.toLowerCase()) ? 'admin' : 'user',
          });
        }
        return true;
      } catch (error) {
        console.error('signIn callback error:', error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.username = (user as any).username;
        token.role = (user as any).role ?? 'user';
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: any }) {
      try {
        if (session.user) {
          if (token?.id) session.user.id = token.id;
          if (token?.username) session.user.username = token.username;
          if (token?.role) session.user.role = token.role;
        }

        // For Google sessions, also enrich from DB so the session has id/username.
        if (!token?.id && session.user?.email) {
          await connectDB();
          const user = await User.findOne({ email: session.user.email });
          if (user) {
            session.user.id = user._id.toString();
            session.user.username = user.username;
            session.user.role = user.role ?? 'user';
          }
        }
        return session;
      } catch (error) {
        console.error('Session verification error:', error);
        return session;
      }
    },
  },
};

// Re-export for the register route to hash passwords consistently.
export { hashPassword };
