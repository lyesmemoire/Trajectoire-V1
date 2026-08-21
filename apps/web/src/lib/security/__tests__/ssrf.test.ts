// lib/security/__tests__/ssrf.test.ts
//
// SSRF PROTECTION TESTS
// Tests for URL validation and SSRF protection

import { validateUrl, validateUrls, sanitizeUrl, getAllowedDomains } from '../ssrf';

describe('SSRF URL Validation', () => {
  describe('Valid URLs', () => {
    it('should allow OpenAI API', () => {
      expect(validateUrl('https://api.openai.com/v1/chat/completions')).toBe(true);
    });

    it('should allow Supabase domains', () => {
      expect(validateUrl('https://xxx.supabase.co/auth/v1/user')).toBe(true);
    });

    it('should allow Stripe API', () => {
      expect(validateUrl('https://api.stripe.com/v1/charges')).toBe(true);
    });

    it('should allow CDN domains', () => {
      expect(validateUrl('https://cdn.jsdelivr.net/npm/package')).toBe(true);
    });
  });

  describe('Localhost Blocking', () => {
    it('should block localhost', () => {
      expect(validateUrl('http://localhost:3000')).toBe(false);
    });

    it('should block 127.0.0.1', () => {
      expect(validateUrl('http://127.0.0.1:8080')).toBe(false);
    });

    it('should block 0.0.0.0', () => {
      expect(validateUrl('http://0.0.0.0:3000')).toBe(false);
    });

    it('should block IPv6 localhost', () => {
      expect(validateUrl('http://[::1]:3000')).toBe(false);
    });

    it('should block ::1', () => {
      expect(validateUrl('http://::1:3000')).toBe(false);
    });
  });

  describe('Cloud Metadata Blocking', () => {
    it('should block AWS metadata', () => {
      expect(validateUrl('http://169.254.169.254/latest/meta-data/')).toBe(false);
    });

    it('should block AWS metadata IP', () => {
      expect(validateUrl('http://169.254.169.254')).toBe(false);
    });

    it('should block GCP metadata', () => {
      expect(validateUrl('http://metadata.google.internal/computeMetadata/v1/')).toBe(false);
    });

    it('should block Azure metadata', () => {
      expect(validateUrl('http://169.254.170.2/metadata/instance')).toBe(false);
    });
  });

  describe('Private IP Blocking', () => {
    it('should block 10.x.x.x', () => {
      expect(validateUrl('http://10.0.0.1:8080')).toBe(false);
    });

    it('should block 172.16.x.x', () => {
      expect(validateUrl('http://172.16.0.1:8080')).toBe(false);
    });

    it('should block 172.31.x.x', () => {
      expect(validateUrl('http://172.31.255.255:8080')).toBe(false);
    });

    it('should block 192.168.x.x', () => {
      expect(validateUrl('http://192.168.1.1:8080')).toBe(false);
    });

    it('should block 127.x.x.x', () => {
      expect(validateUrl('http://127.1.1.1:8080')).toBe(false);
    });

    it('should block 0.x.x.x', () => {
      expect(validateUrl('http://0.0.0.0:8080')).toBe(false);
    });

    it('should block IPv6 unique local', () => {
      expect(validateUrl('http://fc00::1')).toBe(false);
    });

    it('should block IPv6 link-local', () => {
      expect(validateUrl('http://fe80::1')).toBe(false);
    });
  });

  describe('Protocol Validation', () => {
    it('should block FTP', () => {
      expect(validateUrl('ftp://example.com')).toBe(false);
    });

    it('should block file://', () => {
      expect(validateUrl('file:///etc/passwd')).toBe(false);
    });

    it('should block gopher://', () => {
      expect(validateUrl('gopher://example.com')).toBe(false);
    });

    it('should allow HTTP', () => {
      expect(validateUrl('http://api.openai.com')).toBe(true);
    });

    it('should allow HTTPS', () => {
      expect(validateUrl('https://api.openai.com')).toBe(true);
    });
  });

  describe('Internal Port Blocking', () => {
    it('should block SSH port 22', () => {
      expect(validateUrl('http://api.openai.com:22')).toBe(false);
    });

    it('should block MySQL port 3306', () => {
      expect(validateUrl('http://api.openai.com:3306')).toBe(false);
    });

    it('should block PostgreSQL port 5432', () => {
      expect(validateUrl('http://api.openai.com:5432')).toBe(false);
    });

    it('should block Redis port 6379', () => {
      expect(validateUrl('http://api.openai.com:6379')).toBe(false);
    });

    it('should block MongoDB port 27017', () => {
      expect(validateUrl('http://api.openai.com:27017')).toBe(false);
    });

    it('should block dynamic ports (49152-65535)', () => {
      expect(validateUrl('http://api.openai.com:50000')).toBe(false);
    });

    it('should allow standard HTTP port 80', () => {
      expect(validateUrl('http://api.openai.com:80')).toBe(true);
    });

    it('should allow standard HTTPS port 443', () => {
      expect(validateUrl('https://api.openai.com:443')).toBe(true);
    });
  });

  describe('Redirection Pattern Blocking', () => {
    it('should block URLs with @', () => {
      expect(validateUrl('http://api.openai.com@evil.com')).toBe(false);
    });

    it('should block triple slashes', () => {
      expect(validateUrl('http://api.openai.com///path')).toBe(false);
    });

    it('should block backslashes', () => {
      expect(validateUrl('http://api.openai.com\\path')).toBe(false);
    });

    it('should block encoded slash %2f', () => {
      expect(validateUrl('http://api.openai.com%2fpath')).toBe(false);
    });

    it('should block encoded backslash %5c', () => {
      expect(validateUrl('http://api.openai.com%5cpath')).toBe(false);
    });

    it('should block null byte %00', () => {
      expect(validateUrl('http://api.openai.com%00path')).toBe(false);
    });

    it('should block CR %0d', () => {
      expect(validateUrl('http://api.openai.com%0dpath')).toBe(false);
    });

    it('should block LF %0a', () => {
      expect(validateUrl('http://api.openai.com%0apath')).toBe(false);
    });
  });

  describe('Domain Whitelist', () => {
    it('should block non-whitelisted domains', () => {
      expect(validateUrl('https://evil.com')).toBe(false);
    });

    it('should block subdomains of non-whitelisted domains', () => {
      expect(validateUrl('https://sub.evil.com')).toBe(false);
    });

    it('should allow wildcard subdomains', () => {
      expect(validateUrl('https://xxx.supabase.co')).toBe(true);
    });
  });

  describe('Invalid URL Format', () => {
    it('should reject invalid URL', () => {
      expect(validateUrl('not-a-url')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateUrl('')).toBe(false);
    });

    it('should reject URL without protocol', () => {
      expect(validateUrl('api.openai.com')).toBe(false);
    });
  });
});

