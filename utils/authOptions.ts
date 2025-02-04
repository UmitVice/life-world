import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process?.env?.Google_CLIENT_ID,
      clientSecret: process?.env?.Google_CLIENT_SECRET,
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
    async signIn ({ profile }) {
    },
    
    async session ({ session }) {
    },
  }
}