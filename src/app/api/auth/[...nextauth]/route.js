import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConnectDB } from "@/lib/ConnectDB";
import bcrypt from "bcrypt";

const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
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
  ],
  callbacks: {},
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
