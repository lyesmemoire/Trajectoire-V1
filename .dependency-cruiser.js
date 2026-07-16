export default {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Warns on circular dependencies.',
      from: {},
      to: { circular: true }
    },
    {
      name: 'domain-is-pure',
      severity: 'error',
      comment: 'Domain must not depend on Application or Infrastructure or Integration.',
      from: { path: "^core/voice-interview/domain/" },
      to: { path: "^core/voice-interview/(application|infrastructure|integration)/" }
    },
    {
      name: 'application-layer-rules',
      severity: 'error',
      comment: 'Application can only depend on Domain (and itself).',
      from: { path: "^core/voice-interview/application/" },
      to: { path: "^core/voice-interview/(infrastructure|integration)/" }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: ['npm', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-bundled', 'npm-no-pkg']
    },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' }
  }
};
