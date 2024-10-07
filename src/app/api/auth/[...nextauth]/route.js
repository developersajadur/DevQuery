import { ConnectDB } from "@/lib/ConnectDB";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
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
    // Modify the jwt callback to include the user role in the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.role = user.role; // Add the role to the token
      }
      return token;
    },
    // Include the role in the session
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      if (token?.role) {
        session.user.role = token.role; // Add the role to the session
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
              role: "user", // Default role for new users
            });
          }
          return true; 
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return true; 
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
