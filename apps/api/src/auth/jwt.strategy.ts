import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL') || 'https://bzxdozzbdvzgvgshyamp.supabase.co';
    const jwksUri = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          const decoded = jwt.decode(rawJwtToken, { complete: true }) as any;
          
          if (!decoded || !decoded.header) {
            return done(new Error('Invalid JWT'), null);
          }

          const { alg, kid } = decoded.header;
          this.logger.log(`JWT header: alg=${alg}, kid=${kid}`);

          // Only accept asymmetric algorithms (ES256, RS256) from Supabase JWKS
          // REJECT HS256 to prevent token forgery using public ANON_KEY
          if (alg !== 'ES256' && alg !== 'RS256') {
            this.logger.error(`Rejected JWT with unsupported algorithm: ${alg}`);
            return done(new Error(`Unsupported algorithm: ${alg}. Only ES256 and RS256 are allowed.`), null);
          }

          this.logger.log(`Fetching JWKS key for ${alg} with kid: ${kid}`);
          const publicKey = await this.fetchJwksPublicKey(jwksUri, kid);
          return done(null, publicKey);
        } catch (error) {
          this.logger.error(`JWT validation error: ${error.message}`);
          return done(error, null);
        }
      },
      algorithms: ['ES256', 'RS256'],
    });
    
    this.logger.log(`Configuring JWKS from: ${supabaseUrl}/auth/v1/.well-known/jwks.json`);
  }

  private async fetchJwksPublicKey(jwksUri: string, kid: string): Promise<string> {
    try {
      const response = await fetch(jwksUri);
      const jwks = await response.json();
      
      const key = jwks.keys.find((k: any) => k.kid === kid);
      if (!key) {
        throw new Error(`Key with kid ${kid} not found in JWKS`);
      }
      
      // Convert JWK to PEM using jwk-to-pem library
      return jwkToPem(key);
    } catch (error) {
      this.logger.error(`Failed to fetch JWKS: ${error.message}`);
      throw error;
    }
  }

  async validate(payload: any) {
    this.logger.log(`Validating JWT payload: ${JSON.stringify({ sub: payload.sub, aud: payload.aud, exp: payload.exp, iss: payload.iss })}`);
    
    // Supabase JWT payload structure (ES256/RS256 only)
    // {
    //   "aud": "authenticated",
    //   "exp": 1234567890,
    //   "sub": "user-uuid",
    //   "email": "user@example.com",
    //   "iss": "https://bzxdozzbdvzgvgshyamp.supabase.co/auth/v1",
    //   ...
    // }
    
    if (!payload || !payload.sub) {
      this.logger.warn('Invalid JWT payload: missing sub');
      throw new UnauthorizedException('Invalid JWT payload');
    }

    // Verify audience - must be 'authenticated' for Supabase
    if (payload.aud !== 'authenticated') {
      this.logger.warn(`Invalid JWT payload: unexpected audience ${payload.aud}`);
      throw new UnauthorizedException('Invalid JWT audience');
    }

    // Verify issuer - must match our Supabase project
    const expectedIssuer = `${this.configService.get<string>('SUPABASE_URL')}/auth/v1`;
    if (payload.iss !== expectedIssuer) {
      this.logger.warn(`Invalid JWT payload: unexpected issuer ${payload.iss}`);
      throw new UnauthorizedException('Invalid JWT issuer');
    }

    return {
      id: payload.sub,
      email: payload.email,
      aud: payload.aud,
      role: payload.role || 'authenticated',
    };
  }
}
