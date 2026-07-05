/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'This dependency is part of a circular relationship. You might want to revise ' +
        'your solution (i.e. use dependency inversion, or move to a common module)',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'domain-isolation',
      severity: 'error',
      comment: 'The domain layer MUST NOT depend on application, ports, or infrastructure layers.',
      from: {
        path: '^lib/([^/]+)/domain'
      },
      to: {
        path: '^lib/([^/]+)/(application|infrastructure|ports)'
      }
    },
    {
      name: 'application-isolation',
      severity: 'error',
      comment: 'The application layer MUST NOT depend on infrastructure layer. It should only depend on domain and ports.',
      from: {
        path: '^lib/([^/]+)/application'
      },
      to: {
        path: '^lib/([^/]+)/infrastructure'
      }
    },
    {
      name: 'cross-domain-isolation',
      severity: 'error',
      comment: 'Domains MUST NOT depend on the internals of other domains. They should only use the public index.ts of another domain.',
      from: {
        path: '^lib/([^/]+)/'
      },
      to: {
        path: '^lib/([^/]+)/',
        pathNot: ['^lib/$1/', '^lib/core/', '^lib/[^/]+/index\\.ts$']
      }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    includeOnly: '^lib/',
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json'
    }
  }
};
