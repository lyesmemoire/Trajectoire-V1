#!/usr/bin/env node

/**
 * Blueprint Package Manager CLI
 */

import { program } from 'commander';
import { PackageRegistry } from './registry';
import { PackageInstaller } from './installer';
import { DependencyResolver } from './dependency-resolver';

const registry = new PackageRegistry({
  url: 'https://registry.blueprint.dev',
  cachePath: '~/.blueprint/cache',
});

const installer = new PackageInstaller(registry);
const resolver = new DependencyResolver();

program
  .name('blueprint-pm')
  .description('Blueprint Package Manager')
  .version('1.0.0');

program
  .command('install <package>')
  .description('Install a package')
  .option('-v, --version <version>', 'Specific version to install')
  .option('-D, --save-dev', 'Save as dev. dependency')
  .option('-E, --save-exact', 'Save exact version')
  .action(async (pkg, options) => {
    await installer.install(pkg, options.version, {
      targetPath: './node_modules',
      dev: options.saveDev,
      exact: options.saveExact,
    });
  });

program
  .command('uninstall <package>')
  .description('Uninstall a package')
  .action(async (pkg) => {
    await installer.uninstall(pkg);
  });

program
  .command('publish <path>')
  .description('Publish a package')
  .option('--registry <url>', 'Registry URL')
  .option('--token <token>', 'Authentication token')
  .option('--tag <tag>', 'Distribution tag')
  .action(async (path, options) => {
    // Implementation would publish package
  });

program
  .command('search <query>')
  .description('Search for packages')
  .action(async (query) => {
    const results = await registry.search(query);
    console.log(results);
  });

program
  .command('resolve')
  .description('Resolve dependencies')
  .action(async () => {
    const dependencies = [];
    const graph = await resolver.resolve(dependencies);
    console.log(graph);
  });

program.parse();
