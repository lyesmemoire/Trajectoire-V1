// lease_audit.ts - temporary audit script for LeaseManager
import { LeaseManager } from "../src/watchdog/federation/LeaseManager";
import * as fs from "fs";
import * as path from "path";

function log(step:string, result:any){ console.log(`${step}\t${JSON.stringify(result)}`); }

const nodeId1 = "node1";
const leaseTtl = 60000; // ms, not used in logic
// Ensure clean state for node1
const leaseFile1 = path.join(require('os').tmpdir(), `lease-${nodeId1}.json`);
if (fs.existsSync(leaseFile1)) fs.unlinkSync(leaseFile1);

const lm1 = new LeaseManager(nodeId1, leaseTtl);
log("acquireTerm1", lm1.acquire(1)); // expect true
log("acquireAgainTerm1", lm1.acquire(1)); // expect false
log("renewTerm1", lm1.renew(1)); // expect true
log("isValidAfterRenew", lm1.isValid(1)); // expect true
log("currentLease", lm1.getLease());

// Simulate restart – new instance should load persisted lease
const lm1_restart = new LeaseManager(nodeId1, leaseTtl);
log("postRestartIsValid", lm1_restart.isValid(1)); // expect true
log("postRestartLease", lm1_restart.getLease());

// Release lease
lm1_restart.release();
log("afterReleaseIsValid", lm1_restart.isValid(1)); // expect false

// Acquire new term after release
log("acquireTerm2", lm1_restart.acquire(2)); // expect true
log("leaseAfterTerm2", lm1_restart.getLease());

// Test exclusive lease: node2 attempts to acquire same term 2
const nodeId2 = "node2";
const leaseFile2 = path.join(require('os').tmpdir(), `lease-${nodeId2}.json`);
if (fs.existsSync(leaseFile2)) fs.unlinkSync(leaseFile2);
const lm2 = new LeaseManager(nodeId2, leaseTtl);
log("node2AcquireTerm2", lm2.acquire(2)); // expect false because node1 holds lease

// Fault overlay revocation: induce risk >0.75 and criticalCount>=2
lm1_restart.revokeIfFaulty({ leaseRisk: 0.8, criticalCount: 2 });
log("afterRiskAtRisk", { atRisk: (lm1_restart as any).atRisk }); // internal state, expect true
// Continue ticking to reach riskTicks >=5
for(let i=0;i<5;i++) lm1_restart.revokeIfFaulty({ leaseRisk: 0.8, criticalCount: 2 });
log("afterRiskTicks", { riskTicks: (lm1_restart as any).riskTicks, leaseExists: !!lm1_restart.getLease() }); // expect lease released
