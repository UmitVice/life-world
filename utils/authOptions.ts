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
           let username = profile?.name?.trim().slice(0, 20) || "user";
           let isTaken = false;
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
      try {
        await connectDB();
        const user = await User?.findOne({ email: session?.user?.email });
        if (user) {
          (session as any).user.id = user?._id?.toString();
          return session;
        }
        return null;
      } catch (error) {
        console.error("Session verification error");
        return false;
      }
    },
  }
}