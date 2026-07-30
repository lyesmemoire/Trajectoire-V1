/**
 * Blueprint DSL CBS Debug Symbols
 * 
 * Manages debug symbols for bytecode debugging.
 */

export interface DebugSymbol {
  name: string;
  type: SymbolType;
  address: number;
  size: number;
  scope: string;
  line?: number;
  column?: number;
  sourceFile?: string;
}

export interface SourceLocation {
  file: string;
  line: number;
  column: number;
}

export interface DebugLineInfo {
  address: number;
  location: SourceLocation;
}

export interface DebugFunctionInfo {
  name: string;
  startAddress: number;
  endAddress: number;
  parameters: DebugSymbol[];
  locals: DebugSymbol[];
  lineInfo: DebugLineInfo[];
}

export enum SymbolType {
  FUNCTION = 'FUNCTION',
  VARIABLE = 'VARIABLE',
  PARAMETER = 'PARAMETER',
  CONSTANT = 'CONSTANT',
  LABEL = 'LABEL',
}

export class DebugSymbols {
  private symbols: Map<string, DebugSymbol> = new Map();
  private lineInfo: DebugLineInfo[] = [];
  private functionInfo: Map<string, DebugFunctionInfo> = new Map();
  private sourceFiles: Set<string> = new Set();

  /**
   * Add a debug symbol
   */
  public addSymbol(symbol: DebugSymbol): void {
    const key = this.getSymbolKey(symbol);
    this.symbols.set(key, symbol);

    if (symbol.sourceFile) {
      this.sourceFiles.add(symbol.sourceFile);
    }
  }

  /**
   * Get a debug symbol by name and scope
   */
  public getSymbol(name: string, scope: string): DebugSymbol | null {
    const key = `${scope}::${name}`;
    return this.symbols.get(key) || null;
  }

  /**
   * Get symbol by address
   */
  public getSymbolByAddress(address: number): DebugSymbol | null {
    for (const symbol of this.symbols.values()) {
      if (address >= symbol.address && address < symbol.address + symbol.size) {
        return symbol;
      }
    }
    return null;
  }

  /**
   * Add line info
   */
  public addLineInfo(lineInfo: DebugLineInfo): void {
    this.lineInfo.push(lineInfo);
    this.lineInfo.sort((a, b) => a.address - b.address);

    if (lineInfo.location.file) {
      this.sourceFiles.add(lineInfo.location.file);
    }
  }

  /**
   * Get line info by address
   */
  public getLineInfo(address: number): SourceLocation | null {
    for (let i = this.lineInfo.length - 1; i >= 0; i--) {
      if (address >= this.lineInfo[i].address) {
        return this.lineInfo[i].location;
      }
    }
    return null;
  }

  /**
   * Add function info
   */
  public addFunctionInfo(info: DebugFunctionInfo): void {
    this.functionInfo.set(info.name, info);

    for (const param of info.parameters) {
      this.addSymbol(param);
    }

    for (const local of info.locals) {
      this.addSymbol(local);
    }

    for (const line of info.lineInfo) {
      this.addLineInfo(line);
    }
  }

  /**
   * Get function info by name
   */
  public getFunctionInfo(name: string): DebugFunctionInfo | null {
    return this.functionInfo.get(name) || null;
  }

  /**
   * Get function info by address
   */
  public getFunctionInfoByAddress(address: number): DebugFunctionInfo | null {
    for (const info of this.functionInfo.values()) {
      if (address >= info.startAddress && address < info.endAddress) {
        return info;
      }
    }
    return null;
  }

  /**
   * Get all symbols
   */
  public getAllSymbols(): DebugSymbol[] {
    return Array.from(this.symbols.values());
  }

  /**
   * Get all symbols by type
   */
  public getSymbolsByType(type: SymbolType): DebugSymbol[] {
    return Array.from(this.symbols.values()).filter(s => s.type === type);
  }

  /**
   * Get all symbols in scope
   */
  public getSymbolsInScope(scope: string): DebugSymbol[] {
    return Array.from(this.symbols.values()).filter(s => s.scope === scope);
  }

  /**
   * Get all source files
   */
  public getSourceFiles(): string[] {
    return Array.from(this.sourceFiles);
  }

  /**
   * Get line info for a source file
   */
  public getLineInfoForFile(file: string): DebugLineInfo[] {
    return this.lineInfo.filter(li => li.location.file === file);
  }

  /**
   * Generate symbol key
   */
  private getSymbolKey(symbol: DebugSymbol): string {
    return `${symbol.scope}::${symbol.name}`;
  }

  /**
   * Serialize debug symbols to JSON
   */
  public serialize(): string {
    const data = {
      symbols: Array.from(this.symbols.values()),
      lineInfo: this.lineInfo,
      functionInfo: Array.from(this.functionInfo.values()),
      sourceFiles: Array.from(this.sourceFiles),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Deserialize debug symbols from JSON
   */
  public deserialize(json: string): void {
    const data = JSON.parse(json);

    this.symbols.clear();
    this.lineInfo = [];
    this.functionInfo.clear();
    this.sourceFiles.clear();

    for (const symbol of data.symbols) {
      this.addSymbol(symbol);
    }

    for (const line of data.lineInfo) {
      this.addLineInfo(line);
    }

    for (const func of data.functionInfo) {
      this.addFunctionInfo(func);
    }

    for (const file of data.sourceFiles) {
      this.sourceFiles.add(file);
    }
  }

  /**
   * Clear all debug symbols
   */
  public clear(): void {
    this.symbols.clear();
    this.lineInfo = [];
    this.functionInfo.clear();
    this.sourceFiles.clear();
  }

  /**
   * Validate debug symbols
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const symbol of this.symbols.values()) {
      if (!symbol.name) {
        errors.push('Symbol missing name');
      }

      if (!symbol.scope) {
        errors.push(`Symbol ${symbol.name} missing scope`);
      }

      if (symbol.address < 0) {
        errors.push(`Symbol ${symbol.name} has invalid address`);
      }

      if (symbol.size < 0) {
        errors.push(`Symbol ${symbol.name} has invalid size`);
      }
    }

    for (const line of this.lineInfo) {
      if (line.address < 0) {
        errors.push(`Line info has invalid address`);
      }

      if (!line.location.file) {
        errors.push(`Line info missing source file`);
      }

      if (line.location.line < 0) {
        errors.push(`Line info has invalid line number`);
      }
    }

    for (const func of this.functionInfo.values()) {
      if (!func.name) {
        errors.push('Function info missing name');
      }

      if (func.startAddress < 0) {
        errors.push(`Function ${func.name} has invalid start address`);
      }

      if (func.endAddress < func.startAddress) {
        errors.push(`Function ${func.name} has invalid end address`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    symbolCount: number;
    lineInfoCount: number;
    functionInfoCount: number;
    sourceFileCount: number;
  } {
    return {
      symbolCount: this.symbols.size,
      lineInfoCount: this.lineInfo.length,
      functionInfoCount: this.functionInfo.size,
      sourceFileCount: this.sourceFiles.size,
    };
  }
}
