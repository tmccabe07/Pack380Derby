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

  const handleLogin = async (pw: string) => {
    if (!pw || pw.length < 3) {
      setError("Password required");
      return;
    }
    try {
      // Temporarily set password for API call
      setSessionPassword(pw);
      const { fetchRacers } = await import("@/lib/api/racers");
      const racers = await fetchRacers();
      if (Array.isArray(racers) && racers.length > 0) {
        setPasswordState(pw);
        setError(null);
      } else {
        setError("Incorrect password");
        setSessionPassword("");
      }
    } catch {
      setError("Incorrect password");
      setSessionPassword("");
    }
  };

  if (!password) {
    return <Login onLogin={handleLogin} error={error || undefined} />;
  }

  return <>{children}</>;
}
