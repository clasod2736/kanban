'use client'

import SignInButton from "@/ui/components/SignInTest";
import { Input } from "@/ui/components/Input";
import { Label } from "@/ui/components/Label";

export default function LandingPage() {
  return (
    <div className="flex flex-col p-4">
      <SignInButton />
      <Label label="Test" />
    </div>
  )
}
