// Temporary type declarations for external modules (core/p5, core/p6, lib)
// This allows the build to proceed while the monorepo architecture is being restructured

declare module '@core-p5/*' {
  const value: any;
  export default value;
  export { value };
}

declare module '@core-p6/*' {
  const value: any;
  export default value;
  export { value };
}

declare module '@lib/*' {
  const value: any;
  export default value;
  export { value };
}

declare module '../../core/p5/*' {
  const value: any;
  export default value;
  export { value };
}

declare module '../../core/p6/*' {
  const value: any;
  export default value;
  export { value };
}

declare module '../../lib/*' {
  const value: any;
  export default value;
  export { value };
}
