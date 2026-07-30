/**
 * Blueprint DSL CBS Binary Versioning
 * 
 * Manages binary format versioning and compatibility.
 */

export interface Version {
  major: number;
  minor: number;
  patch: number;
  preRelease?: string;
  buildMetadata?: string;
}

export interface VersionRange {
  min: Version;
  max: Version;
  includeMin: boolean;
  includeMax: boolean;
}

export interface CompatibilityInfo {
  version: Version;
  compatibleVersions: VersionRange[];
  breakingChanges: string[];
  features: string[];
}

export class BinaryVersioning {
  private static readonly CURRENT_VERSION: Version = {
    major: 1,
    minor: 0,
    patch: 0,
  };

  private static compatibilityMatrix: Map<string, CompatibilityInfo> = new Map();

  static {
    // Version 1.0.0 compatibility
    this.compatibilityMatrix.set('1.0.0', {
      version: { major: 1, minor: 0, patch: 0 },
      compatibleVersions: [
        {
          min: { major: 1, minor: 0, patch: 0 },
          max: { major: 1, minor: 0, patch: 0 },
          includeMin: true,
          includeMax: true,
        },
      ],
      breakingChanges: [],
      features: [
        'Initial release',
        'Basic instruction set',
        'Stack-based execution',
        'Package format',
      ],
    });
  }

  /**
   * Get current version
   */
  public static getCurrentVersion(): Version {
    return { ...this.CURRENT_VERSION };
  }

  /**
   * Parse version string
   */
  public static parseVersion(versionString: string): Version {
    const match = versionString.match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/);
    
    if (!match) {
      throw new Error(`Invalid version string: ${versionString}`);
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      preRelease: match[4],
      buildMetadata: match[5],
    };
  }

  /**
   * Format version to string
   */
  public static formatVersion(version: Version): string {
    let result = `${version.major}.${version.minor}.${version.patch}`;
    
    if (version.preRelease) {
      result += `-${version.preRelease}`;
    }
    
    if (version.buildMetadata) {
      result += `+${version.buildMetadata}`;
    }
    
    return result;
  }

  /**
   * Compare two versions
   */
  public static compareVersions(v1: Version, v2: Version): number {
    if (v1.major !== v2.major) {
      return v1.major - v2.major;
    }
    
    if (v1.minor !== v2.minor) {
      return v1.minor - v2.minor;
    }
    
    if (v1.patch !== v2.patch) {
      return v1.patch - v2.patch;
    }
    
    // Compare pre-release versions
    const pre1 = v1.preRelease || '';
    const pre2 = v2.preRelease || '';
    
    if (pre1 === pre2) {
      return 0;
    }
    
    if (!pre1) {
      return 1; // Release is higher than pre-release
    }
    
    if (!pre2) {
      return -1;
    }
    
    return pre1.localeCompare(pre2);
  }

  /**
   * Check if version is compatible with current version
   */
  public static isCompatible(version: Version): boolean {
    const current = this.getCurrentVersion();
    const compatInfo = this.compatibilityMatrix.get(this.formatVersion(current));

    if (!compatInfo) {
      return false;
    }

    for (const range of compatInfo.compatibleVersions) {
      if (this.isInRange(version, range)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if version is in range
   */
  private static isInRange(version: Version, range: VersionRange): boolean {
    const minCompare = this.compareVersions(version, range.min);
    const maxCompare = this.compareVersions(version, range.max);

    const minValid = range.includeMin ? minCompare >= 0 : minCompare > 0;
    const maxValid = range.includeMax ? maxCompare <= 0 : maxCompare < 0;

    return minValid && maxValid;
  }

  /**
   * Get compatibility info for a version
   */
  public static getCompatibilityInfo(version: Version): CompatibilityInfo | null {
    const versionString = this.formatVersion(version);
    return this.compatibilityMatrix.get(versionString) || null;
  }

  /**
   * Check if upgrade is safe
   */
  public static isSafeUpgrade(from: Version, to: Version): boolean {
    // Major version changes are breaking
    if (to.major > from.major) {
      return false;
    }

    // Minor version changes may introduce new features but are backward compatible
    if (to.minor > from.minor) {
      return true;
    }

    // Patch version changes are bug fixes and always safe
    if (to.patch > from.patch) {
      return true;
    }

    // Downgrades are not safe
    if (this.compareVersions(to, from) < 0) {
      return false;
    }

    return true;
  }

  /**
   * Get breaking changes between versions
   */
  public static getBreakingChanges(from: Version, to: Version): string[] {
    const fromInfo = this.getCompatibilityInfo(from);
    const toInfo = this.getCompatibilityInfo(to);

    if (!toInfo) {
      return ['Unknown target version'];
    }

    return toInfo.breakingChanges;
  }

  /**
   * Get new features in a version
   */
  public static getNewFeatures(version: Version): string[] {
    const info = this.getCompatibilityInfo(version);
    return info ? info.features : [];
  }

  /**
   * Validate version
   */
  public static validateVersion(version: Version): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (version.major < 0) {
      errors.push('Major version must be non-negative');
    }

    if (version.minor < 0) {
      errors.push('Minor version must be non-negative');
    }

    if (version.patch < 0) {
      errors.push('Patch version must be non-negative');
    }

    if (version.major === 0 && version.minor === 0 && version.patch === 0) {
      errors.push('Version 0.0.0 is reserved');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Increment version
   */
  public static incrementVersion(version: Version, type: 'major' | 'minor' | 'patch'): Version {
    const newVersion = { ...version };

    switch (type) {
      case 'major':
        newVersion.major++;
        newVersion.minor = 0;
        newVersion.patch = 0;
        break;
      case 'minor':
        newVersion.minor++;
        newVersion.patch = 0;
        break;
      case 'patch':
        newVersion.patch++;
        break;
    }

    return newVersion;
  }

  /**
   * Get all supported versions
   */
  public static getSupportedVersions(): Version[] {
    return Array.from(this.compatibilityMatrix.values()).map(info => info.version);
  }

  /**
   * Add compatibility info
   */
  public static addCompatibilityInfo(info: CompatibilityInfo): void {
    const versionString = this.formatVersion(info.version);
    this.compatibilityMatrix.set(versionString, info);
  }

  /**
   * Remove compatibility info
   */
  public static removeCompatibilityInfo(version: Version): void {
    const versionString = this.formatVersion(version);
    this.compatibilityMatrix.delete(versionString);
  }
}
