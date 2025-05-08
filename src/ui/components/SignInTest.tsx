'use client'

import React from "react";
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from "@/ui/components/Button";

const SignInButton = () => {
  const { data: session } = useSession();

  if(session && session.user) {
    return (
      <div>
        <p>{session.user.name}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    )
  }
  return (
    // <utton onClick={() => signIn()}>Sign In!</button>
    <Button handleClick={() => signIn()} label="Sing In" size="lg" />
  )
}

export default SignInButton;