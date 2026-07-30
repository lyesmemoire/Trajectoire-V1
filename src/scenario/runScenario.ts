export async function runScenario(scenario?: _unknown) {
  console.log('Running scenario:', scenario);
  const trace = [
    {
      runId: 'test-run-' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'scenario-start',
      data: scenario || {}
    },
    {
      runId: 'test-run-' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'scenario-complete',
      data: { success: true }
    }
  ];
  return trace;
}
