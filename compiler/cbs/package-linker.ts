/**
 * Blueprint DSL CBS Package Linker
 * 
 * Links multiple packages together resolving dependencies.
 */

import { Package, PackageMetadata } from './package-loader';
import { BinarySerializer, BinarySection, SectionType } from './binary-serializer';

export interface LinkResult {
  success: boolean;
  linkedPackage: Package | null;
  errors: string[];
  warnings: string[];
}

export interface LinkSymbol {
  name: string;
  package: string;
  offset: number;
  type: SymbolType;
}

export enum SymbolType {
  FUNCTION = 'FUNCTION',
  GLOBAL = 'GLOBAL',
  CONSTANT = 'CONSTANT',
}

export class PackageLinker {
  private symbols: Map<string, LinkSymbol> = new Map();
  private unresolvedSymbols: Map<string, string[]> = new Map();

  /**
   * Link multiple packages together
   */
  public link(packages: Package[]): LinkResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    this.symbols.clear();
    this.unresolvedSymbols.clear();

    // Collect symbols from all packages
    for (const pkg of packages) {
      this.collectSymbols(pkg);
    }

    // Resolve dependencies
    for (const pkg of packages) {
      const resolutionErrors = this.resolveDependencies(pkg);
      errors.push(...resolutionErrors);
    }

    // Check for unresolved symbols
    for (const [symbol, locations] of this.unresolvedSymbols) {
      errors.push(`Unresolved symbol: ${symbol} in ${locations.join(', ')}`);
    }

    if (errors.length > 0) {
      return {
        success: false,
        linkedPackage: null,
        errors,
        warnings,
      };
    }

    // Merge packages
    const linkedPackage = this.mergePackages(packages);
    warnings.push(`Linked ${packages.length} packages successfully`);

