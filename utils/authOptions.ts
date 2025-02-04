import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process?.env?.Google_CLIENT_ID || '',
      clientSecret: process?.env?.Google_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn ({ profile }:any) {
      if (profile) {
        console.log('Signed in profile:', profile);
      }
      return true; 
    },
    
    async session ({ session, token }:any) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  }
}