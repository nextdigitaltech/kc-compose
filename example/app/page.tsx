"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>Next.js + Keycloak</h1>

      {session ? (
        <>
          <p>
            Welcome, <strong>{session.user?.name ?? session.user?.email}</strong>!
          </p>
          <nav style={{ display: "flex", gap: 16, margin: "20px 0" }}>
            <Link href="/profile">View profile</Link>
          </nav>
          <button onClick={() => { window.location.href = "/api/auth/federated-logout"; }}>Sign out</button>
        </>
      ) : (
        <>
          <p>You are not signed in.</p>
          <button onClick={() => signIn("keycloak")}>Sign in with Keycloak</button>
        </>
      )}
    </main>
  );
}
