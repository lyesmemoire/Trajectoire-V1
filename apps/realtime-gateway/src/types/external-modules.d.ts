/**
 * Temporary compatibility declaration for repository-level lib imports.
 *
 * TODO:
 * Remove this shim once the remaining ATS contracts consumed by the
 * realtime gateway are exposed through a proper workspace package.
 */
declare module '../../lib/*' {
  const value: any;
  export default value;
  export { value };
}
