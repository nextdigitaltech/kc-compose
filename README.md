# Next.js + Keycloak

Full stack with **Keycloak 22**, **PostgreSQL 15** and a **Next.js 14** example app, all orchestrated via Docker Compose.

## Stack

| Service | Technology |
|---------|------------|
| Keycloak | `quay.io/keycloak/keycloak:22.0.5` |
| Database | `postgres:15` |
| Application | Next.js 14 + NextAuth.js v4 |

## Quick Start

```bash
docker compose up --build
```

On first run the realm, client and default user are imported automatically from `keycloak/realm-export.json`.

To reset everything (including the database):

```bash
docker compose down -v && docker compose up --build
```

## URLs and Credentials

| Service | URL | Credentials |
|---------|-----|-------------|
| Next.js app | http://localhost:3000 | — |
| Keycloak Admin Console | http://localhost:8080 | `admin` / `admin` |

## Default Users

| Username | Password | Email |
|----------|----------|-------|
| `johndoe` | `123456` | johndoe@nextdigitaltech.com.br |

## Project Structure

```
.
├── docker-compose.yml
├── keycloak/
│   └── realm-export.json          # Realm, client and user imported on first run
└── example/                       # Next.js application
    ├── Dockerfile
    ├── .env.local                  # Environment variables (local dev)
    ├── next.config.js
    ├── lib/
    │   └── auth.ts                 # NextAuth configuration (provider + callbacks)
    └── app/
        ├── layout.tsx
        ├── page.tsx                # Home page — sign in / sign out
        ├── profile/
        │   └── page.tsx            # Profile page (protected, server component)
        ├── providers.tsx           # SessionProvider
        ├── types/
        │   └── next-auth.d.ts      # Session type extensions
        └── api/auth/
            ├── [...nextauth]/      # NextAuth handler
            └── federated-logout/   # Federated logout (invalidates Keycloak session)
```

## Keycloak Configuration

Defined in `keycloak/realm-export.json` — no manual setup required.

| Property | Value |
|----------|-------|
| Realm | `nextdigitaltech` |
| Client ID | `nextjs-app` |
| Client Secret | `nextjs-app-secret` |
| Valid Redirect URIs | `http://localhost:3000/*` |
| Post-logout Redirect URI | `http://localhost:3000` |
| User registration | enabled |
| Login with email | enabled |

## Authentication Flow

1. **Login** — user clicks *Sign in*, NextAuth redirects to the Keycloak login page
2. **Callback** — Keycloak redirects back with an authorization code, NextAuth exchanges it for tokens
3. **Session** — `accessToken` and `idToken` are stored in the NextAuth session cookie
4. **Logout** — `GET /api/auth/federated-logout` clears the NextAuth cookie and calls Keycloak's `end_session` endpoint, fully terminating the SSO session
