import type { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username:", type: "text", placeholder: "your-name" },
        password: { label: "Password:", type: "password", placeholder: "your password" },
      },
      async authorize(credentials) {
        // Dummy user for demonstration purposes
        const user = { id: "22", name: "kl", password: "passed" };

        if (credentials?.username === user.name && credentials?.password === user.password) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin', // Redirect to sign-in page
  },
  
};
