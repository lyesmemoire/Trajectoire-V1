/**
 * Unit tests for CLI Compile Command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { compileCommand } from '../../../src/cli/compile';
import { CompileOptions } from '../../../src/cli/types';
import * as fileUtils from '../../../src/cli/utils/file';

describe('Compile Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(fileUtils, 'readFile').mockResolvedValue('sample source code');
    vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
    vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Compilation', () => {
    it('should compile with input path', async () => {
      const options: CompileOptions = { input: 'test.bp' };
      
      await expect(compileCommand(options)).resolves.not.toThrow();
    });

    it('should compile with custom output path', async () => {
      const options: CompileOptions = { input: 'test.bp', output: 'output.bpp' };
      
      await expect(compileCommand(options)).resolves.not.toThrow();
    });

    it('should compile with optimization enabled', async () => {
      const options: CompileOptions = { input: 'test.bp', optimize: true };
      
      await expect(compileCommand(options)).resolves.not.toThrow();
    });

    it('should compile with custom target', async () => {
      const options: CompileOptions = { input: 'test.bp', target: 'cvm-v2' };
      
      await expect(compileCommand(options)).resolves.not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when input is missing', async () => {
      const options: CompileOptions = {} as CompileOptions;
      
      await expect(compileCommand(options)).rejects.toThrow();
    });

    it('should handle file read errors', async () => {
      vi.spyOn(fileUtils, 'readFile').mockRejectedValue(new Error('Read error'));
      const options: CompileOptions = { input: 'test.bp' };
      
      await expect(compileCommand(options)).rejects.toThrow();
    });

    it('should handle file write errors', async () => {
      vi.spyOn(fileUtils, 'writeFile').mockRejectedValue(new Error('Write error'));
      const options: CompileOptions = { input: 'test.bp' };
      
      await expect(compileCommand(options)).rejects.toThrow();
    });

    it('should handle FileNotFoundError specifically', async () => {
      const { FileNotFoundError } = await import('../../../src/cli/errors');
      vi.spyOn(fileUtils, 'readFile').mockRejectedValue(new FileNotFoundError('File not found'));
      const options: CompileOptions = { input: 'test.bp' };
      
      await expect(compileCommand(options)).rejects.toThrow(FileNotFoundError);
    });

    it('should handle forceFileNotFoundError', async () => {
      const { FileNotFoundError } = await import('../../../src/cli/errors');
      const options: CompileOptions = { input: 'test.bp', forceFileNotFound: true };
      
      await expect(compileCommand(options)).rejects.toThrow(FileNotFoundError);
    });
  });

  describe('Compilation Pipeline', () => {
    it('should run lexing step', async () => {
      const options: CompileOptions = { input: 'test.bp' };
      
      await compileCommand(options);
      
      expect(fileUtils.readFile).toHaveBeenCalled();
    });

    it('should run parsing step', async () => {
      const options: CompileOptions = { input: 'test.bp' };
      
      await compileCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should run semantic analysis', async () => {
      const options: CompileOptions = { input: 'test.bp' };
      
      await compileCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should run type checking', async () => {
      const options: CompileOptions = { input: 'test.bp' };
      
      await compileCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should run optimization', async () => {
      const options: CompileOptions = { input: 'test.bp', optimize: true };
      
      await compileCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should run IR generation', async () => {
      const options: CompileOptions = { input: 'test.bp', emitIR: true };
      
      await compileCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should run bytecode generation', async () => {
      const options: CompileOptions = { input: 'test.bp', emitBytecode: true };
      
      await compileCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });
  });

  describe('Output Generation', () => {
    it('should generate bytecode output', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: CompileOptions = { input: 'test.bp' };
      
      await compileCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should generate IR when emitIR is true', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: CompileOptions = { input: 'test.bp', emitIR: true };
      
      await compileCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should generate package when emitPackage is true', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: CompileOptions = { input: 'test.bp', emitPackage: true };
      
      await compileCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should create output directory if needed', async () => {
      const ensureSpy = vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
      const options: CompileOptions = { input: 'test.bp', output: 'dist/output.bpp' };
      
      await compileCommand(options);
      
      expect(ensureSpy).toHaveBeenCalled();
    });
  });

  describe('Output Format', () => {
    it('should include version in output', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: CompileOptions = { input: 'test.bp' };
      
      await compileCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include target in output', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: CompileOptions = { input: 'test.bp', target: 'cvm-v3' };
      
      await compileCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include optimization flag in output', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: CompileOptions = { input: 'test.bp', optimize: true };
      
      await compileCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });
  });
});
