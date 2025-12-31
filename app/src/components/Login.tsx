import React, { useState } from "react";

interface LoginProps {
  onLogin: (password: string) => void;
  error?: string;
}

export default function Login({ onLogin, error }: LoginProps) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-xs"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login Required</h2>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Enter the shared derby password:
        </label>
        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-xs text-gray-500"
            onClick={() => setShow(s => !s)}
            tabIndex={-1}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
