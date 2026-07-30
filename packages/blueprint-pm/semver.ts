/**
 * Blueprint Semantic Versioning
 */

export class SemVer {
  constructor(
    public major: number,
    public minor: number,
    public patch: number,
    public prerelease?: string,
    public build?: string
  ) {}

  static parse(version: string): SemVer {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/);
    
    if (!match) {
      throw new Error(`Invalid version string: ${version}`);
    }

    return new SemVer(
      parseInt(match[1]),
      parseInt(match[2]),
      parseInt(match[3]),
      match[4],
      match[5]
    );
  }

  toString(): string {
    let version = `${this.major}.${this.minor}.${this.patch}`;
    
    if (this.prerelease) {
      version += `-${this.prerelease}`;
    }
    
    if (this.build) {
      version += `+${this.build}`;
    }

    return version;
  }

  incrementMajor(): SemVer {
    return new SemVer(this.major + 1, 0, 0);
  }

  incrementMinor(): SemVer {
    return new SemVer(this.major, this.minor + 1, 0);
  }

  incrementPatch(): SemVer {
    return new SemVer(this.major, this.minor, this.patch + 1);
  }

  compare(other: SemVer): number {
    if (this.major !== other.major) return this.major - other.major;
    if (this.minor !== other.minor) return this.minor - other.minor;
    if (this.patch !== other.patch) return this.patch - other.patch;
    return 0;
  }

  satisfies(range: string): boolean {
    // Implementation would check if version satisfies range
    return true;
  }
}
