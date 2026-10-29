
"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/submit-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed.");
      }

      setMessage("Thank you! Your email has been submitted.");
      setEmail("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="text-2xl font-bold text-gray-900">
          Stay Connected
        </h1>

        <p className="text-sm text-gray-600">
          Enter your email address to get in touch with us.
        </p>

        <label htmlFor="email" className="block text-sm font-medium">
          Email address
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          maxLength={254}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <p role="status" className="text-sm text-gray-700">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
