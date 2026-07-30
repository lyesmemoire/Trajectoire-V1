import fc from 'fast-check';
import { Register, RegisterTable } from '../../../../compiler/cbs/register-table';

// Generates a valid Register map with random values
export const registersArb = fc.record(
  RegisterTable.getAllRegisters().reduce((acc, reg) => {
    // Generate valid 32-bit integers for registers
    acc[reg as unknown as string] = fc.integer({ min: -2147483648, max: 2147483647 });
    return acc;
  }, {} as Record<string, fc.Arbitrary<number>>)
).map(record => {
  const map = new Map<Register, number>();
  for (const [key, value] of Object.entries(record)) {
    map.set(Number(key) as Register, value);
  }
  return map;
});
