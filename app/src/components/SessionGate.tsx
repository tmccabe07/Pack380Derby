"use client";

import React, { useState, useEffect } from "react";
import Login from "@/components/Login";
import { getSessionPassword, setSessionPassword } from "@/lib/auth/session";

interface Props {
  children: React.ReactNode;
}

export default function SessionGate({ children }: Props) {
  const [password, setPasswordState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPasswordState(getSessionPassword());
  }, []);

  const handleLogin = (pw: string) => {
    if (!pw || pw.length < 3) {
      setError("Password required");
      return;
    }
    setSessionPassword(pw);
    setPasswordState(pw);
    setError(null);
  };

  if (!password) {
    return <Login onLogin={handleLogin} error={error || undefined} />;
  }

  return <>{children}</>;
}
