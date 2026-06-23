import { verifierContracts } from "./verifyTrace";

export function assertVerifierContracts(): void {
  // Simple sanity check for each verifier contract
  // Throws on first violation to surface errors early in CI
  // Contracts must have a non‑empty name and version >= 1
  // Critical flag must be boolean (TS ensures it)
  // Import from the generated export list
   
  for (const c of verifierContracts) {
    if (!c.name || typeof c.name !== 'string' || c.name.trim() === '') {
      throw new Error('Verifier contract missing valid name');
    }
    if (typeof c.version !== 'number' || c.version < 1) {
      throw new Error(`Verifier contract ${c.name} has invalid version ${c.version}`);
    }
    if (typeof c.critical !== 'boolean') {
      throw new Error(`Verifier contract ${c.name} critical flag must be boolean`);
    }
  }
}
