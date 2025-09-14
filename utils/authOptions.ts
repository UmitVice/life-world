import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/config/database';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process?.env?.Google_CLIENT_ID || process?.env?.GOOGLE_CLIENT_ID || '',
      clientSecret: process?.env?.Google_CLIENT_SECRET || process?.env?.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        }
      }
    })
  ],
  callbacks: {
    async signIn ({ profile }:any) {
      try {
        await connectDB();

        const userExit = await User?.findOne({ email: profile?.email });

        if (!userExit) {
          const username = profile?.name?.slice(0, 20);

          await User.create({
            email: profile?.email,
            username,
            image: profile?.picture,
          });
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    
    async session ({ session}:any) {
      const email = session?.user?.email;
      if (!email) return session;

      try {
        await connectDB();
        const user = await User?.findOne({ email });
        if (user) {
          (session as any).user.id = user?._id?.toString();
        }
      } catch (error) {
        // ignore lookup errors to avoid breaking public pages
      }
      return session;
    },
  }
}