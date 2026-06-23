import * as crypto from "crypto";

export interface AuthenticatedPrincipal {
  subjectId: string;
  tenantDid: string;
  email?: string;
  issuer: string;
  issuedAt: number;
  expiresAt: number;
  roles?: string[]; // Phase 2-H.3
}

export interface JwtVerifier {
  verifyToken(token: string): Promise<AuthenticatedPrincipal>;
}

export class CryptoJwtVerifier implements JwtVerifier {
  constructor(private readonly secretKey: string) {}

  async verifyToken(token: string): Promise<AuthenticatedPrincipal> {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", this.secretKey)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    if (signatureB64 !== expectedSignature) {
      throw new Error("Invalid JWT signature");
    }

    // Parse Payload
    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    // Verify Expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error("JWT expired");
    }

    return {
      subjectId: payload.sub,
      tenantDid: payload.tenantDid,
      email: payload.email,
      issuer: payload.iss,
      issuedAt: payload.iat,
      expiresAt: payload.exp,
      roles: payload.roles
    };
  }
}
