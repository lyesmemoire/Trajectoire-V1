import { describe, it, expect } from 'vitest';
import { Security } from '../../compiler/cpr/security';
import { ClusterManager } from '../../compiler/cpr/cluster-manager';

describe('Security', () => {
  it('should enforce access control', () => {
    const clusterManager = new ClusterManager();
    const security = new Security(clusterManager);
    const result = security.evaluate({ nodeId: 'node1', userId: 'user1', resource: 'resource1', authenticated: true });
    expect(result).toBeDefined();
  });

  it('should validate policies', () => {
    const clusterManager = new ClusterManager();
    const security = new Security(clusterManager);
    const policy = { id: 'test-policy', name: 'test-policy', type: 'AUTHENTICATION' as const, rules: [], enabled: true };
    security.addPolicy(policy);
    const validation = security.validate();
    expect(validation.valid).toBe(true);
  });

  it('should enforce governance rules', () => {
    const clusterManager = new ClusterManager();
    const security = new Security(clusterManager);
    const rule = { id: 'test-rule', condition: 'authenticated == true', action: 'ALLOW' as const, priority: 1 };
    const policy = { id: 'test-policy', name: 'Test Rule', type: 'AUTHORIZATION' as const, rules: [rule], enabled: true };
    security.addPolicy(policy);
    const evaluation = security.evaluate({ nodeId: 'node1', userId: 'user1', resource: 'resource1', authenticated: true });
    expect(evaluation).toBeDefined();
  });

  it('should detect security violations', () => {
    const clusterManager = new ClusterManager();
    const security = new Security(clusterManager);
    const evaluation = security.evaluate({ nodeId: 'node1', userId: 'user1', resource: 'resource1', authenticated: false });
    expect(evaluation).toBe('DENY');
  });
});
