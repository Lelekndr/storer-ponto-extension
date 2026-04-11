export interface TokenSet {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number; // Unix timestamp em ms
  userId: string;
  userEmail: string;
  userDisplayName: string;
  userAvatarUrl?: string; // opcional — nem todo IdP retorna foto
}

// Estado do PKCE — usado durante o fluxo de login
export interface PKCEState {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
  redirectUri: string;
}