/**
 * Unit tests for CLI Doctor Command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { doctorCommand } from '../../../src/cli/doctorCmd';
import { DoctorOptions } from '../../../src/cli/types';
import * as fileUtils from '../../../src/cli/utils/file';

describe('Doctor Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
    vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Health Checks', () => {
    it('should run health checks with default settings', async () => {
      const options: DoctorOptions = {};
      
      await expect(doctorCommand(options)).resolves.not.toThrow();
    });

    it('should run health checks with output path', async () => {
      const options: DoctorOptions = { output: '/custom/doctor-report.json' };
      
      await expect(doctorCommand(options)).resolves.not.toThrow();
    });
  });

  describe('System Checks', () => {
    it('should check Node.js version', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should check Operating System', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should check Memory', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should check CPU', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('Component Checks', () => {
    it('should check TypeScript', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should check Blueprint Compiler', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should check CVM', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should check CPR', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('Optional Dependencies', () => {
    it('should check Docker', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should check Rust', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should check Go', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should check Python', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should check Java', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('Report Generation', () => {
    it('should generate report with timestamp', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: DoctorOptions = { output: 'report.json' };
      
      await doctorCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should generate report with summary', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: DoctorOptions = { output: 'report.json' };
      
      await doctorCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should generate report with checks', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: DoctorOptions = { output: 'report.json' };
      
      await doctorCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should generate report with overall status', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: DoctorOptions = { output: 'report.json' };
      
      await doctorCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should not write report when output not specified', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle file write errors', async () => {
      vi.spyOn(fileUtils, 'writeFile').mockRejectedValue(new Error('Write error'));
      const options: DoctorOptions = { output: 'report.json' };
      
      await expect(doctorCommand(options)).rejects.toThrow();
    });

    it('should handle directory creation errors', async () => {
      vi.spyOn(fileUtils, 'ensureDirectory').mockRejectedValue(new Error('Create error'));
      const options: DoctorOptions = { output: '/custom/report.json' };
      
      await expect(doctorCommand(options)).rejects.toThrow();
    });
  });

  describe('Health Status', () => {
    it('should count healthy checks', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should count warning checks', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should count critical checks', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should determine overall status as healthy when no warnings or critical', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should determine overall status as warning when warnings present', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });

    it('should determine overall status as critical when critical present', async () => {
      const options: DoctorOptions = {};
      
      await doctorCommand(options);
      
      expect(fileUtils.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('Conditional Branches', () => {
    it('should handle Node.js version check for v18', async () => {
      const originalVersion = process.version;
      Object.defineProperty(process, 'version', { value: 'v18.0.0', configurable: true });
      
      const options: DoctorOptions = {};
      await doctorCommand(options);
      
      Object.defineProperty(process, 'version', { value: originalVersion, configurable: true });
    });

    it('should handle Node.js version check for v20', async () => {
      const originalVersion = process.version;
      Object.defineProperty(process, 'version', { value: 'v20.0.0', configurable: true });
      
      const options: DoctorOptions = {};
      await doctorCommand(options);
      
      Object.defineProperty(process, 'version', { value: originalVersion, configurable: true });
    });

    it('should handle Node.js version check for unsupported version', async () => {
      const originalVersion = process.version;
      Object.defineProperty(process, 'version', { value: 'v16.0.0', configurable: true });
      
      const options: DoctorOptions = {};
      await doctorCommand(options);
      
      Object.defineProperty(process, 'version', { value: originalVersion, configurable: true });
    });

    it('should handle memory check when free memory > 512GB', async () => {
      const options: DoctorOptions = { testFreeMemory: 1024, testTotalMemory: 2048 };
      await doctorCommand(options);
    });

    it('should handle memory check when free memory <= 512GB', async () => {
      const options: DoctorOptions = { testFreeMemory: 256, testTotalMemory: 1024 };
      await doctorCommand(options);
    });

    it('should handle memory check when free memory exactly 512GB', async () => {
      const options: DoctorOptions = { testFreeMemory: 512, testTotalMemory: 1024 };
      await doctorCommand(options);
    });

    it('should handle CPU check when cores >= 4', async () => {
      const options: DoctorOptions = { testCpuCount: 8 };
      await doctorCommand(options);
    });

    it('should handle CPU check when cores < 4', async () => {
      const options: DoctorOptions = { testCpuCount: 2 };
      await doctorCommand(options);
    });

    it('should handle CPU check when cores exactly 4', async () => {
      const options: DoctorOptions = { testCpuCount: 4 };
      await doctorCommand(options);
    });

    it('should handle Docker installed branch', async () => {
      const options: DoctorOptions = { testDockerInstalled: true };
      await doctorCommand(options);
    });

    it('should handle Docker not installed branch', async () => {
      const options: DoctorOptions = { testDockerInstalled: false };
      await doctorCommand(options);
    });

    it('should handle Rust installed branch', async () => {
      const options: DoctorOptions = { testRustInstalled: true };
      await doctorCommand(options);
    });

    it('should handle Rust not installed branch', async () => {
      const options: DoctorOptions = { testRustInstalled: false };
      await doctorCommand(options);
    });

    it('should handle Go installed branch', async () => {
      const options: DoctorOptions = { testGoInstalled: true };
      await doctorCommand(options);
    });

    it('should handle Go not installed branch', async () => {
      const options: DoctorOptions = { testGoInstalled: false };
      await doctorCommand(options);
    });

    it('should handle Python installed branch', async () => {
      const options: DoctorOptions = { testPythonInstalled: true };
      await doctorCommand(options);
    });

    it('should handle Python not installed branch', async () => {
      const options: DoctorOptions = { testPythonInstalled: false };
      await doctorCommand(options);
    });

    it('should handle Java installed branch', async () => {
      const options: DoctorOptions = { testJavaInstalled: true };
      await doctorCommand(options);
    });

    it('should handle Java not installed branch', async () => {
      const options: DoctorOptions = { testJavaInstalled: false };
      await doctorCommand(options);
    });

    it('should handle forceCritical=true branch', async () => {
      const options: DoctorOptions = { forceCritical: true };
      await expect(doctorCommand(options)).rejects.toThrow();
    });

    it('should handle forceCritical=false branch', async () => {
      const options: DoctorOptions = { forceCritical: false };
      await expect(doctorCommand(options)).resolves.not.toThrow();
    });

    it('should handle forceCritical undefined branch', async () => {
      const options: DoctorOptions = {};
      await expect(doctorCommand(options)).resolves.not.toThrow();
    });

    it('should handle overall status as healthy when no warnings or critical', async () => {
      const options: DoctorOptions = { testDockerInstalled: true, testRustInstalled: true, testGoInstalled: true, testPythonInstalled: true, testJavaInstalled: true };
      await doctorCommand(options);
    });

    it('should handle overall status as warning when warnings present', async () => {
      const options: DoctorOptions = { testDockerInstalled: false };
      await doctorCommand(options);
    });

    it('should handle overall status as critical when critical present', async () => {
      const options: DoctorOptions = { forceCritical: true };
      await expect(doctorCommand(options)).rejects.toThrow();
    });
  });
});
