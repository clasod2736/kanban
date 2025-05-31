'use client'

import { signIn } from "next-auth/react"

export default function SignInPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>로그인</h1>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        style={{ margin: "10px", padding: "10px" }}
      >
        Google로 로그인
      </button>

      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        style={{ margin: "10px", padding: "10px" }}
      >
        GitHub로 로그인
      </button>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const form = e.currentTarget
          const email = form.email.value
          const password = form.password.value

          const res = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/dashboard",
          })

          if (res?.error) {
            alert("로그인 실패: " + res.error)
          }
        }}
      >
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">이메일로 로그인</button>
      </form>
    </div>
  )
}
