import dbConnect from "@/lib/dbConnect";
import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { compare } from "bcryptjs";

// Custom user type (extends NextAuth's User)
interface ExtendedUser extends User {
  id: string;
  _id?: string;
  role: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // ✅ prevents large cookies (fixes HTTP 431)
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        console.log("Auth attempt:", credentials);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        const usersCollection = await dbConnect("user");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });
        //console.log("Found user:", user);

        if (!user) {
          console.log("❌ User not found");
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        console.log("Password match:", isPasswordValid);

        if (!isPasswordValid) {
          console.log("❌ Invalid password");
          return null;
        }

       /// console.log("✅ Login success");
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account) {
        try {
          const usersCollection = await dbConnect("user");
          //users
          const existingUser = await usersCollection.findOne({
            providerAccountId: account.providerAccountId,
          });

          if (!existingUser) {
            const result = await usersCollection.insertOne({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image,
              role: "user",
              createdAt: new Date(),
            });

            (user as ExtendedUser)._id = result.insertedId.toString();
            (user as ExtendedUser).role = "user";
          } else {
            (user as ExtendedUser)._id = existingUser._id.toString();
            (user as ExtendedUser).role = existingUser.role || "user";
          }
        } catch (error) {
          console.error("signIn error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
