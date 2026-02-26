import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const appUrl = process.env.NEXTAUTH_URL || new URL(request.url).origin;

  const response = NextResponse.redirect(
    session?.idToken
      ? buildKeycloakLogoutUrl(session.idToken, appUrl)
      : appUrl
  );

  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");

  return response;
}

function buildKeycloakLogoutUrl(idToken: string, redirectUri: string): string {
  const issuer = process.env.KEYCLOAK_ISSUER!;
  const url = new URL(`${issuer}/protocol/openid-connect/logout`);
  url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("post_logout_redirect_uri", redirectUri);
  return url.toString();
}
