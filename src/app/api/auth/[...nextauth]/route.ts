import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"


const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" }
    //   },
    //   // async authorize(credentials, req) {
    //     // 1. DB에서 유저 조회
    //     // 2. 비밀번호 해시 비교
    //     // 3. 성공 시 유저 객체 반환, 실패 시 null 반환
    //     // const user = await getUserByEmail(credentials.email)
    //     // if (user && await verifyPassword(credentials.password, user.passwordHash)) {
    //     //   return { id: user.id, name: user.name, email: user.email }
    //     // }
    //     // return null
    //   // }
    // })
  ],
  pages: {
    signIn: "/auth/signin",
  }
})

export { handler as GET, handler as POST }