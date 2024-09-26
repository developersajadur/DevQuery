import { ConnectDB } from "@/lib/ConnectDB";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Enter Your Email And Password");
        }

        const db = await ConnectDB();
        const currentUser = await db.collection("users").findOne({ email });

        if (!currentUser) {
          throw new Error("User Not Found");
        }

        const bcryptPasswordMatch = bcrypt.compareSync(password, currentUser.password);

        if (!bcryptPasswordMatch) {
          throw new Error("Wrong Password");
        }

        return currentUser;
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
    }),
  ],
  callbacks: {
       // Modify the session callback to include the user ID in the session token
       async jwt({ token, user }) {
        if (user) {
          token.id = user._id;
        }
        return token;
      },
      // Include the user's ID in the session
      async session({ session, token }) {
        if (token?.id) {
          session.user.id = token.id;
        }
        return session;
      },
    async signIn({ user, account }) {
      if (account.provider === "google" || account.provider === "github") {
        try {
          const { name, email, image } = user;
          const db = await ConnectDB();
          const existingUser = await db.collection("users").findOne({ email });

          if (!existingUser) {
            await db.collection("users").insertOne({
              name,
              email,
              image,
            });
          }
          return user; 
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return user; 
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
