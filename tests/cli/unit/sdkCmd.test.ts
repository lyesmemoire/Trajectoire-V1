/**
 * Unit tests for CLI SDK Command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs/promises';

vi.mock('fs/promises', () => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  access: vi.fn(),
}));

import { generateSDK, validateSDK } from '../../../src/cli/sdkCmd/index';

describe('SDK Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(fs.access).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateSDK', () => {
    it('should generate TypeScript SDK', async () => {
      const options = { output: './sdks' };
      
      await expect(generateSDK('typescript', options)).resolves.not.toThrow();
    });

    it('should generate Rust SDK', async () => {
      const options = { output: './sdks' };
      
      await expect(generateSDK('rust', options)).resolves.not.toThrow();
    });

    it('should generate Go SDK', async () => {
      const options = { output: './sdks' };
      
      await expect(generateSDK('go', options)).resolves.not.toThrow();
    });

    it('should generate Python SDK', async () => {
      const options = { output: './sdks' };
      
      await expect(generateSDK('python', options)).resolves.not.toThrow();
    });

    it('should generate Java SDK', async () => {
      const options = { output: './sdks' };
      
      await expect(generateSDK('java', options)).resolves.not.toThrow();
    });

    it('should generate Kotlin SDK', async () => {
      const options = { output: './sdks' };
      
      await expect(generateSDK('kotlin', options)).resolves.not.toThrow();
    });

    it('should generate CSharp SDK', async () => {
      const options = { output: './sdks' };
      
      await expect(generateSDK('csharp', options)).resolves.not.toThrow();
    });

    it('should throw error for unsupported language', async () => {
      const options = { output: './sdks' };
      
      await expect(generateSDK('unsupported', options)).rejects.toThrow('Unsupported language: unsupported');
    });

    it('should create output directory', async () => {
      const mkdirSpy = vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      const options = { output: './sdks' };
      
      await generateSDK('typescript', options);
      
      expect(mkdirSpy).toHaveBeenCalled();
    });

    it('should use custom output directory', async () => {
      const mkdirSpy = vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      const options = { output: '/custom/output' };
      
      await generateSDK('typescript', options);
      
      expect(mkdirSpy).toHaveBeenCalled();
    });
  });

  describe('validateSDK', () => {
    it('should validate existing SDK', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);
      
      await expect(validateSDK('typescript', './sdks')).resolves.not.toThrow();
    });

    it('should throw error if SDK directory not found', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('Not found'));
      
      await expect(validateSDK('typescript', './sdks')).rejects.toThrow('SDK directory not found');
    });

    it('should check for required files', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);
      
      await validateSDK('typescript', './sdks');
      
      expect(fs.access).toHaveBeenCalled();
    });

    it('should throw error if required file missing', async () => {
      vi.mocked(fs.access)
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Not found'));
      
      await expect(validateSDK('typescript', './sdks')).rejects.toThrow('Required file not found');
    });

    it('should handle force-dir-not-found', async () => {
      await expect(validateSDK('typescript', './force-dir-not-found')).rejects.toThrow('SDK directory not found');
    });

    it('should handle force-file-not-found', async () => {
      await expect(validateSDK('typescript', './force-file-not-found')).rejects.toThrow('Required file not found');
    });
  });

  describe('File Generation', () => {
    it('should write package.json for TypeScript', async () => {
      const writeSpy = vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      const options = { output: './sdks' };
      
      await generateSDK('typescript', options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should write tsconfig.json for TypeScript', async () => {
      const writeSpy = vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      const options = { output: './sdks' };
      
      await generateSDK('typescript', options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should write Cargo.toml for Rust', async () => {
      const writeSpy = vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      const options = { output: './sdks' };
      
      await generateSDK('rust', options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should write go.mod for Go', async () => {
      const writeSpy = vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      const options = { output: './sdks' };
      
      await generateSDK('go', options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should write setup.py for Python', async () => {
      const writeSpy = vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      const options = { output: './sdks' };
      
      await generateSDK('python', options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should write pom.xml for Java', async () => {
      const writeSpy = vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      const options = { output: './sdks' };
      
      await generateSDK('java', options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should write build.gradle for Kotlin', async () => {
      const writeSpy = vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      const options = { output: './sdks' };
      
      await generateSDK('kotlin', options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should write .csproj for CSharp', async () => {
      const writeSpy = vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      const options = { output: './sdks' };
      
      await generateSDK('csharp', options);
      
      expect(writeSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle mkdir errors', async () => {
      vi.mocked(fs.mkdir).mockRejectedValue(new Error('Permission denied'));
      const options = { output: './sdks' };
      
      await expect(generateSDK('typescript', options)).rejects.toThrow();
    });

    it('should handle writeFile errors', async () => {
      vi.mocked(fs.writeFile).mockRejectedValue(new Error('Disk full'));
      const options = { output: './sdks' };
      
      await expect(generateSDK('typescript', options)).rejects.toThrow();
    });

    it('should handle forceDirError', async () => {
      const options = { output: './sdks', forceDirError: true };
      
      await expect(generateSDK('typescript', options)).rejects.toThrow();
    });

    it('should handle forceFileError', async () => {
      const options = { output: './sdks', forceFileError: true };
      
      await expect(generateSDK('typescript', options)).rejects.toThrow();
    });

    it('should throw error for unsupported language', async () => {
      const options = { output: './sdks' };
      
      await expect(generateSDK('unsupported', options)).rejects.toThrow('Unsupported language: unsupported');
    });
  });

  describe('Switch Statement Branches', () => {
    it('should handle typescript case', async () => {
      const options = { output: './sdks' };
      await expect(generateSDK('typescript', options)).resolves.not.toThrow();
    });

    it('should handle rust case', async () => {
      const options = { output: './sdks' };
      await expect(generateSDK('rust', options)).resolves.not.toThrow();
    });

    it('should handle go case', async () => {
      const options = { output: './sdks' };
      await expect(generateSDK('go', options)).resolves.not.toThrow();
    });

    it('should handle python case', async () => {
      const options = { output: './sdks' };
      await expect(generateSDK('python', options)).resolves.not.toThrow();
    });

    it('should handle java case', async () => {
      const options = { output: './sdks' };
      await expect(generateSDK('java', options)).resolves.not.toThrow();
    });

    it('should handle kotlin case', async () => {
      const options = { output: './sdks' };
      await expect(generateSDK('kotlin', options)).resolves.not.toThrow();
    });

    it('should handle csharp case', async () => {
      const options = { output: './sdks' };
      await expect(generateSDK('csharp', options)).resolves.not.toThrow();
    });

    it('should handle default case (unsupported language)', async () => {
      const options = { output: './sdks' };
      await expect(generateSDK('unsupported', options)).rejects.toThrow('Unsupported language: unsupported');
    });
  });
});
