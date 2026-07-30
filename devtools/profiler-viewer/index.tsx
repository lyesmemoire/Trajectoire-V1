import React from 'react';

interface ProfileSample {
  function: string;
  samples: number;
  totalTime: number;
  selfTime: number;
}

interface ProfilerViewerProps {
  samples: ProfileSample[];
}

export const ProfilerViewer: React.FC<ProfilerViewerProps> = ({ samples }) => {
  const totalSamples = samples.reduce((sum, s) => sum + s.samples, 0);

  return (
    <div className="profiler-viewer">
      <table>
        <thead>
          <tr>
            <th>Function</th>
            <th>Samples</th>
            <th>%</th>
            <th>Total Time</th>
            <th>Self Time</th>
          </tr>
        </thead>
        <tbody>
          {samples
            .sort((a, b) => b.samples - a.samples)
            .map((sample, i) => (
              <tr key={i}>
                <td>{sample.function}</td>
                <td>{sample.samples}</td>
                <td>{((sample.samples / totalSamples) * 100).toFixed(2)}%</td>
                <td>{sample.totalTime.toFixed(2)}ms</td>
                <td>{sample.selfTime.toFixed(2)}ms</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
