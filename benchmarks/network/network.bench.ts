import { bench, describe } from 'vitest';
import { ClusterManager } from '../../compiler/cpr/cluster-manager';

describe('Network Benchmarks', () => {
  bench('Cluster - add node', () => {
    const cluster = new ClusterManager();
    cluster.addNode({ id: 'node1', address: 'localhost:8080' });
  });

  bench('Cluster - add 100 nodes', () => {
    const cluster = new ClusterManager();
    for (let i = 0; i < 100; i++) {
      cluster.addNode({ id: `node${i}`, address: `localhost:${8080 + i}` });
    }
  });

  bench('Cluster - broadcast message', () => {
    const cluster = new ClusterManager();
    for (let i = 0; i < 10; i++) {
      cluster.addNode({ id: `node${i}`, address: `localhost:${8080 + i}` });
    }
    cluster.broadcast({ type: 'test', data: {} });
  });

  bench('Cluster - consensus round', () => {
    const cluster = new ClusterManager();
    for (let i = 0; i < 5; i++) {
      cluster.addNode({ id: `node${i}`, address: `localhost:${8080 + i}` });
    }
    cluster.runConsensus();
  });
});
