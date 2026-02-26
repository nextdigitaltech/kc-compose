import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <main>
      <h1>Profile</h1>
      <p>
        <a href="/">← Back</a>
      </p>

      <section style={{ marginTop: 24 }}>
        <h2>Session data</h2>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr>
              <th style={th}>Name</th>
              <td style={td}>{session.user?.name}</td>
            </tr>
            <tr>
              <th style={th}>Email</th>
              <td style={td}>{session.user?.email}</td>
            </tr>
            <tr>
              <th style={th}>Avatar</th>
              <td style={td}>
                {session.user?.image ? (
                  <img src={session.user.image} alt="avatar" width={48} height={48} style={{ borderRadius: "50%" }} />
                ) : (
                  "—"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Access token</h2>
        <pre
          style={{
            background: "#f4f4f4",
            padding: 16,
            borderRadius: 8,
            overflowX: "auto",
            fontSize: 12,
          }}
        >
          {session.accessToken ?? "—"}
        </pre>
      </section>
    </main>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 12px",
  border: "1px solid #ddd",
  background: "#f9f9f9",
  width: 120,
};

const td: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #ddd",
};