describe('Multiple URL Validation', () => {
  it('should validate multiple URLs', () => {
    const urls = [
      'https://api.openai.com',
      'http://localhost:3000',
    ];
    
    const result = validateUrls(urls);
    
    expect(result.valid).toHaveLength(1);
    expect(result.invalid).toHaveLength(1);
    expect(result.valid).toContain('https://api.openai.com');
    expect(result.invalid).toContain('http://localhost:3000');
  });
});

describe('URL Sanitization', () => {
  it('should sanitize valid URL', () => {
    const url = 'https://api.openai.com/v1/chat#fragment';
    const sanitized = sanitizeUrl(url);
    
    expect(sanitized).toBe('https://api.openai.com/v1/chat');
  });

  it('should remove credentials', () => {
    const url = 'https://user:pass@api.openai.com/v1/chat';
    const sanitized = sanitizeUrl(url);
    
    expect(sanitized).toBe('https://api.openai.com/v1/chat');
  });

  it('should return null for invalid URL', () => {
    expect(sanitizeUrl('http://localhost:3000')).toBeNull();
  });

  it('should return null for blocked URL', () => {
    expect(sanitizeUrl('http://169.254.169.254')).toBeNull();
  });
});

describe('Allowed Domains Configuration', () => {
  it('should return default allowed domains', () => {
    const domains = getAllowedDomains();
    
    expect(domains).toContain('api.openai.com');
    expect(domains).toContain('*.supabase.co');
    expect(domains).toContain('api.stripe.com');
    expect(domains).toContain('cdn.jsdelivr.net');
  });

  it('should include custom domains from env', () => {
    const original = process.env.SSRF_ALLOWED_DOMAINS;
    process.env.SSRF_ALLOWED_DOMAINS = 'custom.com,another.com';
    
    const domains = getAllowedDomains();
    
    expect(domains).toContain('custom.com');
    expect(domains).toContain('another.com');
    
    process.env.SSRF_ALLOWED_DOMAINS = original;
  });
});
