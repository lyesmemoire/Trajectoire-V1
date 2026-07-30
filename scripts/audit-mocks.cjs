const fs = require('fs');

const testFiles = {
  'execution-context': 'c:/Trajectoire/tests/vm/core/execution-context.test.ts',
  'memory-manager': 'c:/Trajectoire/tests/vm/memory/memory-manager.test.ts',
  'execution-pipeline': 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts',
  'instruction-cache': 'c:/Trajectoire/tests/vm/performance/instruction-cache.test.ts',
  'instruction-fetch': 'c:/Trajectoire/tests/vm/loader/instruction-fetch.test.ts',
  'instruction-decode': 'c:/Trajectoire/tests/vm/decoder/instruction-decode.test.ts',
  'instruction-execute': 'c:/Trajectoire/tests/vm/executor/instruction-execute.test.ts',
  'rollback-manager': 'c:/Trajectoire/tests/vm/advanced/rollback-manager.test.ts',
  'thread-manager': 'c:/Trajectoire/tests/vm/advanced/thread-manager.test.ts'
};

const results = {};

Object.entries(testFiles).forEach(([component, filePath]) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const mockAnalysis = {
    vi_mock: 0,
    vi_spyOn: 0,
    mockImplementation: 0,
    mockReturnValue: 0,
    mockResolvedValue: 0,
    mockFn: 0,
    totalMocks: 0,
    details: []
  };

  lines.forEach((line, index) => {
    if (line.includes('vi.mock')) {
      mockAnalysis.vi_mock++;
      mockAnalysis.details.push({ line: index + 1, type: 'vi.mock', content: line.trim() });
    }
    if (line.includes('vi.spyOn')) {
      mockAnalysis.vi_spyOn++;
      mockAnalysis.details.push({ line: index + 1, type: 'vi.spyOn', content: line.trim() });
    }
    if (line.includes('mockImplementation')) {
      mockAnalysis.mockImplementation++;
      mockAnalysis.details.push({ line: index + 1, type: 'mockImplementation', content: line.trim() });
    }
    if (line.includes('mockReturnValue')) {
      mockAnalysis.mockReturnValue++;
      mockAnalysis.details.push({ line: index + 1, type: 'mockReturnValue', content: line.trim() });
    }
    if (line.includes('mockResolvedValue')) {
      mockAnalysis.mockResolvedValue++;
      mockAnalysis.details.push({ line: index + 1, type: 'mockResolvedValue', content: line.trim() });
    }
    if (line.includes('.mockReturnValue') || line.includes('.mockImplementation') || line.includes('.mockResolvedValue')) {
      mockAnalysis.mockFn++;
    }
  });

  mockAnalysis.totalMocks = mockAnalysis.vi_mock + mockAnalysis.vi_spyOn + 
                           mockAnalysis.mockImplementation + mockAnalysis.mockReturnValue + 
                           mockAnalysis.mockResolvedValue + mockAnalysis.mockFn;

  // Score de confiance: plus de mocks = score plus bas
  // 0 mocks = 100, 1-5 mocks = 80, 6-10 = 60, 10+ = 40
  let confidenceScore = 100;
  if (mockAnalysis.totalMocks > 10) confidenceScore = 40;
  else if (mockAnalysis.totalMocks > 5) confidenceScore = 60;
  else if (mockAnalysis.totalMocks > 0) confidenceScore = 80;

  results[component] = {
    ...mockAnalysis,
    confidenceScore,
    hasMocks: mockAnalysis.totalMocks > 0
  };
});

console.log(JSON.stringify(results, null, 2));
