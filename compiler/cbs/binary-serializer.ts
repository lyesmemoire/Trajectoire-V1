/**
 * Blueprint DSL CBS Binary Serializer
 * 
 * Serializes bytecode to binary format.
 */

export interface BinaryHeader {
  magic: string;
  version: number;
  flags: number;
  sectionCount: number;
}

export interface BinarySection {
  type: SectionType;
  offset: number;
  size: number;
  data: Uint8Array;
}

export enum SectionType {
  CODE = 0x01,
  CONSTANTS = 0x02,
  FUNCTIONS = 0x03,
  DEBUG = 0x04,
  METADATA = 0x05,
  EXCEPTIONS = 0x06,
}

export class BinarySerializer {
  private static readonly MAGIC = 'BLUE';
  private static readonly VERSION = 1;

  /**
   * Serialize bytecode to binary format
   */
  public static serialize(sections: BinarySection[]): Uint8Array {
    const buffer: number[] = [];

    // Write header
    const header: BinaryHeader = {
      magic: this.MAGIC,
      version: this.VERSION,
      flags: 0,
      sectionCount: sections.length,
    };

    this.writeHeader(buffer, header);

    // Write section table
    let currentOffset = this.getHeaderSize();
    const sectionTable: BinarySection[] = [];

    for (const section of sections) {
      const sectionEntry: BinarySection = {
        type: section.type,
        offset: currentOffset,
        size: section.data.length,
        data: new Uint8Array(0),
      };
      sectionTable.push(sectionEntry);
      currentOffset += section.data.length;
    }

    for (const section of sectionTable) {
      this.writeSectionEntry(buffer, section);
    }

    // Write section data
    for (const section of sections) {
      for (const byte of section.data) {
        buffer.push(byte);
      }
    }

    return new Uint8Array(buffer);
  }

  /**
   * Deserialize binary format to bytecode
   */
  public static deserialize(data: Uint8Array): { header: BinaryHeader; sections: BinarySection[] } {
    let offset = 0;

    // Read header
    const header = this.readHeader(data, offset);
    offset += this.getHeaderSize();

    // Read section table
    const sectionTable: BinarySection[] = [];
    for (let i = 0; i < header.sectionCount; i++) {
      const section = this.readSectionEntry(data, offset);
      sectionTable.push(section);
      offset += this.getSectionEntrySize();
    }

    // Read section data
    const sections: BinarySection[] = [];
    for (const entry of sectionTable) {
      const sectionData = data.slice(entry.offset, entry.offset + entry.size);
      sections.push({
        type: entry.type,
        offset: entry.offset,
        size: entry.size,
        data: sectionData,
      });
    }

    return { header, sections };
  }

  /**
   * Write header
   */
  private static writeHeader(buffer: number[], header: BinaryHeader): void {
    // Magic
    for (let i = 0; i < header.magic.length; i++) {
      buffer.push(header.magic.charCodeAt(i));
    }

    // Version
    this.writeInt(buffer, header.version);

    // Flags
    this.writeInt(buffer, header.flags);

    // Section count
    this.writeInt(buffer, header.sectionCount);
  }

  /**
   * Read header
   */
  private static readHeader(data: Uint8Array, offset: number): BinaryHeader {
    let currentOffset = offset;

    // Magic
    const magic = String.fromCharCode(
      data[currentOffset],
      data[currentOffset + 1],
      data[currentOffset + 2],
      data[currentOffset + 3]
    );
    currentOffset += 4;

    // Version
    const version = this.readInt(data, currentOffset);
    currentOffset += 4;

    // Flags
    const flags = this.readInt(data, currentOffset);
    currentOffset += 4;

    // Section count
    const sectionCount = this.readInt(data, currentOffset);
    currentOffset += 4;

    return {
      magic,
      version,
      flags,
      sectionCount,
    };
  }

  /**
   * Write section entry
   */
  private static writeSectionEntry(buffer: number[], section: BinarySection): void {
    this.writeInt(buffer, section.type);
    this.writeInt(buffer, section.offset);
    this.writeInt(buffer, section.size);
  }

