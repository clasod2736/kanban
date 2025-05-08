import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

if (
  !process.env.GITHUB_ID ||
  !process.env.GITHUB_SECRET
) {
  throw new Error("Missing OAuth Github environment variables");
}

if (
  !process.env.GOOGLE_ID ||
  !process.env.GOOGLE_SECRET
) {
  throw new Error("Missing OAuth Google environment variables");
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
})

export { handler as GET, handler as POST }