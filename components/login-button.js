"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";

export function LoginButton() {
  const { user, login, logout } = useAuth();

  if (user) {
    return (
      <div className="mb-4">
        <p>Logged in as {user.username}</p>
        <Button onClick={logout}>Logout</Button>
      </div>
    );
  }

  return <Button onClick={login}>Login with Discord</Button>;
}