    return {
      success: true,
      linkedPackage,
      errors,
      warnings,
    };
  }

  /**
   * Collect symbols from a package
   */
  private collectSymbols(pkg: Package): void {
    const functionsSection = pkg.sections.get(SectionType.FUNCTIONS);
    if (functionsSection) {
      const functions = this.parseFunctionsSection(functionsSection.data);
      for (const func of functions) {
        const symbol: LinkSymbol = {
          name: func.name,
          package: pkg.metadata.name,
          offset: func.offset,
          type: SymbolType.FUNCTION,
        };
        this.symbols.set(`${pkg.metadata.name}::${func.name}`, symbol);
      }
    }

    // Collect exported symbols
    for (const exportName of pkg.metadata.exports) {
      const symbol = this.symbols.get(`${pkg.metadata.name}::${exportName}`);
      if (symbol) {
        this.symbols.set(exportName, symbol);
      }
    }
  }

  /**
   * Parse functions section
   */
  private parseFunctionsSection(data: Uint8Array): { name: string; offset: number; size: number }[] {
    const functions: { name: string; offset: number; size: number }[] = [];
    let offset = 0;

    const count = this.readInt(data, offset);
    offset += 4;

    for (let i = 0; i < count; i++) {
      const nameLength = this.readInt(data, offset);
      offset += 4;

      const nameBytes = data.slice(offset, offset + nameLength);
      const name = new TextDecoder().decode(nameBytes);
      offset += nameLength;

      const funcOffset = this.readInt(data, offset);
      offset += 4;

      const funcSize = this.readInt(data, offset);
      offset += 4;

      functions.push({ name, offset: funcOffset, size: funcSize });
    }

    return functions;
  }

  /**
   * Resolve dependencies in a package
   */
  private resolveDependencies(pkg: Package): string[] {
    const errors: string[] = [];

    for (const dependency of pkg.metadata.dependencies) {
      const symbol = this.symbols.get(dependency);
      if (!symbol) {
        const locations = this.unresolvedSymbols.get(dependency) || [];
        locations.push(pkg.metadata.name);
        this.unresolvedSymbols.set(dependency, locations);
        errors.push(`Dependency not found: ${dependency}`);
      }
    }

    return errors;
  }

  /**
   * Merge multiple packages into one
   */
  private mergePackages(packages: Package[]): Package {
    const mergedSections = new Map<SectionType, BinarySection>();
    const codeSections: Uint8Array[] = [];
    const constantsSections: Uint8Array[] = [];
    const functionsSections: { name: string; offset: number; size: number }[][] = [];

    let codeOffset = 0;
    let constantsOffset = 0;

    // Merge code sections
    for (const pkg of packages) {
      const codeSection = pkg.sections.get(SectionType.CODE);
      if (codeSection) {
        codeSections.push(codeSection.data);
        codeOffset += codeSection.size;
      }
    }

    // Merge constants sections
    for (const pkg of packages) {
      const constantsSection = pkg.sections.get(SectionType.CONSTANTS);
      if (constantsSection) {
        constantsSections.push(constantsSection.data);
        constantsOffset += constantsSection.size;
      }
    }

    // Merge functions sections with offset adjustment
    let currentCodeOffset = 0;
    for (const pkg of packages) {
      const functionsSection = pkg.sections.get(SectionType.FUNCTIONS);
      if (functionsSection) {
        const functions = this.parseFunctionsSection(functionsSection.data);
        const adjustedFunctions = functions.map(func => ({
          ...func,
          offset: func.offset + currentCodeOffset,
        }));
        functionsSections.push(adjustedFunctions);

        const codeSection = pkg.sections.get(SectionType.CODE);
        if (codeSection) {
          currentCodeOffset += codeSection.size;
        }
      }
    }

    // Create merged code section
    const mergedCodeData = this.concatUint8Arrays(codeSections);
    mergedSections.set(SectionType.CODE, {
      type: SectionType.CODE,
      offset: 0,
      size: mergedCodeData.length,
      data: mergedCodeData,
    });

    // Create merged constants section
    const mergedConstantsData = this.concatUint8Arrays(constantsSections);
    mergedSections.set(SectionType.CONSTANTS, {
      type: SectionType.CONSTANTS,
      offset: 0,
      size: mergedConstantsData.length,
      data: mergedConstantsData,
    });

    // Create merged functions section
    const mergedFunctionsData = this.serializeFunctions(functionsSections.flat());
    mergedSections.set(SectionType.FUNCTIONS, {
      type: SectionType.FUNCTIONS,
      offset: 0,
      size: mergedFunctionsData.length,
      data: mergedFunctionsData,
    });

    // Merge metadata
    const mergedMetadata: PackageMetadata = {
      name: 'linked',
      version: '1.0.0',
      dependencies: [],
      exports: [],
      entryPoint: this.findEntryPoint(packages),
    };

    // Create metadata section
    const metadataSection = BinarySerializer.createMetadataSection(mergedMetadata);
    mergedSections.set(SectionType.METADATA, metadataSection);

    return {
      header: {
        magic: 'BLUE',
        version: 1,
        flags: 0,
        sectionCount: mergedSections.size,
      },
      sections: mergedSections,
      metadata: mergedMetadata,
    };
  }

  /**
   * Find entry point from packages
   */
  private findEntryPoint(packages: Package[]): string | undefined {
    for (const pkg of packages) {
      if (pkg.metadata.entryPoint) {
        return pkg.metadata.entryPoint;
      }
    }
    return undefined;
  }

  /**
   * Concatenate Uint8Arrays
   */
  private concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }

    return result;
  }

  /**
   * Serialize functions
   */
  private serializeFunctions(functions: { name: string; offset: number; size: number }[]): Uint8Array {
    const buffer: number[] = [];

    this.writeInt(buffer, functions.length);

    for (const func of functions) {
      const nameBytes = new TextEncoder().encode(func.name);
      this.writeInt(buffer, nameBytes.length);
      for (const byte of nameBytes) {
        buffer.push(byte);
      }
      this.writeInt(buffer, func.offset);
      this.writeInt(buffer, func.size);
    }

    return new Uint8Array(buffer);
  }

  /**
   * Read int
   */
  private readInt(data: Uint8Array, offset: number): number {
    return (data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3];
  }

  /**
   * Write int
   */
  private writeInt(buffer: number[], value: number): void {
    buffer.push((value >> 24) & 0xFF);
    buffer.push((value >> 16) & 0xFF);
    buffer.push((value >> 8) & 0xFF);
    buffer.push(value & 0xFF);
  }

  /**
   * Get all symbols
   */
  public getSymbols(): Map<string, LinkSymbol> {
    return new Map(this.symbols);
  }

  /**
   * Get unresolved symbols
   */
  public getUnresolvedSymbols(): Map<string, string[]> {
    return new Map(this.unresolvedSymbols);
  }

  /**
   * Clear symbols
   */
  public clearSymbols(): void {
    this.symbols.clear();
    this.unresolvedSymbols.clear();
  }
}