  /**
   * Read section entry
   */
  private static readSectionEntry(data: Uint8Array, offset: number): BinarySection {
    let currentOffset = offset;

    const type = this.readInt(data, currentOffset) as SectionType;
    currentOffset += 4;

    const sectionOffset = this.readInt(data, currentOffset);
    currentOffset += 4;

    const size = this.readInt(data, currentOffset);
    currentOffset += 4;

    return {
      type,
      offset: sectionOffset,
      size,
      data: new Uint8Array(0),
    };
  }

  /**
   * Get header size
   */
  private static getHeaderSize(): number {
    return 4 + 4 + 4 + 4; // magic + version + flags + sectionCount
  }

  /**
   * Get section entry size
   */
  private static getSectionEntrySize(): number {
    return 4 + 4 + 4; // type + offset + size
  }

  /**
   * Write int
   */
  private static writeInt(buffer: number[], value: number): void {
    buffer.push((value >> 24) & 0xFF);
    buffer.push((value >> 16) & 0xFF);
    buffer.push((value >> 8) & 0xFF);
    buffer.push(value & 0xFF);
  }

  /**
   * Read int
   */
  private static readInt(data: Uint8Array, offset: number): number {
    return (data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3];
  }

  /**
   * Create code section
   */
  public static createCodeSection(bytecode: Uint8Array): BinarySection {
    return {
      type: SectionType.CODE,
      offset: 0,
      size: bytecode.length,
      data: bytecode,
    };
  }

  /**
   * Create constants section
   */
  public static createConstantsSection(constants: unknown[]): BinarySection {
    const buffer: number[] = [];

    for (const constant of constants) {
      this.writeConstant(buffer, constant);
    }

    return {
      type: SectionType.CONSTANTS,
      offset: 0,
      size: buffer.length,
      data: new Uint8Array(buffer),
    };
  }

  /**
   * Write constant
   */
  private static writeConstant(buffer: number[], constant: unknown): void {
    if (typeof constant === 'number') {
      buffer.push(0x01); // Number type
      this.writeInt(buffer, constant);
    } else if (typeof constant === 'string') {
      buffer.push(0x02); // String type
      const bytes = new TextEncoder().encode(constant);
      this.writeInt(buffer, bytes.length);
      for (const byte of bytes) {
        buffer.push(byte);
      }
    } else if (typeof constant === 'boolean') {
      buffer.push(0x03); // Boolean type
      buffer.push(constant ? 1 : 0);
    } else if (constant === null) {
      buffer.push(0x00); // Null type
    } else if (typeof constant === 'object') {
      buffer.push(0x04); // Object type
      const json = JSON.stringify(constant);
      const bytes = new TextEncoder().encode(json);
      this.writeInt(buffer, bytes.length);
      for (const byte of bytes) {
        buffer.push(byte);
      }
    }
  }

  /**
   * Create functions section
   */
  public static createFunctionsSection(functions: { name: string; offset: number; size: number }[]): BinarySection {
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

    return {
      type: SectionType.FUNCTIONS,
      offset: 0,
      size: buffer.length,
      data: new Uint8Array(buffer),
    };
  }

  /**
   * Create metadata section
   */
  public static createMetadataSection(metadata: Record<string, unknown>): BinarySection {
    const json = JSON.stringify(metadata);
    const bytes = new TextEncoder().encode(json);

    return {
      type: SectionType.METADATA,
      offset: 0,
      size: bytes.length,
      data: bytes,
    };
  }

  /**
   * Create exception table section
   */
  public static createExceptionSection(exceptionTable: unknown[]): BinarySection {
    const json = JSON.stringify(exceptionTable);
    const bytes = new TextEncoder().encode(json);

    return {
      type: SectionType.EXCEPTIONS,
      offset: 0,
      size: bytes.length,
      data: bytes,
    };
  }
}
